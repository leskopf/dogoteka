import { useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { getPublicPhotoUrl } from '@/lib/utils'
import { toast } from 'sonner'
import type { DogPhoto } from '@/lib/database.types'

interface DogPhotoUploadProps {
  dogId: string
  photos: DogPhoto[]
  onUpdate: (photos: DogPhoto[]) => void
}

export function DogPhotoUpload({ dogId, photos, onUpdate }: DogPhotoUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const uploadFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Vyberte obrázek')
      return
    }
    setUploading(true)
    const ext = file.name.split('.').pop() ?? 'jpg'
    const path = `${dogId}/${crypto.randomUUID()}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('dog-photos')
      .upload(path, file, { upsert: false })

    if (uploadError) {
      toast.error('Nahrávání selhalo: ' + uploadError.message)
      setUploading(false)
      return
    }

    const isPrimary = photos.length === 0
    const { data, error: dbError } = await supabase
      .from('dog_photos')
      .insert({ dog_id: dogId, storage_path: path, is_primary: isPrimary })
      .select()
      .single()

    if (dbError || !data) {
      toast.error('Nepodařilo se uložit fotografii')
    } else {
      onUpdate([...photos, data])
      toast.success('Fotografie nahrána')
    }
    setUploading(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) await uploadFile(file)
  }

  const handleDelete = async (photo: DogPhoto) => {
    await supabase.storage.from('dog-photos').remove([photo.storage_path])
    await supabase.from('dog_photos').delete().eq('id', photo.id)
    const remaining = photos.filter((p) => p.id !== photo.id)
    if (photo.is_primary && remaining.length > 0) {
      await supabase.from('dog_photos').update({ is_primary: true }).eq('id', remaining[0].id)
      remaining[0].is_primary = true
    }
    onUpdate(remaining)
    toast.success('Fotografie smazána')
  }

  const handleSetPrimary = async (photo: DogPhoto) => {
    await supabase.from('dog_photos').update({ is_primary: false }).eq('dog_id', dogId)
    await supabase.from('dog_photos').update({ is_primary: true }).eq('id', photo.id)
    onUpdate(photos.map((p) => ({ ...p, is_primary: p.id === photo.id })))
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        {photos.map((photo) => (
          <div key={photo.id} className="relative group">
            <img
              src={getPublicPhotoUrl(photo.storage_path)}
              alt="Fotografie psa"
              loading="lazy"
              className="size-24 object-cover rounded-lg border-2 border-transparent data-[primary=true]:border-brand-500"
              data-primary={photo.is_primary}
            />
            {photo.is_primary && (
              <span className="absolute top-1 left-1 bg-brand-600 text-white text-xs px-1 rounded">Hlavní</span>
            )}
            <div className="absolute inset-0 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1 transition-opacity">
              {!photo.is_primary && (
                <button
                  type="button"
                  onClick={() => handleSetPrimary(photo)}
                  className="bg-white text-gray-800 rounded px-1.5 py-0.5 text-xs font-medium hover:bg-gray-100"
                >
                  Hlavní
                </button>
              )}
              <button
                type="button"
                onClick={() => handleDelete(photo)}
                className="bg-red-600 text-white rounded px-1.5 py-0.5 text-xs font-medium hover:bg-red-700"
              >
                Smazat
              </button>
            </div>
          </div>
        ))}

        <div
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          className={`size-24 flex flex-col items-center justify-center rounded-lg border-2 border-dashed cursor-pointer transition-colors ${
            dragOver
              ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20'
              : 'border-gray-300 hover:border-brand-400 dark:border-gray-600'
          }`}
        >
          {uploading ? (
            <svg className="animate-spin size-6 text-brand-500" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
          ) : (
            <>
              <svg className="size-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              <span className="text-xs text-gray-400 mt-1">Přidat</span>
            </>
          )}
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => { if (e.target.files?.[0]) uploadFile(e.target.files[0]) }}
      />
    </div>
  )
}
