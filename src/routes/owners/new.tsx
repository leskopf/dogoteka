import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { OwnerForm } from '@/components/owners/OwnerForm'
import { PageShell } from '@/components/layout/PageShell'
import { toast } from 'sonner'
import type { OwnerFormValues } from '@/schemas/owner.schema'

export const Route = createFileRoute('/owners/new')({
  component: NewOwnerPage,
})

function NewOwnerPage() {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (values: OwnerFormValues) => {
    setSubmitting(true)
    const { data, error } = await supabase
      .from('owners')
      .insert({
        first_name: values.first_name,
        last_name: values.last_name,
        phone: values.phone,
        phone_emergency: values.phone_emergency || null,
        email: values.email || null,
        address: values.address || null,
        is_recurring: values.is_recurring,
      })
      .select()
      .single()

    if (error || !data) {
      toast.error('Nepodařilo se přidat majitele')
    } else {
      toast.success(`${data.first_name} ${data.last_name} přidán`)
      navigate({ to: '/owners/$ownerId', params: { ownerId: data.id } })
    }
    setSubmitting(false)
  }

  return (
    <PageShell>
      <div className="max-w-2xl space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Přidat majitele</h1>
        <div className="rounded-[--radius-card] border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
          <OwnerForm onSubmit={handleSubmit} submitting={submitting} />
        </div>
      </div>
    </PageShell>
  )
}
