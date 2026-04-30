import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/Button'
import { PaymentStatusBadge } from '@/components/finance/PaymentStatusBadge'
import { formatDate, formatCzk } from '@/lib/utils'
import type { PaymentWithStay } from '@/hooks/useFinance'

interface StayPaymentRowProps {
  payment: PaymentWithStay
}

export function StayPaymentRow({ payment }: StayPaymentRowProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 py-3 border-b border-gray-100 dark:border-gray-800 last:border-0">
      {/* Vlevo: info o pobytu */}
      <div className="min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <PaymentStatusBadge type={payment.type} paid={!!payment.paid_at} />
          <span className="font-semibold text-gray-900 dark:text-gray-100">
            {payment.stays.dogs.name}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {payment.stays.dogs.owners?.first_name} {payment.stays.dogs.owners?.last_name}
          </span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          {formatDate(payment.stays.date_from)} – {formatDate(payment.stays.date_to)}
          {payment.invoice_number && ` · Faktura č. ${payment.invoice_number}`}
        </p>
      </div>

      {/* Vpravo: částka + odkaz */}
      <div className="flex items-center gap-3 shrink-0">
        <span className="font-semibold text-gray-900 dark:text-gray-100">
          {formatCzk(payment.amount)}
        </span>
        <Link to="/stays/$stayId" params={{ stayId: payment.stay_id }}>
          <Button variant="ghost" size="sm">
            Detail →
          </Button>
        </Link>
      </div>
    </div>
  )
}
