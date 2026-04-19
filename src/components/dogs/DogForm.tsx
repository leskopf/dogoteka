import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { dogSchema, type DogFormValues } from '@/schemas/dog.schema'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { useOwners } from '@/hooks/useOwners'
import type { Dog } from '@/lib/database.types'

interface DogFormProps {
  defaultValues?: Partial<Dog>
  onSubmit: (values: DogFormValues) => Promise<void>
  submitting?: boolean
}

export function DogForm({ defaultValues, onSubmit, submitting }: DogFormProps) {
  const { owners } = useOwners()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DogFormValues>({
    resolver: zodResolver(dogSchema),
    defaultValues: {
      name: defaultValues?.name ?? '',
      owner_id: defaultValues?.owner_id ?? '',
      breed: defaultValues?.breed ?? '',
      passport_number: defaultValues?.passport_number ?? '',
      chip_number: defaultValues?.chip_number ?? '',
      weight_kg: defaultValues?.weight_kg ?? '',
      food_notes: defaultValues?.food_notes ?? '',
      medication: defaultValues?.medication ?? '',
      vet_name: defaultValues?.vet_name ?? '',
      vet_phone: defaultValues?.vet_phone ?? '',
      extra_notes: defaultValues?.extra_notes ?? '',
    },
  })

  const ownerOptions = owners.map((o) => ({
    value: o.id,
    label: `${o.first_name} ${o.last_name}`,
  }))

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Základní informace</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="Jméno psa *" error={errors.name?.message} {...register('name')} />
          <Select
            label="Majitel"
            options={ownerOptions}
            placeholder="— Vyberte majitele —"
            error={errors.owner_id?.message}
            {...register('owner_id')}
          />
          <Input label="Rasa" {...register('breed')} />
          <Input
            label="Hmotnost (kg)"
            type="number"
            step="0.1"
            min="0"
            error={errors.weight_kg?.message}
            {...register('weight_kg')}
          />
          <Input label="Číslo pasu / očkovacího průkazu" {...register('passport_number')} />
          <Input label="Číslo čipu / tetování" {...register('chip_number')} />
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Péče a zdraví</h3>
        <Textarea label="Krmení a dieta" rows={3} {...register('food_notes')} />
        <Textarea label="Léky" rows={2} {...register('medication')} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="Jméno veterináře" {...register('vet_name')} />
          <Input label="Telefon na veterináře" type="tel" {...register('vet_phone')} />
        </div>
        <Textarea label="Další poznámky" rows={3} {...register('extra_notes')} />
      </section>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="submit" loading={submitting}>
          Uložit psa
        </Button>
      </div>
    </form>
  )
}
