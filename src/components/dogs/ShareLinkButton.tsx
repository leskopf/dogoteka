import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'
import { toast } from 'sonner'

interface ShareLinkButtonProps {
  dogId: string
}

export function ShareLinkButton({ dogId }: ShareLinkButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleShare = async () => {
    setLoading(true)
    let { data: existing } = await supabase
      .from('share_tokens')
      .select('token')
      .eq('dog_id', dogId)
      .single()

    if (!existing) {
      const { data } = await supabase
        .from('share_tokens')
        .insert({ dog_id: dogId })
        .select('token')
        .single()
      existing = data
    }

    if (existing?.token) {
      const url = `${window.location.origin}/share/${existing.token}`
      await navigator.clipboard.writeText(url)
      toast.success('Odkaz zkopírován do schránky')
    } else {
      toast.error('Nepodařilo se vytvořit sdílený odkaz')
    }
    setLoading(false)
  }

  return (
    <Button variant="secondary" size="sm" onClick={handleShare} loading={loading}>
      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
      </svg>
      Sdílet odkaz
    </Button>
  )
}
