import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Owner } from '@/lib/database.types'

export function useOwners() {
  const [owners, setOwners] = useState<Owner[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('owners')
      .select('*')
      .order('last_name')
    if (error) setError(error.message)
    else setOwners(data)
    setLoading(false)
  }, [])

  useEffect(() => { fetch() }, [fetch])

  return { owners, loading, error, refetch: fetch }
}

export function useOwner(ownerId: string) {
  const [owner, setOwner] = useState<Owner | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('owners')
      .select('*')
      .eq('id', ownerId)
      .single()
    if (error) setError(error.message)
    else setOwner(data)
    setLoading(false)
  }, [ownerId])

  useEffect(() => { fetch() }, [fetch])

  return { owner, loading, error, refetch: fetch }
}
