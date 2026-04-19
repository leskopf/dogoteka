import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  title: string
  count: number
  icon: ReactNode
  variant?: 'default' | 'warning'
  children?: ReactNode
}

export function StatCard({ title, count, icon, variant = 'default', children }: StatCardProps) {
  return (
    <div
      className={cn(
        'rounded-[--radius-card] border bg-white p-5 dark:bg-gray-900',
        variant === 'warning'
          ? 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/10'
          : 'border-gray-200 dark:border-gray-700'
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</span>
        <span className={cn(
          'text-xl',
          variant === 'warning' ? 'text-red-500' : 'text-brand-500'
        )}>
          {icon}
        </span>
      </div>
      <div className={cn(
        'text-3xl font-bold',
        variant === 'warning' ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-gray-100'
      )}>
        {count}
      </div>
      {children && <div className="mt-3">{children}</div>}
    </div>
  )
}
