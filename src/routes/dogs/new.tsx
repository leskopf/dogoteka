import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { DogForm } from '@/components/dogs/DogForm'
import { PageShell } from '@/components/layout/PageShell'
import { toast } from 'sonner'
import type { DogFormValues } from '@/schemas/dog.schema'

export const Route = createFileRoute('/dogs/new')({
  component: NewDogPage,
})

function NewDogPage() {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (values: DogFormValues) => {
    setSubmitting(true)
    const { data, error } = await supabase
      .from('dogs')
      .insert({
        name: values.name,
        owner_id: values.owner_id || null,
        breed: values.breed || null,
        passport_number: values.passport_number || null,
        chip_number: values.chip_number || null,
        weight_kg: values.weight_kg ? Number(values.weight_kg) : null,
        food_notes: values.food_notes || null,
        medication: values.medication || null,
        vet_name: values.vet_name || null,
        vet_phone: values.vet_phone || null,
        extra_notes: values.extra_notes || null,
      })
      .select()
      .single()

    if (error || !data) {
      toast.error('Nepodařilo se přidat psa')
    } else {
      toast.success(`${data.name} byl přidán`)
      navigate({ to: '/dogs/$dogId', params: { dogId: data.id } })
    }
    setSubmitting(false)
  }

  return (
    <PageShell>
      <div className="max-w-2xl space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Přidat nového psa</h1>
        <div className="rounded-[--radius-card] border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
          <DogForm onSubmit={handleSubmit} submitting={submitting} />
        </div>
      </div>
    </PageShell>
  )
}
