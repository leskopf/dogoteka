import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useMemo } from 'react'
import { useStays } from '@/hooks/useStays'
import { PageShell } from '@/components/layout/PageShell'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { formatDateShort, today } from '@/lib/utils'

export const Route = createFileRoute('/stays/')({
  component: StaysPage,
})

type Filter = 'all' | 'active' | 'upcoming' | 'past'

function StaysPage() {
  const { stays, loading } = useStays()
  const [filter, setFilter] = useState<Filter>('all')
  const todayStr = today()

  const filtered = useMemo(() => {
    return stays.filter((s) => {
      if (filter === 'active') return s.date_from <= todayStr && s.date_to >= todayStr
      if (filter === 'upcoming') return s.date_from > todayStr
      if (filter === 'past') return s.date_to < todayStr
      return true
    })
  }, [stays, filter, todayStr])

  const filters: { value: Filter; label: string }[] = [
    { value: 'all', label: 'Vše' },
    { value: 'active', label: 'Probíhá' },
    { value: 'upcoming', label: 'Nadcházející' },
    { value: 'past', label: 'Minulé' },
  ]

  return (
    <PageShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Termíny</h1>
          <Link to="/stays/new">
            <Button size="sm">+ Přidat termín</Button>
          </Link>
        </div>

        <div className="flex gap-2 flex-wrap">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filter === f.value
                  ? 'bg-brand-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-5xl">📅</span>
            <p className="mt-4 text-gray-500 dark:text-gray-400">
              {filter === 'all' ? 'Zatím žádné termíny' : 'Žádné termíny v této kategorii'}
            </p>
            {filter === 'all' && (
              <Link to="/stays/new">
                <Button className="mt-4">Přidat první termín</Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((stay) => {
              const dog = stay.dogs as any
              const isActive = stay.date_from <= todayStr && stay.date_to >= todayStr
              const isUpcoming = stay.date_from > todayStr
              return (
                <Link
                  key={stay.id}
                  to="/stays/$stayId"
                  params={{ stayId: stay.id }}
                  className="flex items-center justify-between gap-4 rounded-[--radius-card] border border-gray-200 bg-white p-4 hover:border-brand-300 hover:bg-brand-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-brand-600 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">{dog?.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDateShort(stay.date_from)} – {formatDateShort(stay.date_to)}
                    </p>
                  </div>
                  <div className="shrink-0">
                    {isActive ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-700 bg-green-100 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded-full">
                        <span className="size-1.5 rounded-full bg-green-500 animate-pulse inline-block" />
                        Probíhá
                      </span>
                    ) : isUpcoming ? (
                      <span className="text-xs font-medium text-brand-700 bg-brand-100 dark:bg-brand-900/30 dark:text-brand-400 px-2 py-1 rounded-full">
                        Nadcházející
                      </span>
                    ) : (
                      <span className="text-xs font-medium text-gray-500 bg-gray-100 dark:bg-gray-800 dark:text-gray-400 px-2 py-1 rounded-full">
                        Minulý
                      </span>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </PageShell>
  )
}
