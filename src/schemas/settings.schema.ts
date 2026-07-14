import { z } from 'zod'

export const settingsSchema = z.object({
  max_capacity: z.coerce.number().int().min(1, 'Kapacita musí být alespoň 1'),
  issuer_name: z.string().optional(),
  issuer_address: z.string().optional(),
  issuer_ico: z.string().optional(),
  issuer_dic: z.string().optional(),
  issuer_phone: z.string().optional(),
  issuer_email: z.string().email().optional(),
  issuer_web: z.string().url().optional(),
  bank_account: z.string().optional(),
  bank_iban: z.string().optional(),
  bank_name: z.string().optional(),
  default_rate_czk: z.coerce.number().min(0).optional(),
  invoice_counter: z.coerce.number().int().min(0).optional(),
})

export type SettingsFormValues = z.infer<typeof settingsSchema>
