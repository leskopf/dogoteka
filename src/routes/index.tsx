import { createFileRoute, Link } from '@tanstack/react-router'
import { useDashboard } from '@/hooks/useDashboard'
import { useAppStore } from '@/store/app.store'
import { PageShell } from '@/components/layout/PageShell'
import { StatCard } from '@/components/dashboard/StatCard'
import { CapacityBar } from '@/components/dashboard/CapacityBar'
import { DogTagPill } from '@/components/dogs/DogTagPill'
import { Skeleton } from '@/components/ui/Skeleton'
import { getPublicPhotoUrl, formatStayRange } from '@/lib/utils'

export const Route = createFileRoute('/')({
  component: DashboardPage,
})

function DashboardPage() {
  const { activeStays, departures, arrivals, loading } = useDashboard()
  const maxCapacity = useAppStore((s) => s.maxCapacity)

  if (loading) {
    return (
      <PageShell>
        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
        </div>
      </PageShell>
    )
  }

  const over = activeStays.length > maxCapacity

  return (
    <PageShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {new Date().toLocaleDateString('cs-CZ', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>

        <CapacityBar current={activeStays.length} max={maxCapacity} />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            title="Teď u mě"
            count={activeStays.length}
            variant={over ? 'warning' : 'default'}
            icon="🏠"
          >
            <div className="space-y-2">
              {activeStays.map((stay) => (
                <DogMiniCard key={stay.id} stay={stay} />
              ))}
            </div>
          </StatCard>

          <StatCard title="Dnešní odjezdy" count={departures.length} icon="👋">
            <div className="space-y-2">
              {departures.map((stay) => (
                <DogMiniCard key={stay.id} stay={stay} />
              ))}
            </div>
          </StatCard>

          <StatCard title="Zítřejší příjezdy" count={arrivals.length} icon="🎉">
            <div className="space-y-2">
              {arrivals.map((stay) => (
                <DogMiniCard key={stay.id} stay={stay} />
              ))}
            </div>
          </StatCard>
        </div>
      </div>
    </PageShell>
  )
}

function DogMiniCard({ stay }: { stay: any }) {
  const dog = stay.dogs
  const primaryPhoto = dog?.dog_photos?.find((p: any) => p.is_primary) ?? dog?.dog_photos?.[0]
  const photoUrl = primaryPhoto ? getPublicPhotoUrl(primaryPhoto.storage_path) : null

  return (
    <Link
      to="/dogs/$dogId"
      params={{ dogId: dog?.id }}
      className="flex items-center gap-2 rounded-lg p-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
    >
      {photoUrl ? (
        <img src={photoUrl} alt={dog?.name} loading="lazy" className="size-8 rounded-full object-cover" />
      ) : (
        <div className="size-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-sm">🐶</div>
      )}
      <div className="min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{dog?.name}</p>
        <p className="text-xs text-gray-400 dark:text-gray-500 truncate">
          {formatStayRange(stay)}
        </p>
      </div>
      {dog?.dog_tags?.slice(0, 1).map((tag: any) => (
        <DogTagPill key={tag.id} tag={tag} />
      ))}
    </Link>
  )
}
