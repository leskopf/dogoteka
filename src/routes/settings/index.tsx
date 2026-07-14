import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { PageShell } from '@/components/layout/PageShell'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { useSettings } from '@/hooks/useSettings'
import { settingsSchema, type SettingsFormValues } from '@/schemas/settings.schema'

export const Route = createFileRoute('/settings/')({
  component: SettingsPage,
})

function SettingsPage() {
  const { settings, loading, update } = useSettings()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      max_capacity: 1,
      issuer_name: '',
      issuer_address: '',
      issuer_ico: '',
      issuer_dic: '',
      issuer_phone: '',
      issuer_email: '',
      issuer_web: '',
      bank_account: '',
      bank_iban: '',
      bank_name: '',
      default_rate_czk: undefined,
      invoice_counter: undefined,
    },
  })

  useEffect(() => {
    if (settings) {
      reset({
        max_capacity: settings.max_capacity ?? 1,
        issuer_name: settings.issuer_name ?? '',
        issuer_address: settings.issuer_address ?? '',
        issuer_ico: settings.issuer_ico ?? '',
        issuer_dic: settings.issuer_dic ?? '',
        issuer_phone: settings.issuer_phone ?? '',
        issuer_email: settings.issuer_email ?? '',
        issuer_web: settings.issuer_web ?? '',
        bank_account: settings.bank_account ?? '',
        bank_iban: settings.bank_iban ?? '',
        bank_name: settings.bank_name ?? '',
        default_rate_czk: settings.default_rate_czk ?? undefined,
        invoice_counter: settings.invoice_counter ?? undefined,
      })
    }
  }, [settings, reset])

  const onSubmit = async (values: SettingsFormValues) => {
    try {
      // Transformuj prázdné stringy na null pro DB konzistenci
      const sanitized = Object.fromEntries(
        Object.entries(values).map(([k, v]) => [k, v === '' ? null : v])
      ) as SettingsFormValues
      await update(sanitized)
      toast.success('Nastavení uloženo')
    } catch {
      toast.error('Chyba při ukládání')
    }
  }

  const cardClass =
    'rounded-[--radius-card] border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900'

  if (loading) {
    return (
      <PageShell>
        <div className="max-w-2xl space-y-6">
          <Skeleton className="h-8 w-48" />
          <div className={cardClass}>
            <div className="space-y-4">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
          <div className={cardClass}>
            <div className="space-y-4">
              <Skeleton className="h-5 w-40" />
              {Array.from({ length: 7 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          </div>
          <div className={cardClass}>
            <div className="space-y-4">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
      </PageShell>
    )
  }

  return (
    <PageShell>
      <div className="max-w-2xl space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Nastavení</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Sekce 1: Obecné nastavení */}
          <div className={cardClass}>
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
              Obecné nastavení
            </h2>
            <div className="space-y-4">
              <Input
                label="Kapacita (max. počet psů)"
                type="number"
                min={1}
                hint="Maximální počet psů, kteří mohou být ubytováni současně"
                error={errors.max_capacity?.message}
                {...register('max_capacity')}
              />
            </div>
          </div>

          {/* Sekce 2: Fakturační údaje */}
          <div className={cardClass}>
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
              Fakturační údaje
            </h2>
            <div className="space-y-4">
              <Input
                label="Jméno / název firmy"
                error={errors.issuer_name?.message}
                {...register('issuer_name')}
              />
              <Input
                label="Adresa"
                error={errors.issuer_address?.message}
                {...register('issuer_address')}
              />
              <Input
                label="IČO"
                error={errors.issuer_ico?.message}
                {...register('issuer_ico')}
              />
              <Input
                label="DIČ"
                hint="Vyplňte jen pokud jste plátce DPH"
                error={errors.issuer_dic?.message}
                {...register('issuer_dic')}
              />
              <Input
                label="Telefon"
                type="tel"
                error={errors.issuer_phone?.message}
                {...register('issuer_phone')}
              />
              <Input
                label="E-mail"
                type="email"
                error={errors.issuer_email?.message}
                {...register('issuer_email')}
              />
              <Input
                label="Web"
                type="url"
                placeholder="https://..."
                error={errors.issuer_web?.message}
                {...register('issuer_web')}
              />
              <Input
                label="Číslo účtu"
                hint="Formát: 1234567890/0800"
                error={errors.bank_account?.message}
                {...register('bank_account')}
              />
              <Input
                label="IBAN"
                hint="Formát: CZ6508000000001234567890"
                error={errors.bank_iban?.message}
                {...register('bank_iban')}
              />
              <Input
                label="Název banky"
                error={errors.bank_name?.message}
                {...register('bank_name')}
              />
              <Input
                label="Výchozí sazba za noc (Kč)"
                type="number"
                min={0}
                step="0.01"
                hint="Používá se jako výchozí částka při vytváření zálohy nebo dofakturace"
                error={errors.default_rate_czk?.message}
                {...register('default_rate_czk')}
              />
            </div>
          </div>

          {/* Sekce 3: Fakturace — pokročilé */}
          <div className={cardClass}>
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
              Fakturace — pokročilé
            </h2>
            <div className="space-y-4">
              <Input
                label="Aktuální počítadlo faktur"
                type="number"
                min={0}
                hint="Číslování pokračuje od této hodnoty. Nastavením na 0 se číslování restartuje od 1. Změňte jen pokud potřebujete reset."
                error={errors.invoice_counter?.message}
                {...register('invoice_counter')}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" loading={isSubmitting}>
              Uložit nastavení
            </Button>
          </div>
        </form>
      </div>
    </PageShell>
  )
}
