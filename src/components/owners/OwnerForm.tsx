import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ownerSchema, type OwnerFormValues } from '@/schemas/owner.schema'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import type { Owner } from '@/lib/database.types'

interface OwnerFormProps {
  defaultValues?: Partial<Owner>
  onSubmit: (values: OwnerFormValues) => Promise<void>
  submitting?: boolean
}

export function OwnerForm({ defaultValues, onSubmit, submitting }: OwnerFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OwnerFormValues>({
    resolver: zodResolver(ownerSchema),
    defaultValues: {
      first_name: defaultValues?.first_name ?? '',
      last_name: defaultValues?.last_name ?? '',
      phone: defaultValues?.phone ?? '',
      phone_emergency: defaultValues?.phone_emergency ?? '',
      email: defaultValues?.email ?? '',
      address: defaultValues?.address ?? '',
      is_recurring: defaultValues?.is_recurring ?? false,
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input label="Jméno *" error={errors.first_name?.message} {...register('first_name')} />
        <Input label="Příjmení *" error={errors.last_name?.message} {...register('last_name')} />
        <Input label="Telefon *" type="tel" error={errors.phone?.message} {...register('phone')} />
        <Input label="Záchranný kontakt (telefon)" type="tel" {...register('phone_emergency')} />
        <Input label="E-mail" type="email" error={errors.email?.message} {...register('email')} />
        <Input label="Adresa" {...register('address')} />
      </div>
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          className="size-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
          {...register('is_recurring')}
        />
        <span className="text-sm text-gray-700 dark:text-gray-300">Opakující se klient</span>
      </label>
      <div className="flex justify-end">
        <Button type="submit" loading={submitting}>
          Uložit majitele
        </Button>
      </div>
    </form>
  )
}
