import { z } from 'zod'

export const paymentSchema = z.object({
  type: z.enum(['deposit', 'final']),
  amount: z.coerce.number().positive('Částka musí být kladná'),
  paid_at: z.string().nullable().optional(),
  notes: z.string().optional(),
})

export type PaymentFormValues = z.infer<typeof paymentSchema>
