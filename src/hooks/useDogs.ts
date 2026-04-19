import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Dog, DogTag, DogPhoto, Owner } from '@/lib/database.types'

export type DogWithRelations = Dog & {
  owners: Pick<Owner, 'id' | 'first_name' | 'last_name' | 'phone' | 'phone_emergency'> | null
  dog_tags: DogTag[]
  dog_photos: DogPhoto[]
}

export function useDogs() {
  const [dogs, setDogs] = useState<DogWithRelations[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('dogs')
      .select('*, owners(id, first_name, last_name, phone, phone_emergency), dog_tags(*), dog_photos(*)')
      .order('name')
    if (error) setError(error.message)
    else setDogs(data as DogWithRelations[])
    setLoading(false)
  }, [])

  useEffect(() => { fetch() }, [fetch])

  return { dogs, loading, error, refetch: fetch }
}

export function useDog(dogId: string) {
  const [dog, setDog] = useState<DogWithRelations | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('dogs')
      .select('*, owners(id, first_name, last_name, phone, phone_emergency, email, address), dog_tags(*), dog_photos(*)')
      .eq('id', dogId)
      .single()
    if (error) setError(error.message)
    else setDog(data as DogWithRelations)
    setLoading(false)
  }, [dogId])

  useEffect(() => { fetch() }, [fetch])

  return { dog, loading, error, refetch: fetch }
}
