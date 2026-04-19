import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface PageShellProps {
  children: ReactNode
  className?: string
}

export function PageShell({ children, className }: PageShellProps) {
  return (
    <div className={cn('max-w-7xl mx-auto px-4 py-6 md:px-6 md:py-8', className)}>
      {children}
    </div>
  )
}
