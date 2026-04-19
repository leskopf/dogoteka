import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useMemo } from 'react'
import { useDogs } from '@/hooks/useDogs'
import { DogCard } from '@/components/dogs/DogCard'
import { DogTagPill } from '@/components/dogs/DogTagPill'
import { PageShell } from '@/components/layout/PageShell'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { DogCardSkeleton } from '@/components/ui/Skeleton'

export const Route = createFileRoute('/dogs/')({
  component: DogsPage,
})

function DogsPage() {
  const { dogs, loading } = useDogs()
  const [search, setSearch] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const allTags = useMemo(() => {
    const map = new Map<string, { label: string; color: string }>()
    dogs.forEach((d) => d.dog_tags.forEach((t) => map.set(t.label, t)))
    return Array.from(map.values())
  }, [dogs])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return dogs.filter((d) => {
      const matchSearch =
        !q ||
        d.name.toLowerCase().includes(q) ||
        (d.breed ?? '').toLowerCase().includes(q) ||
        (d.owners
          ? `${d.owners.first_name} ${d.owners.last_name}`.toLowerCase().includes(q)
          : false)
      const matchTags =
        selectedTags.length === 0 ||
        selectedTags.every((tag) => d.dog_tags.some((t) => t.label === tag))
      return matchSearch && matchTags
    })
  }, [dogs, search, selectedTags])

  const toggleTag = (label: string) =>
    setSelectedTags((prev) =>
      prev.includes(label) ? prev.filter((t) => t !== label) : [...prev, label]
    )

  return (
    <PageShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Kartotéka psů</h1>
          <Link to="/dogs/new">
            <Button>
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Přidat psa
            </Button>
          </Link>
        </div>

        <div className="space-y-3">
          <Input
            placeholder="Hledat podle jména, rasy nebo majitele..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {allTags.map((tag) => (
                <button
                  key={tag.label}
                  onClick={() => toggleTag(tag.label)}
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium text-white transition-opacity ${
                    selectedTags.includes(tag.label) ? 'opacity-100 ring-2 ring-offset-1 ring-white' : 'opacity-60 hover:opacity-80'
                  }`}
                  style={{ backgroundColor: tag.color }}
                >
                  {tag.label}
                </button>
              ))}
              {selectedTags.length > 0 && (
                <button
                  onClick={() => setSelectedTags([])}
                  className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 underline"
                >
                  Zrušit filtry
                </button>
              )}
            </div>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => <DogCardSkeleton key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-5xl">🐕</span>
            <p className="mt-4 text-gray-500 dark:text-gray-400">
              {search || selectedTags.length > 0 ? 'Žádný pes neodpovídá filtru' : 'Zatím žádní psi v kartotéce'}
            </p>
            {!search && selectedTags.length === 0 && (
              <Link to="/dogs/new">
                <Button className="mt-4">Přidat prvního psa</Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filtered.map((dog) => <DogCard key={dog.id} dog={dog} />)}
          </div>
        )}
      </div>
    </PageShell>
  )
}
