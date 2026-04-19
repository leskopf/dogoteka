type ClassValue = string | undefined | null | false | ClassValue[]

export function cn(...classes: ClassValue[]): string {
  return classes
    .flat(Infinity as 10)
    .filter(Boolean)
    .join(' ')
}

export function dogColorFromId(id: string): string {
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash)
  }
  const hue = Math.abs(hash) % 360
  return `oklch(55% 0.18 ${hue})`
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('cs-CZ', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function formatDateShort(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('cs-CZ', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  })
}

export function today(): string {
  return new Date().toISOString().split('T')[0]
}

export function tomorrow(): string {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toISOString().split('T')[0]
}

export function dogsOnDate(stays: { date_from: string; date_to: string }[], date: string): number {
  return stays.filter((s) => s.date_from <= date && s.date_to >= date).length
}

export function addOneDay(dateStr: string): string {
  const d = new Date(dateStr)
  d.setDate(d.getDate() + 1)
  return d.toISOString().split('T')[0]
}

export function getPublicPhotoUrl(storagePath: string): string {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
  return `${supabaseUrl}/storage/v1/object/public/dog-photos/${storagePath}`
}
