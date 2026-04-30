import { createFileRoute } from '@tanstack/react-router'
import { useState, useMemo } from 'react'
import { PageShell } from '@/components/layout/PageShell'
import { Skeleton } from '@/components/ui/Skeleton'
import { FinanceStatCard } from '@/components/finance/FinanceStatCard'
import { StayPaymentRow } from '@/components/finance/StayPaymentRow'
import { Button } from '@/components/ui/Button'
import { useFinance } from '@/hooks/useFinance'
import { cn, formatCzk } from '@/lib/utils'

export const Route = createFileRoute('/finance/')({
  component: FinancePage,
})

type FilterType = 'all' | 'paid' | 'unpaid'

const cardClass =
  'rounded-[--radius-card] border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900'

function FinancePage() {
  const { summary, payments, loading, error, refetch } = useFinance()
  const [filter, setFilter] = useState<FilterType>('all')

  const filtered = useMemo(() => {
    if (filter === 'paid') return payments.filter((p) => p.paid_at !== null)
    if (filter === 'unpaid') return payments.filter((p) => p.paid_at === null)
    return payments
  }, [payments, filter])

  if (error) {
    return (
      <PageShell>
        <div className="text-center py-16">
          <span className="text-5xl">⚠️</span>
          <p className="mt-4 text-gray-500 dark:text-gray-400">Nepodařilo se načíst data</p>
          <Button className="mt-4" variant="secondary" onClick={refetch}>Zkusit znovu</Button>
        </div>
      </PageShell>
    )
  }

  if (loading) {
    return (
      <PageShell>
        <div className="space-y-6">
          <Skeleton className="h-8 w-32" />
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-28" />
            ))}
          </div>
          <div className={cardClass}>
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          </div>
        </div>
      </PageShell>
    )
  }

  const filters: { value: FilterType; label: string }[] = [
    { value: 'all', label: 'Vše' },
    { value: 'paid', label: 'Zaplacené' },
    { value: 'unpaid', label: 'Nezaplacené' },
  ]

  return (
    <PageShell>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Finance</h1>

        {/* Stat karty */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <FinanceStatCard
            title="Přijato tento měsíc"
            value={formatCzk(summary.totalThisMonth)}
            icon="💰"
            variant="success"
          />
          <FinanceStatCard
            title="Přijato letos"
            value={formatCzk(summary.totalThisYear)}
            icon="📊"
            variant="default"
          />
          <FinanceStatCard
            title="Čekající zálohy"
            value={String(summary.pendingDeposits)}
            icon="⏳"
            variant={summary.pendingDeposits > 0 ? 'warning' : 'default'}
          />
          <FinanceStatCard
            title="Čekající doplatky"
            value={String(summary.pendingFinals)}
            icon="📋"
            variant={summary.pendingFinals > 0 ? 'warning' : 'default'}
          />
        </div>

        {/* Filtr pills */}
        <div className="flex gap-2">
          {filters.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={cn(
                'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
                filter === value
                  ? 'bg-brand-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300',
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Tabulka plateb */}
        <div className={cardClass}>
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
            Přehled plateb
          </h2>
          {filtered.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">Žádné platby</p>
          ) : (
            filtered.map((p) => <StayPaymentRow key={p.id} payment={p} />)
          )}
        </div>
      </div>
    </PageShell>
  )
}
