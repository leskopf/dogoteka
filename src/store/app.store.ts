import { create } from 'zustand'
import type { Session } from '@supabase/supabase-js'

interface AppStore {
  session: Session | null
  setSession: (s: Session | null) => void

  maxCapacity: number
  setMaxCapacity: (n: number) => void

  sidebarOpen: boolean
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void

  darkMode: boolean
  toggleDarkMode: () => void
}

const storedDark = localStorage.getItem('darkMode') === 'true'
if (storedDark) document.documentElement.classList.add('dark')

export const useAppStore = create<AppStore>((set) => ({
  session: null,
  setSession: (session) => set({ session }),

  maxCapacity: 5,
  setMaxCapacity: (maxCapacity) => set({ maxCapacity }),

  sidebarOpen: false,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),

  darkMode: storedDark,
  toggleDarkMode: () =>
    set((s) => {
      const next = !s.darkMode
      localStorage.setItem('darkMode', String(next))
      document.documentElement.classList.toggle('dark', next)
      return { darkMode: next }
    }),
}))
