import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { dogColorFromId, addOneDay } from '@/lib/utils'

export interface CalendarEvent {
  id: string
  title: string
  start: string
  end: string
  color: string
  extendedProps: { stayId: string; dogId: string }
}

export function useCalendarEvents() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(false)

  const fetchEvents = useCallback(async (start: Date, end: Date) => {
    setLoading(true)
    const { data } = await supabase
      .from('stays')
      .select('id, date_from, date_to, dogs(id, name)')
      .gte('date_to', start.toISOString().split('T')[0])
      .lte('date_from', end.toISOString().split('T')[0])

    const mapped: CalendarEvent[] = (data ?? []).map((s: any) => ({
      id: s.id,
      title: s.dogs?.name ?? 'Pes',
      start: s.date_from,
      end: addOneDay(s.date_to),
      color: dogColorFromId(s.dogs?.id ?? s.id),
      extendedProps: { stayId: s.id, dogId: s.dogs?.id ?? '' },
    }))

    setEvents(mapped)
    setLoading(false)
  }, [])

  return { events, loading, fetchEvents }
}
