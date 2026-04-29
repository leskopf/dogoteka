import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Payment } from '@/lib/database.types'

type PaymentInsert = {
  stay_id: string
  type: 'deposit' | 'final'
  amount: number
  paid_at?: string | null
  invoice_number?: string | null
  notes?: string | null
}

type PaymentUpdate = Partial<Omit<PaymentInsert, 'stay_id'>>

export type PaymentWithStay = Payment & {
  stays: {
    id: string
    date_from: string
    date_to: string
    dogs: {
      id: string
      name: string
      owners: { id: string; first_name: string; last_name: string } | null
    }
  }
}

export function usePaymentsForStay(stayId: string) {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('payments')
      .select('*')
      .eq('stay_id', stayId)
      .order('created_at')
    setPayments((data ?? []) as Payment[])
    setLoading(false)
  }, [stayId])

  useEffect(() => { fetch() }, [fetch])

  const addPayment = async (data: PaymentInsert): Promise<Payment | null> => {
    const { data: inserted, error } = await supabase
      .from('payments')
      .insert(data)
      .select()
      .single()
    if (error || !inserted) return null
    const payment = inserted as Payment
    setPayments((prev) => [...prev, payment])
    return payment
  }

  const updatePayment = async (id: string, data: PaymentUpdate): Promise<void> => {
    const { error } = await supabase.from('payments').update(data).eq('id', id)
    if (error) throw error
    await fetch()
  }

  const deletePayment = async (id: string): Promise<void> => {
    const item = payments.find((p) => p.id === id)
    setPayments((prev) => prev.filter((p) => p.id !== id))
    const { error } = await supabase.from('payments').delete().eq('id', id)
    if (error && item) {
      setPayments((prev) => [...prev, item].sort((a, b) => a.created_at.localeCompare(b.created_at)))
    }
  }

  return { payments, loading, refetch: fetch, addPayment, updatePayment, deletePayment }
}

export function useAllPayments() {
  const [payments, setPayments] = useState<PaymentWithStay[]>([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('payments')
      .select('*, stays(id, date_from, date_to, dogs(id, name, owners(id, first_name, last_name)))')
      .order('created_at', { ascending: false })
    setPayments((data ?? []) as PaymentWithStay[])
    setLoading(false)
  }, [])

  useEffect(() => { fetch() }, [fetch])

  return { payments, loading, refetch: fetch }
}
