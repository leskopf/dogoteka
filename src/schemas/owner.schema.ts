import { z } from 'zod'

export const ownerSchema = z.object({
  first_name: z.string().min(1, 'Jméno je povinné'),
  last_name: z.string().min(1, 'Příjmení je povinné'),
  phone: z
    .string()
    .min(1, 'Telefon je povinný')
    .regex(/^\+\d{1,4}[\s-]?\d[\d\s-]{6,}$/, 'Zadejte mezinárodní formát, např. +420 123 456 789'),
  phone_emergency: z
    .string()
    .regex(/^\+\d{1,4}[\s-]?\d[\d\s-]{6,}$/, 'Zadejte mezinárodní formát, např. +420 123 456 789')
    .optional()
    .or(z.literal('')),
  email: z
    .string()
    .email('Neplatný e-mail')
    .optional()
    .or(z.literal('')),
  address: z.string().optional(),
  is_recurring: z.boolean().default(false),
})

export type OwnerFormValues = z.infer<typeof ownerSchema>
