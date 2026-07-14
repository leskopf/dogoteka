import { useMemo } from 'react'
import { useAllPayments } from '@/hooks/usePayments'
import type { PaymentWithStay } from '@/hooks/usePayments'

export type FinanceSummary = {
  totalThisMonth: number
  totalThisYear: number
  pendingDeposits: number
  pendingFinals: number
  pendingDepositsAmount: number
  pendingFinalsAmount: number
}

export type { PaymentWithStay }

export function useFinance() {
  const { payments, loading, error, refetch } = useAllPayments()

  const summary = useMemo<FinanceSummary>(() => {
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    let totalThisMonth = 0
    let totalThisYear = 0
    let pendingDeposits = 0
    let pendingFinals = 0
    let pendingDepositsAmount = 0
    let pendingFinalsAmount = 0

    for (const p of payments) {
      if (!p.paid_at) {
        if (p.type === 'deposit') {
          pendingDeposits++
          pendingDepositsAmount += p.amount
        } else if (p.type === 'final') {
          pendingFinals++
          pendingFinalsAmount += p.amount
        }
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

    return { totalThisMonth, totalThisYear, pendingDeposits, pendingFinals, pendingDepositsAmount, pendingFinalsAmount }
  }, [payments])

  return { summary, payments, loading, error, refetch }
}
