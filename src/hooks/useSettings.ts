import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Settings } from '@/lib/database.types'

export function useSettings() {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('settings').select('*').single()
    setSettings(data ?? null)
    setLoading(false)
  }, [])

  useEffect(() => { fetch() }, [fetch])

  const update = async (data: Partial<Settings>) => {
    if (!settings) return
    const { error } = await supabase.from('settings').update(data).eq('id', settings.id)
    if (error) throw error
    await fetch()
  }

  return { settings, loading, update }
}
