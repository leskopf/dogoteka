import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
import { formatDate } from '@/lib/utils'
import { toast } from 'sonner'
import type { StayNote } from '@/lib/database.types'

interface NoteTimelineProps {
  notes: StayNote[]
  onAdd: (content: string) => Promise<boolean>
  onDelete: (noteId: string) => Promise<void>
}

export function NoteTimeline({ notes, onAdd, onDelete }: NoteTimelineProps) {
  const [content, setContent] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async () => {
    if (!content.trim()) return
    setSaving(true)
    const ok = await onAdd(content.trim())
    if (ok) {
      setContent('')
      toast.success('Zápisek uložen')
    } else {
      toast.error('Nepodařilo se uložit zápisek')
    }
    setSaving(false)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Textarea
          label="Nový zápisek"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Co pes dnes jedl, jak se choval..."
          rows={3}
        />
        <Button onClick={handleSubmit} loading={saving} disabled={!content.trim()}>
          Přidat zápisek
        </Button>
      </div>

      <div className="relative">
        {notes.length > 0 && (
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />
        )}
        <div className="space-y-4">
          {notes.length === 0 && (
            <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-6">
              Zatím žádné zápisky
            </p>
          )}
          {[...notes].reverse().map((note) => (
            <div key={note.id} className="relative flex gap-4">
              <div className="relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-900/30 ring-4 ring-white dark:ring-gray-900">
                <svg className="size-4 text-brand-600 dark:text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0 rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
                <div className="flex items-start justify-between gap-2">
                  <time className="text-xs text-gray-400 dark:text-gray-500 shrink-0">
                    {formatDate(note.created_at!)}
                  </time>
                  <button
                    onClick={() => onDelete(note.id)}
                    className="text-gray-300 hover:text-red-500 dark:text-gray-600 dark:hover:text-red-400 transition-colors"
                    aria-label="Smazat zápisek"
                  >
                    <svg className="size-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                <p className="mt-1 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{note.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
