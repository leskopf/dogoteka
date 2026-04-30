import { cn } from '@/lib/utils'

interface PaymentStatusBadgeProps {
  type: 'deposit' | 'final'
  paid: boolean
}

export function PaymentStatusBadge({ type, paid }: PaymentStatusBadgeProps) {
  const label =
    type === 'deposit'
      ? paid
        ? 'Záloha zaplacena'
        : 'Záloha čeká'
      : paid
        ? 'Doplatek přijat'
        : 'Doplatek čeká'

  return (
    <span
      className={cn(
        'inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full',
        paid
          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
          : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      )}
    >
      {label}
    </span>
  )
}
