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
      if (d.time_from && !d.time_to) return false
      if (!d.time_from && d.time_to) return false
      return true
    },
    {
      message: 'Zadejte oba časy (nebo necháte oba prázdné)',
      path: ['time_from'],
    },
  )
  .refine(
    (d) => {
      if (d.date_from === d.date_to && d.time_from && d.time_to) {
        return d.time_to > d.time_from
      }
      return true
    },
    {
      message: 'Pro pobyt v jeden den musí být čas odjezdu později',
      path: ['time_from'],
    },
  )

export type StayFormValues = z.infer<typeof staySchema>
