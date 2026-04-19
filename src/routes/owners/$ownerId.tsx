import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useOwner } from '@/hooks/useOwners'
import { supabase } from '@/lib/supabase'
import { PageShell } from '@/components/layout/PageShell'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { OwnerForm } from '@/components/owners/OwnerForm'
import { toast } from 'sonner'
import { formatDateShort } from '@/lib/utils'
import { useNavigate } from '@tanstack/react-router'
import type { OwnerFormValues } from '@/schemas/owner.schema'

export const Route = createFileRoute('/owners/$ownerId')({
  component: OwnerDetailPage,
})

function OwnerDetailPage() {
  const { ownerId } = Route.useParams()
  const { owner, loading, refetch } = useOwner(ownerId)
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [dogs, setDogs] = useState<any[]>([])
  const [stays, setStays] = useState<any[]>([])

  useEffect(() => {
    supabase
      .from('dogs')
      .select('id, name, breed, dog_photos(*)')
      .eq('owner_id', ownerId)
      .then(({ data }) => setDogs(data ?? []))

    supabase
      .from('stays')
      .select('id, date_from, date_to, notes, dogs!inner(id, name, owner_id)')
      .eq('dogs.owner_id', ownerId)
      .order('date_from', { ascending: false })
      .then(({ data }) => setStays(data ?? []))
  }, [ownerId])

  if (loading) {
    return (
      <PageShell>
        <Skeleton className="h-8 w-48 mb-6" />
        <Skeleton className="h-48 w-full" />
      </PageShell>
    )
  }

  if (!owner) return <PageShell><p>Majitel nenalezen.</p></PageShell>

  const handleUpdate = async (values: OwnerFormValues) => {
    setSubmitting(true)
    const { error } = await supabase.from('owners').update(values).eq('id', ownerId)
    if (error) {
      toast.error('Nepodařilo se uložit')
    } else {
      toast.success('Uloženo')
      setEditing(false)
      refetch()
    }
    setSubmitting(false)
  }

  const handleDelete = async () => {
    if (!confirm(`Smazat majitele ${owner.first_name} ${owner.last_name}?`)) return
    await supabase.from('owners').delete().eq('id', ownerId)
    toast.success('Majitel smazán')
    navigate({ to: '/owners' })
  }

  return (
    <PageShell>
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {owner.first_name} {owner.last_name}
            </h1>
            {owner.is_recurring && <Badge variant="success" className="mt-1">Opakující se klient</Badge>}
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={() => setEditing(!editing)}>
              {editing ? 'Zrušit' : 'Upravit'}
            </Button>
            <Button variant="danger" size="sm" onClick={handleDelete}>Smazat</Button>
          </div>
        </div>

        {editing ? (
          <div className="rounded-[--radius-card] border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
            <OwnerForm defaultValues={owner} onSubmit={handleUpdate} submitting={submitting} />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="rounded-[--radius-card] border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900 space-y-3">
              <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Kontakty</h2>
              <InfoRow label="Telefon" value={owner.phone} />
              <InfoRow label="Záchranný kontakt" value={owner.phone_emergency} />
              <InfoRow label="E-mail" value={owner.email} />
              <InfoRow label="Adresa" value={owner.address} />
            </div>
            <div className="rounded-[--radius-card] border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
              <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Psi</h2>
              {dogs.length === 0 ? (
                <p className="text-sm text-gray-400">Žádní psi</p>
              ) : (
                <div className="space-y-2">
                  {dogs.map((dog) => (
                    <Link
                      key={dog.id}
                      to="/dogs/$dogId"
                      params={{ dogId: dog.id }}
                      className="flex items-center gap-2 rounded-lg p-2 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <span className="text-xl">🐶</span>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{dog.name}</p>
                        {dog.breed && <p className="text-xs text-gray-400">{dog.breed}</p>}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="rounded-[--radius-card] border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Historie pobytů</h2>
          {stays.length === 0 ? (
            <p className="text-sm text-gray-400">Žádné pobyty</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-2 pr-4 text-gray-500 dark:text-gray-400 font-medium">Pes</th>
                    <th className="text-left py-2 pr-4 text-gray-500 dark:text-gray-400 font-medium">Od</th>
                    <th className="text-left py-2 pr-4 text-gray-500 dark:text-gray-400 font-medium">Do</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {stays.map((stay) => (
                    <tr key={stay.id} className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-2 pr-4 text-gray-900 dark:text-gray-100">{(stay.dogs as any)?.name}</td>
                      <td className="py-2 pr-4">{formatDateShort(stay.date_from)}</td>
                      <td className="py-2 pr-4">{formatDateShort(stay.date_to)}</td>
                      <td className="py-2">
                        <Link to="/stays/$stayId" params={{ stayId: stay.id }} className="text-brand-600 dark:text-brand-400 hover:underline text-xs">
                          Detail
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </PageShell>
  )
}

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null
  return (
    <div className="flex gap-3">
      <span className="text-sm text-gray-500 dark:text-gray-400 w-32 shrink-0">{label}</span>
      <span className="text-sm text-gray-900 dark:text-gray-100">{value}</span>
    </div>
  )
}
