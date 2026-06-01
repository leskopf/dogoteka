import { useState } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useStay } from '@/hooks/useStays'
import { NoteTimeline } from '@/components/stays/NoteTimeline'
import { PaymentPanel } from '@/components/stays/PaymentPanel'
import { DogTagPill } from '@/components/dogs/DogTagPill'
import { PageShell } from '@/components/layout/PageShell'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Skeleton } from '@/components/ui/Skeleton'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { formatDate, getPublicPhotoUrl } from '@/lib/utils'

export const Route = createFileRoute('/stays/$stayId')({
  component: StayDetailPage,
})

function StayDetailPage() {
  const { stayId } = Route.useParams()
  const { stay, notes, loading, refetch, addNote, deleteNote } = useStay(stayId)
  const navigate = useNavigate()

  const [editingDates, setEditingDates] = useState(false)
  const [editFrom, setEditFrom] = useState('')
  const [editTo, setEditTo] = useState('')
  const [savingDates, setSavingDates] = useState(false)

  const openDateEdit = () => {
    setEditFrom(stay!.date_from)
    setEditTo(stay!.date_to)
    setEditingDates(true)
  }

  const handleSaveDates = async () => {
    if (!editFrom || !editTo || editFrom > editTo) {
      toast.error('Neplatný termín')
      return
    }
    setSavingDates(true)
    const { error } = await supabase.from('stays').update({ date_from: editFrom, date_to: editTo }).eq('id', stayId)
    if (error) {
      toast.error('Chyba při ukládání termínu')
    } else {
      toast.success('Termín upraven')
      setEditingDates(false)
      refetch()
    }
    setSavingDates(false)
  }

  if (loading) {
    return (
      <PageShell>
        <Skeleton className="h-8 w-48 mb-4" />
        <Skeleton className="h-48 w-full" />
      </PageShell>
    )
  }

  if (!stay) return <PageShell><p>Termín nenalezen.</p></PageShell>

  const dog = stay.dogs as any
  const owner = dog?.owners
  const primaryPhoto = dog?.dog_photos?.find((p: any) => p.is_primary) ?? dog?.dog_photos?.[0]
  const photoUrl = primaryPhoto ? getPublicPhotoUrl(primaryPhoto.storage_path) : null

  const handleDelete = async () => {
    if (!confirm('Smazat tento termín?')) return
    await supabase.from('stays').delete().eq('id', stayId)
    toast.success('Termín smazán')
    navigate({ to: '/calendar' })
  }

  const today = new Date().toISOString().split('T')[0]
  const isActive = stay.date_from <= today && stay.date_to >= today

  return (
    <PageShell>
      <div className="space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Pobyt — {dog?.name}
            </h1>
            {editingDates ? (
              <div className="mt-2 flex flex-wrap items-end gap-2">
                <Input type="date" label="Od" value={editFrom} onChange={(e) => setEditFrom(e.target.value)} />
                <Input type="date" label="Do" value={editTo} onChange={(e) => setEditTo(e.target.value)} />
                <div className="flex gap-2 pb-0.5">
                  <Button variant="primary" size="sm" loading={savingDates} onClick={handleSaveDates}>Uložit</Button>
                  <Button variant="ghost" size="sm" onClick={() => setEditingDates(false)}>Zrušit</Button>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
                {formatDate(stay.date_from)} – {formatDate(stay.date_to)}
                {isActive && (
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-green-600 dark:text-green-400">
                    <span className="size-1.5 rounded-full bg-green-500 animate-pulse inline-block" />
                    Probíhá
                  </span>
                )}
                <Button variant="secondary" size="sm" onClick={openDateEdit}>
                  Upravit termín
                </Button>
              </p>
            )}
          </div>
          <Button variant="danger" size="sm" onClick={handleDelete}>Smazat termín</Button>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="rounded-[--radius-card] border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
            <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Pes</h2>
            <div className="flex items-start gap-4">
              {photoUrl ? (
                <img src={photoUrl} alt={dog?.name} loading="lazy" className="size-16 rounded-lg object-cover" />
              ) : (
                <div className="size-16 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-2xl">🐶</div>
              )}
              <div className="space-y-1">
                <Link
                  to="/dogs/$dogId"
                  params={{ dogId: dog?.id }}
                  className="font-semibold text-gray-900 dark:text-gray-100 hover:text-brand-600 dark:hover:text-brand-400"
                >
                  {dog?.name}
                </Link>
                {dog?.breed && <p className="text-sm text-gray-500 dark:text-gray-400">{dog.breed}</p>}
                {dog?.dog_tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {dog.dog_tags.map((tag: any) => <DogTagPill key={tag.id} tag={tag} />)}
                  </div>
                )}
                {dog?.food_notes && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2"><strong>Krmení:</strong> {dog.food_notes}</p>
                )}
                {dog?.medication && (
                  <p className="text-xs text-gray-500 dark:text-gray-400"><strong>Léky:</strong> {dog.medication}</p>
                )}
              </div>
            </div>
          </div>

          {owner && (
            <div className="rounded-[--radius-card] border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
              <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Majitel</h2>
              <div className="space-y-2">
                <Link
                  to="/owners/$ownerId"
                  params={{ ownerId: owner.id }}
                  className="font-medium text-gray-900 dark:text-gray-100 hover:text-brand-600 dark:hover:text-brand-400"
                >
                  {owner.first_name} {owner.last_name}
                </Link>
                <p className="text-sm text-gray-600 dark:text-gray-400">{owner.phone}</p>
                {owner.phone_emergency && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">Záchranný: {owner.phone_emergency}</p>
                )}
                {owner.email && <p className="text-sm text-gray-500 dark:text-gray-400">{owner.email}</p>}
              </div>
            </div>
          )}
        </div>

        {stay.notes && (
          <div className="rounded-[--radius-card] border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
            <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Poznámky k termínu</h2>
            <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{stay.notes}</p>
          </div>
        )}

        <div className="rounded-[--radius-card] border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Zápisky z pobytu</h2>
          <NoteTimeline notes={notes} onAdd={addNote} onDelete={deleteNote} />
        </div>

        <PaymentPanel
          stayId={stayId}
          dateFrom={stay.date_from}
          dateTo={stay.date_to}
          dogName={dog?.name ?? ''}
          owner={owner ? { first_name: owner.first_name, last_name: owner.last_name, address: owner.address, phone: owner.phone, email: owner.email } : null}
        />
      </div>
    </PageShell>
  )
}
