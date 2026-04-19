import { z } from 'zod'

export const dogSchema = z.object({
  name: z.string().min(1, 'Jméno psa je povinné'),
  owner_id: z.string().uuid('Vyberte majitele').or(z.literal('')).optional(),
  breed: z.string().optional(),
  passport_number: z.string().optional(),
  chip_number: z.string().optional(),
  weight_kg: z.coerce.number().positive('Hmotnost musí být kladné číslo').optional().or(z.literal('')),
  food_notes: z.string().optional(),
  medication: z.string().optional(),
  vet_name: z.string().optional(),
  vet_phone: z.string().optional(),
  extra_notes: z.string().optional(),
})

export type DogFormValues = z.infer<typeof dogSchema>
