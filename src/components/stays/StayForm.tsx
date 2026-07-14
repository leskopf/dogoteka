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
    watch,
  } = useForm<StayFormValues>({
    resolver: zodResolver(staySchema),
    defaultValues: {
      dog_id: defaultValues?.dog_id ?? '',
      date_from: defaultValues?.date_from ?? '',
      date_to: defaultValues?.date_to ?? '',
      time_from: defaultValues?.time_from ?? '',
      time_to: defaultValues?.time_to ?? '',
      notes: defaultValues?.notes ?? '',
    },
  })

  const dateFrom = watch('date_from')
  const dateTo = watch('date_to')
  const isSameDay = dateFrom && dateTo && dateFrom === dateTo

  const dogOptions = dogs.map((d) => {
    const parts = [d.breed, d.name].filter(Boolean).join(' — ')
    const owner = d.owners
      ? `${d.owners.first_name} ${d.owners.last_name}`
      : null
    return {
      value: d.id,
      label: owner ? `${parts} (${owner})` : parts,
    }
  })

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
      {isSameDay && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Čas příjezdu *"
            type="time"
            error={errors.time_from?.message}
            {...register('time_from')}
          />
          <Input
            label="Čas odjezdu *"
            type="time"
            error={errors.time_to?.message}
            {...register('time_to')}
          />
        </div>
      )}
      <Textarea label="Poznámky" rows={3} {...register('notes')} />
      <div className="flex justify-end">
        <Button type="submit" loading={submitting}>
          Uložit termín
        </Button>
      </div>
    </form>
  )
}
