import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { StayForm } from '@/components/stays/StayForm'
import { PageShell } from '@/components/layout/PageShell'
import { toast } from 'sonner'
import type { StayFormValues } from '@/schemas/stay.schema'

export const Route = createFileRoute('/stays/new')({
  component: NewStayPage,
})

function NewStayPage() {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const search = Route.useSearch() as { dogId?: string }

  const handleSubmit = async (values: StayFormValues) => {
    setSubmitting(true)
    const { data, error } = await supabase
      .from('stays')
      .insert({
        dog_id: values.dog_id,
        date_from: values.date_from,
        date_to: values.date_to,
        notes: values.notes || null,
      })
      .select()
      .single()

    if (error || !data) {
      toast.error('Nepodařilo se přidat termín')
    } else {
      toast.success('Termín přidán')
      navigate({ to: '/stays/$stayId', params: { stayId: data.id } })
    }
    setSubmitting(false)
  }

  return (
    <PageShell>
      <div className="max-w-xl space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Přidat termín hlídání</h1>
        <div className="rounded-[--radius-card] border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
          <StayForm
            defaultValues={search.dogId ? { dog_id: search.dogId } : undefined}
            onSubmit={handleSubmit}
            submitting={submitting}
          />
        </div>
      </div>
    </PageShell>
  )
}
