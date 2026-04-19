import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { DogTagPill } from '@/components/dogs/DogTagPill'
import { getPublicPhotoUrl, formatDateShort, today } from '@/lib/utils'
import type { Dog, DogTag, DogPhoto, Stay } from '@/lib/database.types'

export const Route = createFileRoute('/share/$token')({
  component: SharePage,
})

function SharePage() {
  const { token } = Route.useParams()
  const [dog, setDog] = useState<Dog | null>(null)
  const [tags, setTags] = useState<DogTag[]>([])
  const [photos, setPhotos] = useState<DogPhoto[]>([])
  const [currentStay, setCurrentStay] = useState<Stay | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const load = async () => {
      const { data: dogs, error } = await supabase.rpc('get_dog_by_token', { p_token: token })
      if (error || !dogs || dogs.length === 0) {
        setNotFound(true)
        setLoading(false)
        return
      }

      const d = dogs[0] as Dog
      setDog(d)

      const [tagsRes, photosRes, stayRes] = await Promise.all([
        supabase.from('dog_tags').select('*').eq('dog_id', d.id),
        supabase.from('dog_photos').select('*').eq('dog_id', d.id),
        supabase
          .from('stays')
          .select('*')
          .eq('dog_id', d.id)
          .gte('date_to', today())
          .order('date_from')
          .limit(1),
      ])

      setTags(tagsRes.data ?? [])
      setPhotos(photosRes.data ?? [])
      setCurrentStay(stayRes.data?.[0] ?? null)
      setLoading(false)
    }
    load()
  }, [token])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <span className="text-4xl animate-bounce inline-block">🐾</span>
          <p className="mt-2 text-gray-500 dark:text-gray-400">Načítám...</p>
        </div>
      </div>
    )
  }

  if (notFound || !dog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
        <div className="text-center max-w-sm">
          <span className="text-5xl">🔍</span>
          <h1 className="mt-4 text-xl font-bold text-gray-900 dark:text-gray-100">Odkaz nenalezen</h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">Tento sdílený odkaz je neplatný nebo byl zrušen.</p>
        </div>
      </div>
    )
  }

  const primaryPhoto = photos.find((p) => p.is_primary) ?? photos[0]
  const photoUrl = primaryPhoto ? getPublicPhotoUrl(primaryPhoto.storage_path) : null
  const t = today()
  const isActiveStay = currentStay && currentStay.date_from <= t && currentStay.date_to >= t

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-lg mx-auto px-4 py-10 space-y-6">
        <div className="text-center">
          <div className="text-sm text-gray-400 dark:text-gray-500 mb-4">🐾 Dogoteka</div>
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={dog.name}
              loading="eager"
              className="mx-auto size-40 rounded-full object-cover shadow-md"
            />
          ) : (
            <div className="mx-auto size-40 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-6xl shadow-md">
              🐶
            </div>
          )}
          <h1 className="mt-4 text-3xl font-bold text-gray-900 dark:text-gray-100">{dog.name}</h1>
          {dog.breed && <p className="text-gray-500 dark:text-gray-400 mt-1">{dog.breed}</p>}
          {tags.length > 0 && (
            <div className="flex flex-wrap justify-center gap-1.5 mt-3">
              {tags.map((tag) => <DogTagPill key={tag.id} tag={tag} />)}
            </div>
          )}
        </div>

        {photos.length > 1 && (
          <div>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {photos.map((photo) => (
                <img
                  key={photo.id}
                  src={getPublicPhotoUrl(photo.storage_path)}
                  alt={dog.name}
                  loading="lazy"
                  className="size-20 rounded-lg object-cover shrink-0"
                />
              ))}
            </div>
          </div>
        )}

        {currentStay && (
          <div className={`rounded-[--radius-card] border p-5 ${
            isActiveStay
              ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/10'
              : 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/10'
          }`}>
            <h2 className={`text-sm font-semibold uppercase tracking-wider mb-2 ${
              isActiveStay ? 'text-green-700 dark:text-green-400' : 'text-blue-700 dark:text-blue-400'
            }`}>
              {isActiveStay ? '🏠 Aktuálně hlídán' : '📅 Nadcházející pobyt'}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 font-medium">
              {formatDateShort(currentStay.date_from)} – {formatDateShort(currentStay.date_to)}
            </p>
          </div>
        )}

        <div className="rounded-[--radius-card] border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900 space-y-3">
          {dog.weight_kg && <InfoRow label="Hmotnost" value={`${dog.weight_kg} kg`} />}
          {dog.food_notes && <InfoBlock label="Krmení a dieta" value={dog.food_notes} />}
          {dog.medication && <InfoBlock label="Léky" value={dog.medication} />}
          {(dog.vet_name || dog.vet_phone) && (
            <InfoBlock label="Veterinář" value={[dog.vet_name, dog.vet_phone].filter(Boolean).join(' · ')} />
          )}
          {dog.extra_notes && <InfoBlock label="Poznámky" value={dog.extra_notes} />}
        </div>

        <p className="text-center text-xs text-gray-300 dark:text-gray-700">Dogoteka — digitální kartotéka psů</p>
      </div>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3">
      <span className="text-sm text-gray-500 dark:text-gray-400 w-28 shrink-0">{label}</span>
      <span className="text-sm text-gray-900 dark:text-gray-100">{value}</span>
    </div>
  )
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{value}</p>
    </div>
  )
}
