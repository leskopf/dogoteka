import { useMemo } from 'react'
import { useAllPayments } from '@/hooks/usePayments'
import type { PaymentWithStay } from '@/hooks/usePayments'

export type FinanceSummary = {
  totalThisMonth: number
  totalThisYear: number
  pendingDeposits: number
  pendingFinals: number
}

export type { PaymentWithStay }

export function useFinance() {
  const { payments, loading, refetch } = useAllPayments()

  const summary = useMemo<FinanceSummary>(() => {
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    let totalThisMonth = 0
    let totalThisYear = 0
    let pendingDeposits = 0
    let pendingFinals = 0

    for (const p of payments) {
      if (!p.paid_at) {
        if (p.type === 'deposit') pendingDeposits++
        else if (p.type === 'final') pendingFinals++
      } else {
        const paidDate = new Date(p.paid_at)
        if (paidDate.getFullYear() === currentYear) {
          totalThisYear += p.amount
          if (paidDate.getMonth() === currentMonth) {
            totalThisMonth += p.amount
          }
        }
      }
    }

    return { totalThisMonth, totalThisYear, pendingDeposits, pendingFinals }
  }, [payments])

  return { summary, payments, loading, refetch }
}
