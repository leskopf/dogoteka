import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { supabase } from '@/lib/supabase'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { toast } from 'sonner'
import { useState } from 'react'

const loginSchema = z.object({
  email: z.string().email('Neplatný e-mail'),
  password: z.string().min(1, 'Heslo je povinné'),
})
type LoginValues = z.infer<typeof loginSchema>

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const search = Route.useSearch() as { redirect?: string }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) })

  const onSubmit = async (values: LoginValues) => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    })
    if (error) {
      toast.error('Přihlášení selhalo: nesprávné údaje')
    } else {
      navigate({ to: (search.redirect as string) ?? '/' })
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="text-5xl">🐾</span>
          <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-gray-100">Dogoteka</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Správa hlídaných psů</p>
        </div>
        <div className="rounded-[--radius-card] border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="E-mail"
              type="email"
              autoComplete="email"
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              label="Heslo"
              type="password"
              autoComplete="current-password"
              error={errors.password?.message}
              {...register('password')}
            />
            <Button type="submit" className="w-full" loading={loading}>
              Přihlásit se
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
