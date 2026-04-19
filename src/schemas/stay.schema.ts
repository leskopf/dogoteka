import { z } from 'zod'

export const staySchema = z
  .object({
    dog_id: z.string().uuid('Vyberte psa'),
    date_from: z.string().min(1, 'Datum příjezdu je povinné'),
    date_to: z.string().min(1, 'Datum odjezdu je povinné'),
    notes: z.string().optional(),
  })
  .refine((d) => new Date(d.date_to) >= new Date(d.date_from), {
    message: 'Datum odjezdu musí být po datu příjezdu',
    path: ['date_to'],
  })

export type StayFormValues = z.infer<typeof staySchema>
