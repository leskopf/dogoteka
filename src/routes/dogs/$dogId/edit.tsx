import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useDog } from '@/hooks/useDogs'
import { DogForm } from '@/components/dogs/DogForm'
import { TagEditor } from '@/components/dogs/TagEditor'
import { PageShell } from '@/components/layout/PageShell'
import { Skeleton } from '@/components/ui/Skeleton'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import type { DogFormValues } from '@/schemas/dog.schema'

export const Route = createFileRoute('/dogs/$dogId/edit')({
  component: EditDogPage,
})

function EditDogPage() {
  const { dogId } = Route.useParams()
  const { dog, loading } = useDog(dogId)
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)

  if (loading) {
    return (
      <PageShell>
        <Skeleton className="h-8 w-48 mb-6" />
        <Skeleton className="h-96 w-full" />
      </PageShell>
    )
  }

  if (!dog) {
    return (
      <PageShell>
        <p className="text-gray-500">Pes nenalezen.</p>
      </PageShell>
    )
  }

  const handleSubmit = async (values: DogFormValues) => {
    setSubmitting(true)
    const { error } = await supabase
      .from('dogs')
      .update({
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
      .eq('id', dogId)

    if (error) {
      toast.error('Nepodařilo se uložit změny')
    } else {
      toast.success('Změny uloženy')
      navigate({ to: '/dogs/$dogId', params: { dogId } })
    }
    setSubmitting(false)
  }

  return (
    <PageShell>
      <div className="max-w-2xl space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Upravit — {dog.name}
        </h1>
        <div className="rounded-[--radius-card] border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
          <DogForm defaultValues={dog} onSubmit={handleSubmit} submitting={submitting} />
        </div>
        <div className="rounded-[--radius-card] border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Tagy</h2>
          <TagEditor dogId={dogId} initialTags={dog.dog_tags} />
        </div>
      </div>
    </PageShell>
  )
}
