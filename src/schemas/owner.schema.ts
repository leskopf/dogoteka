import { z } from 'zod'

export const ownerSchema = z.object({
  first_name: z.string().min(1, 'Jméno je povinné'),
  last_name: z.string().min(1, 'Příjmení je povinné'),
  phone: z.string().min(1, 'Telefon je povinný'),
  phone_emergency: z.string().optional(),
  email: z.string().email('Neplatný e-mail').optional().or(z.literal('')),
  address: z.string().optional(),
  is_recurring: z.boolean().default(false),
})

export type OwnerFormValues = z.infer<typeof ownerSchema>
