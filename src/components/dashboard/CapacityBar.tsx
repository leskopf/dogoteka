import { cn } from '@/lib/utils'

interface CapacityBarProps {
  current: number
  max: number
}

export function CapacityBar({ current, max }: CapacityBarProps) {
  const pct = Math.min((current / max) * 100, 100)
  const over = current > max

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600 dark:text-gray-400">Kapacita</span>
        <span className={cn('font-semibold', over ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-gray-100')}>
          {current} / {max}
          {over && ' ⚠️ Překročena'}
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-300',
            over ? 'bg-red-500' : pct >= 80 ? 'bg-yellow-500' : 'bg-brand-500'
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
