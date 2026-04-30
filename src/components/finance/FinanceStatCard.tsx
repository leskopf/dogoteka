import { cn } from '@/lib/utils'

interface FinanceStatCardProps {
  title: string
  value: string
  icon: string
  variant?: 'default' | 'warning' | 'success'
  subtitle?: string
}

export function FinanceStatCard({
  title,
  value,
  icon,
  variant = 'default',
  subtitle,
}: FinanceStatCardProps) {
  return (
    <div
      className={cn(
        'rounded-[--radius-card] border bg-white p-5 dark:bg-gray-900',
        variant === 'warning'
          ? 'border-yellow-200 dark:border-yellow-800'
          : variant === 'success'
            ? 'border-green-200 dark:border-green-800'
            : 'border-gray-200 dark:border-gray-700',
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</span>
        <span className="text-xl">{icon}</span>
      </div>
      <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</div>
      {subtitle && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
      )}
    </div>
  )
}
