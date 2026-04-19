import type { DogTag } from '@/lib/database.types'

interface DogTagPillProps {
  tag: DogTag
  onRemove?: () => void
}

export function DogTagPill({ tag, onRemove }: DogTagPillProps) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium text-white"
      style={{ backgroundColor: tag.color }}
    >
      {tag.label}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-0.5 rounded-full hover:opacity-75 focus:outline-none"
          aria-label={`Odebrat tag ${tag.label}`}
        >
          <svg className="size-3" viewBox="0 0 20 20" fill="currentColor">
            <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
          </svg>
        </button>
      )}
    </span>
  )
}
