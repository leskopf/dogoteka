import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { today, tomorrow } from '@/lib/utils'
import type { StayWithDog } from './useStays'

interface DashboardData {
  activeStays: StayWithDog[]
  departures: StayWithDog[]
  arrivals: StayWithDog[]
  loading: boolean
}

export function useDashboard(): DashboardData {
  const [activeStays, setActiveStays] = useState<StayWithDog[]>([])
  const [departures, setDepartures] = useState<StayWithDog[]>([])
  const [arrivals, setArrivals] = useState<StayWithDog[]>([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    setLoading(true)
    const t = today()
    const tm = tomorrow()

    const [activeRes, departRes, arriveRes] = await Promise.all([
      supabase
        .from('stays')
        .select('*, dogs(id, name, breed, dog_tags(*), dog_photos(*), owners(id, first_name, last_name, phone, phone_emergency))')
        .lte('date_from', t)
        .gte('date_to', t),
      supabase
        .from('stays')
        .select('*, dogs(id, name, breed, dog_tags(*), dog_photos(*), owners(id, first_name, last_name, phone, phone_emergency))')
        .eq('date_to', t),
      supabase
        .from('stays')
        .select('*, dogs(id, name, breed, dog_tags(*), dog_photos(*), owners(id, first_name, last_name, phone, phone_emergency))')
        .eq('date_from', tm),
    ])

    setActiveStays((activeRes.data ?? []) as StayWithDog[])
    setDepartures((departRes.data ?? []) as StayWithDog[])
    setArrivals((arriveRes.data ?? []) as StayWithDog[])
    setLoading(false)
  }, [])

  useEffect(() => { fetch() }, [fetch])

  return { activeStays, departures, arrivals, loading }
}
