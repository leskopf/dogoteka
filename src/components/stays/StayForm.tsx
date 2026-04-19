import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { staySchema, type StayFormValues } from '@/schemas/stay.schema'
import { Select } from '@/components/ui/Select'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { useDogs } from '@/hooks/useDogs'

interface StayFormProps {
  defaultValues?: Partial<StayFormValues>
  onSubmit: (values: StayFormValues) => Promise<void>
  submitting?: boolean
}

export function StayForm({ defaultValues, onSubmit, submitting }: StayFormProps) {
  const { dogs } = useDogs()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StayFormValues>({
    resolver: zodResolver(staySchema),
    defaultValues: {
      dog_id: defaultValues?.dog_id ?? '',
      date_from: defaultValues?.date_from ?? '',
      date_to: defaultValues?.date_to ?? '',
      notes: defaultValues?.notes ?? '',
    },
  })

  const dogOptions = dogs.map((d) => ({
    value: d.id,
    label: d.owners
      ? `${d.name} (${d.owners.first_name} ${d.owners.last_name})`
      : d.name,
  }))

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Select
        label="Pes *"
        options={dogOptions}
        placeholder="— Vyberte psa —"
        error={errors.dog_id?.message}
        {...register('dog_id')}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Datum příjezdu *"
          type="date"
          error={errors.date_from?.message}
          {...register('date_from')}
        />
        <Input
          label="Datum odjezdu *"
          type="date"
          error={errors.date_to?.message}
          {...register('date_to')}
        />
      </div>
      <Textarea label="Poznámky" rows={3} {...register('notes')} />
      <div className="flex justify-end">
        <Button type="submit" loading={submitting}>
          Uložit termín
        </Button>
      </div>
    </form>
  )
}
