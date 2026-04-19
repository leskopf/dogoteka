import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { DogTagPill } from './DogTagPill'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { toast } from 'sonner'
import type { DogTag } from '@/lib/database.types'

const PRESET_COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e',
  '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899',
  '#64748b', '#1e293b',
]

interface TagEditorProps {
  dogId: string
  initialTags: DogTag[]
}

export function TagEditor({ dogId, initialTags }: TagEditorProps) {
  const [tags, setTags] = useState<DogTag[]>(initialTags)
  const [label, setLabel] = useState('')
  const [color, setColor] = useState(PRESET_COLORS[5])
  const [saving, setSaving] = useState(false)

  const handleAdd = async () => {
    if (!label.trim()) return
    setSaving(true)
    const optimistic: DogTag = { id: crypto.randomUUID(), dog_id: dogId, label: label.trim(), color }
    setTags((prev) => [...prev, optimistic])
    setLabel('')

    const { data, error } = await supabase
      .from('dog_tags')
      .insert({ dog_id: dogId, label: optimistic.label, color })
      .select()
      .single()

    if (error || !data) {
      setTags((prev) => prev.filter((t) => t.id !== optimistic.id))
      toast.error('Nepodařilo se uložit tag')
    } else {
      setTags((prev) => prev.map((t) => (t.id === optimistic.id ? data : t)))
    }
    setSaving(false)
  }

  const handleRemove = async (tagId: string) => {
    setTags((prev) => prev.filter((t) => t.id !== tagId))
    const { error } = await supabase.from('dog_tags').delete().eq('id', tagId)
    if (error) {
      toast.error('Nepodařilo se odebrat tag')
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1.5">
        {tags.map((tag) => (
          <DogTagPill key={tag.id} tag={tag} onRemove={() => handleRemove(tag.id)} />
        ))}
        {tags.length === 0 && (
          <span className="text-sm text-gray-400 dark:text-gray-500">Žádné tagy</span>
        )}
      </div>
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <Input
            label="Nový tag"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="např. Útěkář, Senior, Alergie..."
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAdd() } }}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500 dark:text-gray-400">Barva</label>
          <div className="flex gap-1 flex-wrap max-w-[160px]">
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className="size-6 rounded-full border-2 transition-transform hover:scale-110"
                style={{
                  backgroundColor: c,
                  borderColor: color === c ? 'white' : 'transparent',
                  outline: color === c ? `2px solid ${c}` : 'none',
                }}
              />
            ))}
          </div>
        </div>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={handleAdd}
          loading={saving}
          disabled={!label.trim()}
        >
          Přidat
        </Button>
      </div>
    </div>
  )
}
