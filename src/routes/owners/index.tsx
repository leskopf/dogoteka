import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useMemo } from 'react'
import { useOwners } from '@/hooks/useOwners'
import { PageShell } from '@/components/layout/PageShell'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'

export const Route = createFileRoute('/owners/')({
  component: OwnersPage,
})

function OwnersPage() {
  const { owners, loading } = useOwners()
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    if (!q) return owners
    return owners.filter(
      (o) =>
        `${o.first_name} ${o.last_name}`.toLowerCase().includes(q) ||
        o.phone.includes(q) ||
        (o.email ?? '').toLowerCase().includes(q)
    )
  }, [owners, search])

  return (
    <PageShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Majitelé</h1>
          <Link to="/owners/new">
            <Button>
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Přidat majitele
            </Button>
          </Link>
        </div>
        <Input
          placeholder="Hledat podle jména, telefonu nebo e-mailu..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-4xl">👤</span>
            <p className="mt-4 text-gray-500 dark:text-gray-400">Žádní majitelé nenalezeni</p>
          </div>
        ) : (
          <div className="rounded-[--radius-card] border border-gray-200 dark:border-gray-700 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Jméno</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Telefon</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">E-mail</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Typ</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800">
                {filtered.map((owner) => (
                  <tr key={owner.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <td className="px-5 py-3">
                      <Link
                        to="/owners/$ownerId"
                        params={{ ownerId: owner.id }}
                        className="font-medium text-gray-900 dark:text-gray-100 hover:text-brand-600 dark:hover:text-brand-400"
                      >
                        {owner.first_name} {owner.last_name}
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-600 dark:text-gray-400">{owner.phone}</td>
                    <td className="px-5 py-3 text-sm text-gray-600 dark:text-gray-400">{owner.email ?? '—'}</td>
                    <td className="px-5 py-3">
                      {owner.is_recurring && <Badge variant="success">Opakující se</Badge>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </PageShell>
  )
}
