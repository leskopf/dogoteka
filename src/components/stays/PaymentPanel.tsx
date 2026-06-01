import { useState } from 'react'
import { pdf } from '@react-pdf/renderer'
import { toast } from 'sonner'
import { usePaymentsForStay } from '@/hooks/usePayments'
import { useSettings } from '@/hooks/useSettings'
import { formatCzk } from '@/lib/utils'
import { generateInvoiceNumber } from '@/lib/invoice-number'
import { buildSpdString, generateQrDataUrl } from '@/lib/qr-platba'
import { InvoicePDF } from '@/components/pdf/InvoicePDF'
import { PaymentStatusBadge } from '@/components/finance/PaymentStatusBadge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import type { Payment } from '@/lib/database.types'

interface PaymentPanelProps {
  stayId: string
  dateFrom: string
  dateTo: string
  dogName: string
  owner: { first_name: string; last_name: string; address?: string | null } | null
}

export function PaymentPanel({ stayId, dateFrom, dateTo, dogName, owner }: PaymentPanelProps) {
  const { payments, loading, addPayment, updatePayment, deletePayment, refetch } =
    usePaymentsForStay(stayId)
  const { settings } = useSettings()

  const [addingType, setAddingType] = useState<'deposit' | 'final' | null>(null)
  const [formAmount, setFormAmount] = useState('')
  const [formDate, setFormDate] = useState('')
  const [formNotPaid, setFormNotPaid] = useState(false)
  const [formNotes, setFormNotes] = useState('')
  const [generating, setGenerating] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [togglingPaid, setTogglingPaid] = useState<string | null>(null)

  const nights = Math.round(
    (new Date(dateTo).getTime() - new Date(dateFrom).getTime()) / 86400000,
  )
  const defaultRate = settings?.default_rate_czk ?? 0
  const defaultDeposit = Math.round(defaultRate * nights * 0.5)
  const defaultFinal = Math.round(defaultRate * nights)


  const openForm = (type: 'deposit' | 'final') => {
    setAddingType(type)
    setFormAmount(String(type === 'deposit' ? defaultDeposit : defaultFinal))
    setFormDate(new Date().toISOString().split('T')[0])
    setFormNotPaid(false)
    setFormNotes('')
  }

  const handleAddPayment = async () => {
    setSubmitting(true)
    try {
      await addPayment({
        stay_id: stayId,
        type: addingType!,
        amount: parseFloat(formAmount) || 0,
        paid_at: formNotPaid ? null : formDate || null,
        invoice_number: null,
        notes: formNotes || null,
      })
      setAddingType(null)
      setFormAmount('')
      setFormDate('')
      setFormNotPaid(false)
      setFormNotes('')
    } catch {
      toast.error('Chyba při ukládání platby')
    } finally {
      setSubmitting(false)
    }
  }

  const handleGenerateInvoice = async (payment: Payment) => {
    if (!settings) {
      toast.error('Nastavení nejsou dostupná, načtěte stránku znovu')
      return
    }
    setGenerating(payment.id)
    try {
      const invoiceNumber = await generateInvoiceNumber()
      await updatePayment(payment.id, { invoice_number: invoiceNumber })
      let qrDataUrl: string | null = null
      if (settings.bank_iban) {
        const spd = buildSpdString({
          iban: settings.bank_iban,
          amount: payment.amount,
          invoiceNumber,
        })
        qrDataUrl = await generateQrDataUrl(spd)
      }
      const blob = await pdf(
        <InvoicePDF
          payment={{ ...payment, invoice_number: invoiceNumber }}
          stay={{ date_from: dateFrom, date_to: dateTo }}
          dogName={dogName}
          owner={owner}
          settings={settings}
          qrDataUrl={qrDataUrl}
        />,
      ).toBlob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `faktura-${invoiceNumber}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast.success(`Faktura ${invoiceNumber} vygenerována`)
    } catch (err) {
      console.error('PDF generation error:', err)
      toast.error('Chyba při generování faktury')
    } finally {
      refetch()
      setGenerating(null)
    }
  }

  const handleDownloadInvoice = async (payment: Payment) => {
    if (!settings) {
      toast.error('Nastavení nejsou dostupná, načtěte stránku znovu')
      return
    }
    setGenerating(payment.id)
    try {
      let qrDataUrl: string | null = null
      if (settings.bank_iban && payment.invoice_number) {
        const spd = buildSpdString({
          iban: settings.bank_iban,
          amount: payment.amount,
          invoiceNumber: payment.invoice_number,
        })
        qrDataUrl = await generateQrDataUrl(spd)
      }
      const blob = await pdf(
        <InvoicePDF
          payment={payment}
          stay={{ date_from: dateFrom, date_to: dateTo }}
          dogName={dogName}
          owner={owner}
          settings={settings}
          qrDataUrl={qrDataUrl}
        />,
      ).toBlob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `faktura-${payment.invoice_number}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('PDF generation error:', err)
      toast.error('Chyba při stahování faktury')
    } finally {
      refetch()
      setGenerating(null)
    }
  }

  const handleTogglePaid = async (payment: Payment) => {
    setTogglingPaid(payment.id)
    try {
      const newPaidAt = payment.paid_at ? null : new Date().toISOString().split('T')[0]
      await updatePayment(payment.id, { paid_at: newPaidAt })
    } catch {
      toast.error('Chyba při změně stavu platby')
    } finally {
      setTogglingPaid(null)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Smazat tuto platbu?')) return
    setDeleting(id)
    try {
      await deletePayment(id)
    } catch {
      toast.error('Chyba při mazání platby')
    } finally {
      setDeleting(null)
    }
  }

  const hasDeposit = payments.some((p) => p.type === 'deposit')
  const hasFinal = payments.some((p) => p.type === 'final')

  return (
    <div className="rounded-[--radius-card] border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
      <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
        Platby
      </h2>

      {loading ? (
        <div className="space-y-3">
          <div className="h-10 animate-pulse rounded bg-gray-100 dark:bg-gray-800" />
          <div className="h-10 animate-pulse rounded bg-gray-100 dark:bg-gray-800" />
        </div>
      ) : payments.length === 0 ? (
        <p className="text-sm text-gray-400 dark:text-gray-500 mb-4">Žádné platby</p>
      ) : (
        <ul className="space-y-3 mb-4">
          {payments.map((payment) => (
            <li
              key={payment.id}
              className="flex flex-wrap items-start justify-between gap-3 rounded-lg border border-gray-100 dark:border-gray-800 p-3"
            >
              <div className="flex flex-col gap-1">
                <div className="flex flex-wrap items-center gap-2">
                  <PaymentStatusBadge type={payment.type} paid={payment.paid_at !== null} />
                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {formatCzk(payment.amount)}
                  </span>
                </div>
                {payment.paid_at && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Zaplaceno: {new Date(payment.paid_at).toLocaleDateString('cs-CZ')}
                  </span>
                )}
                {payment.invoice_number && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Faktura: {payment.invoice_number}
                  </span>
                )}
                {payment.notes && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">{payment.notes}</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {payment.invoice_number ? (
                  <Button
                    variant="secondary"
                    size="sm"
                    loading={generating === payment.id}
                    disabled={generating !== null}
                    onClick={() => handleDownloadInvoice(payment)}
                  >
                    Stáhnout
                  </Button>
                ) : (
                  <Button
                    variant="secondary"
                    size="sm"
                    loading={generating === payment.id}
                    disabled={generating !== null}
                    onClick={() => handleGenerateInvoice(payment)}
                  >
                    Vygenerovat fakturu
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  loading={togglingPaid === payment.id}
                  disabled={togglingPaid === payment.id || deleting === payment.id || generating !== null}
                  onClick={() => handleTogglePaid(payment)}
                >
                  {payment.paid_at ? 'Nezaplaceno' : 'Zaplaceno'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  disabled={deleting === payment.id || generating !== null || togglingPaid === payment.id}
                  loading={deleting === payment.id}
                  onClick={() => handleDelete(payment.id)}
                >
                  Smazat
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {addingType === null ? (
        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            size="sm"
            disabled={hasDeposit}
            onClick={() => openForm('deposit')}
          >
            Přidat zálohu
          </Button>
          <Button
            variant="secondary"
            size="sm"
            disabled={hasFinal}
            onClick={() => openForm('final')}
          >
            Přidat doplatek
          </Button>
        </div>
      ) : (
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-3">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {addingType === 'deposit' ? 'Přidat zálohu' : 'Přidat doplatek'}
          </h3>

          <Input
            type="number"
            label="Částka (Kč)"
            value={formAmount}
            onChange={(e) => setFormAmount(e.target.value)}
            min={0}
          />

          <div className="flex items-center gap-2">
            <input
              id="form-not-paid"
              type="checkbox"
              checked={formNotPaid}
              onChange={(e) => setFormNotPaid(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
            />
            <label
              htmlFor="form-not-paid"
              className="text-sm text-gray-700 dark:text-gray-300 select-none cursor-pointer"
            >
              Ještě nezaplaceno
            </label>
          </div>

          <Input
            type="date"
            label="Datum zaplacení"
            value={formDate}
            onChange={(e) => setFormDate(e.target.value)}
            disabled={formNotPaid}
          />

          <Input
            type="text"
            label="Poznámka (volitelné)"
            value={formNotes}
            onChange={(e) => setFormNotes(e.target.value)}
          />

          <div className="flex gap-2">
            <Button variant="primary" size="sm" loading={submitting} onClick={handleAddPayment}>
              Uložit
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setAddingType(null)}>
              Zrušit
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
