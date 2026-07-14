import { z } from 'zod'

export const staySchema = z
  .object({
    dog_id: z.string().uuid('Vyberte psa'),
    date_from: z.string().min(1, 'Datum příjezdu je povinné'),
    date_to: z.string().min(1, 'Datum odjezdu je povinné'),
    time_from: z.string().optional(),
    time_to: z.string().optional(),
    notes: z.string().optional(),
  })
  .refine((d) => new Date(d.date_to) >= new Date(d.date_from), {
    message: 'Datum odjezdu musí být po datu příjezdu',
    path: ['date_to'],
  })
  .refine(
    (d) => {
      if (d.date_from === d.date_to) {
        return d.time_from && d.time_to && d.time_to > d.time_from
      }
      return true
    },
    {
      message: 'Pro pobyt v jeden den zadejte čas příjezdu a odjezdu (odjezd musí být později)',
      path: ['time_from'],
    },
  )

export type StayFormValues = z.infer<typeof staySchema>
