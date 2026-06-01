import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Stay, StayNote } from '@/lib/database.types'
import type { DogWithRelations } from './useDogs'

export type StayWithDog = Stay & {
  dogs: Pick<DogWithRelations, 'id' | 'name' | 'breed' | 'dog_tags' | 'dog_photos' | 'owners'>
}

export function useStays() {
  const [stays, setStays] = useState<StayWithDog[]>([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('stays')
      .select('*, dogs(id, name, breed, dog_tags(*), dog_photos(*), owners(id, first_name, last_name, phone, phone_emergency))')
      .order('date_from', { ascending: false })
    setStays((data ?? []) as StayWithDog[])
    setLoading(false)
  }, [])

  useEffect(() => { fetch() }, [fetch])

  return { stays, loading, refetch: fetch }
}

export function useStay(stayId: string) {
  const [stay, setStay] = useState<StayWithDog | null>(null)
  const [notes, setNotes] = useState<StayNote[]>([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    setLoading(true)
    const [stayRes, notesRes] = await Promise.all([
      supabase
        .from('stays')
        .select('*, dogs(id, name, breed, weight_kg, food_notes, medication, vet_name, vet_phone, dog_tags(*), dog_photos(*), owners(id, first_name, last_name, phone, phone_emergency, email, address))')
        .eq('id', stayId)
        .single(),
      supabase
        .from('stay_notes')
        .select('*')
        .eq('stay_id', stayId)
        .order('created_at'),
    ])
    if (stayRes.data) setStay(stayRes.data as StayWithDog)
    if (notesRes.data) setNotes(notesRes.data)
    setLoading(false)
  }, [stayId])

  useEffect(() => { fetch() }, [fetch])

  const addNote = async (content: string) => {
    const optimistic: StayNote = {
      id: crypto.randomUUID(),
      stay_id: stayId,
      content,
      created_at: new Date().toISOString(),
    }
    setNotes((prev) => [...prev, optimistic])
    const { data, error } = await supabase
      .from('stay_notes')
      .insert({ stay_id: stayId, content })
      .select()
      .single()
    if (error || !data) {
      setNotes((prev) => prev.filter((n) => n.id !== optimistic.id))
      return false
    }
    setNotes((prev) => prev.map((n) => (n.id === optimistic.id ? data : n)))
    return true
  }

  const deleteNote = async (noteId: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== noteId))
    await supabase.from('stay_notes').delete().eq('id', noteId)
  }

  return { stay, notes, loading, refetch: fetch, addNote, deleteNote }
}
