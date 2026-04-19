import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAppStore } from '@/store/app.store'

export function useSession() {
  const setSession = useAppStore((s) => s.setSession)
  const setMaxCapacity = useAppStore((s) => s.setMaxCapacity)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [setSession])

  useEffect(() => {
    supabase
      .from('settings')
      .select('max_capacity')
      .single()
      .then(({ data }) => {
        if (data) setMaxCapacity(data.max_capacity)
      })
  }, [setMaxCapacity])
}
