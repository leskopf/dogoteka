import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useDog } from '@/hooks/useDogs'
import { DogPhotoUpload } from '@/components/dogs/DogPhotoUpload'
import { DogTagPill } from '@/components/dogs/DogTagPill'
import { ShareLinkButton } from '@/components/dogs/ShareLinkButton'
import { PageShell } from '@/components/layout/PageShell'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { formatDateShort } from '@/lib/utils'
import { pdf } from '@react-pdf/renderer'
import { DogProfilePDF } from '@/components/pdf/DogProfilePDF'
import { getPublicPhotoUrl } from '@/lib/utils'
import type { DogPhoto } from '@/lib/database.types'

export const Route = createFileRoute('/dogs/$dogId/')({
  component: DogDetailPage,
})

function DogDetailPage() {
  const { dogId } = Route.useParams()
  const { dog, loading, refetch } = useDog(dogId)
  const navigate = useNavigate()
  const [exporting, setExporting] = useState(false)
  const [deleting, setDeleting] = useState(false)

  if (loading) {
    return (
      <PageShell>
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-64 w-full" />
        </div>
      </PageShell>
    )
  }

  if (!dog) {
    return (
      <PageShell>
        <p className="text-gray-500">Pes nenalezen.</p>
      </PageShell>
    )
  }

  const primaryPhoto = dog.dog_photos.find((p) => p.is_primary) ?? dog.dog_photos[0]
  const primaryPhotoUrl = primaryPhoto ? getPublicPhotoUrl(primaryPhoto.storage_path) : null

  const handleExportPDF = async () => {
    setExporting(true)
    try {
      const blob = await pdf(
        <DogProfilePDF
          dog={dog}
          owner={dog.owners as any}
          tags={dog.dog_tags}
          primaryPhotoUrl={primaryPhotoUrl}
        />
      ).toBlob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `hlidaci-karta-${dog.name.toLowerCase().replace(/\s+/g, '-')}.pdf`
      a.click()
      URL.revokeObjectURL(url)
      toast.success('PDF staženo')
    } catch {
      toast.error('Export PDF selhal')
    }
    setExporting(false)
  }

  const handleDelete = async () => {
    if (!confirm(`Opravdu smazat psa ${dog.name}? Tato akce je nevratná.`)) return
    setDeleting(true)
    const { error } = await supabase.from('dogs').delete().eq('id', dogId)
    if (error) {
      toast.error('Nepodařilo se smazat psa')
    } else {
      toast.success(`${dog.name} byl smazán`)
      navigate({ to: '/dogs' })
    }
    setDeleting(false)
  }

  return (
    <PageShell>
      <div className="space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{dog.name}</h1>
            {dog.breed && <p className="text-gray-500 dark:text-gray-400">{dog.breed}</p>}
          </div>
          <div className="flex flex-wrap gap-2">
            <ShareLinkButton dogId={dogId} />
            <Button variant="secondary" size="sm" onClick={handleExportPDF} loading={exporting}>
              📄 Export PDF
            </Button>
            <Link to="/dogs/$dogId/edit" params={{ dogId }}>
              <Button variant="secondary" size="sm">Upravit</Button>
            </Link>
            <Button variant="danger" size="sm" onClick={handleDelete} loading={deleting}>
              Smazat
            </Button>
          </div>
        </div>

        {dog.dog_tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {dog.dog_tags.map((tag) => <DogTagPill key={tag.id} tag={tag} />)}
          </div>
        )}

        <div className="rounded-[--radius-card] border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Fotografie</h2>
          <DogPhotoUpload
            dogId={dogId}
            photos={dog.dog_photos}
            onUpdate={(photos: DogPhoto[]) => refetch()}
          />
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div className="rounded-[--radius-card] border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900 space-y-3">
            <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Identifikace</h2>
            <InfoRow label="Číslo pasu / průkazu" value={dog.passport_number} />
            <InfoRow label="Číslo čipu / tetování" value={dog.chip_number} />
            <InfoRow label="Hmotnost" value={dog.weight_kg ? `${dog.weight_kg} kg` : null} />
          </div>

          <div className="rounded-[--radius-card] border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900 space-y-3">
            <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Veterinář</h2>
            <InfoRow label="Jméno" value={dog.vet_name} />
            <InfoRow label="Telefon" value={dog.vet_phone} />
          </div>

          {(dog.food_notes || dog.medication) && (
            <div className="rounded-[--radius-card] border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900 space-y-3 lg:col-span-2">
              <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Péče a zdraví</h2>
              {dog.food_notes && <InfoBlock label="Krmení a dieta" value={dog.food_notes} />}
              {dog.medication && <InfoBlock label="Léky" value={dog.medication} />}
            </div>
          )}

          {dog.owners && (
            <div className="rounded-[--radius-card] border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Majitel</h2>
                <Link to="/owners/$ownerId" params={{ ownerId: (dog.owners as any).id }} className="text-xs text-brand-600 dark:text-brand-400 hover:underline">
                  Detail →
                </Link>
              </div>
              <InfoRow label="Jméno" value={`${(dog.owners as any).first_name} ${(dog.owners as any).last_name}`} />
              <InfoRow label="Telefon" value={(dog.owners as any).phone} />
              <InfoRow label="Záchranný kontakt" value={(dog.owners as any).phone_emergency} />
              <InfoRow label="E-mail" value={(dog.owners as any).email} />
            </div>
          )}

          {dog.extra_notes && (
            <div className="rounded-[--radius-card] border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
              <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Další poznámky</h2>
              <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{dog.extra_notes}</p>
            </div>
          )}
        </div>

        <DogStayHistory dogId={dogId} />
      </div>
    </PageShell>
  )
}

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null
  return (
    <div className="flex gap-3">
      <span className="text-sm text-gray-500 dark:text-gray-400 w-36 shrink-0">{label}</span>
      <span className="text-sm text-gray-900 dark:text-gray-100">{value}</span>
    </div>
  )
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{label}</p>
      <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{value}</p>
    </div>
  )
}

function DogStayHistory({ dogId }: { dogId: string }) {
  const [stays, setStays] = useState<any[]>([])
  const [loaded, setLoaded] = useState(false)

  if (!loaded) {
    supabase
      .from('stays')
      .select('*')
      .eq('dog_id', dogId)
      .order('date_from', { ascending: false })
      .then(({ data }) => {
        setStays(data ?? [])
        setLoaded(true)
      })
  }

  return (
    <div className="rounded-[--radius-card] border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Historie pobytů</h2>
        <Link to="/stays/new" search={{ dogId }}>
          <Button variant="secondary" size="sm">+ Přidat termín</Button>
        </Link>
      </div>
      {stays.length === 0 ? (
        <p className="text-sm text-gray-400 dark:text-gray-500">Žádné pobyty</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-2 pr-4 text-gray-500 dark:text-gray-400 font-medium">Od</th>
                <th className="text-left py-2 pr-4 text-gray-500 dark:text-gray-400 font-medium">Do</th>
                <th className="text-left py-2 text-gray-500 dark:text-gray-400 font-medium">Poznámky</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {stays.map((stay) => (
                <tr key={stay.id} className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-2 pr-4 text-gray-900 dark:text-gray-100">{formatDateShort(stay.date_from)}</td>
                  <td className="py-2 pr-4 text-gray-900 dark:text-gray-100">{formatDateShort(stay.date_to)}</td>
                  <td className="py-2 text-gray-500 dark:text-gray-400 max-w-xs truncate">{stay.notes ?? '—'}</td>
                  <td className="py-2 pl-4">
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
  )
}
