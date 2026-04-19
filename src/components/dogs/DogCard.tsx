import { Link } from '@tanstack/react-router'
import { DogTagPill } from './DogTagPill'
import { getPublicPhotoUrl } from '@/lib/utils'
import type { DogWithRelations } from '@/hooks/useDogs'

interface DogCardProps {
  dog: DogWithRelations
}

export function DogCard({ dog }: DogCardProps) {
  const primaryPhoto = dog.dog_photos.find((p) => p.is_primary) ?? dog.dog_photos[0]
  const photoUrl = primaryPhoto ? getPublicPhotoUrl(primaryPhoto.storage_path) : null
  const ownerName = dog.owners
    ? `${dog.owners.first_name} ${dog.owners.last_name}`
    : null

  return (
    <Link
      to="/dogs/$dogId"
      params={{ dogId: dog.id }}
      className="block rounded-[--radius-card] border border-gray-200 bg-white hover:shadow-md transition-shadow dark:border-gray-700 dark:bg-gray-900 overflow-hidden"
    >
      <div className="aspect-[4/3] bg-gray-100 dark:bg-gray-800 overflow-hidden">
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={dog.name}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-5xl">🐶</span>
          </div>
        )}
      </div>
      <div className="p-4 space-y-2">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg leading-tight">{dog.name}</h3>
          {dog.breed && (
            <p className="text-sm text-gray-500 dark:text-gray-400">{dog.breed}</p>
          )}
          {ownerName && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{ownerName}</p>
          )}
        </div>
        {dog.dog_tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {dog.dog_tags.slice(0, 3).map((tag) => (
              <DogTagPill key={tag.id} tag={tag} />
            ))}
            {dog.dog_tags.length > 3 && (
              <span className="text-xs text-gray-400 dark:text-gray-500 self-center">+{dog.dog_tags.length - 3}</span>
            )}
          </div>
        )}
      </div>
    </Link>
  )
}
