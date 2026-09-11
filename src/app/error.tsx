'use client'

import { useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => { console.error(error) }, [error])
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center px-4">
      <AlertTriangle size={64} className="text-destructive" aria-hidden="true" />
      <h1 className="text-2xl font-bold text-ink">Algo salió mal</h1>
      <p className="text-sm text-ink-secondary">{error.message}</p>
      <Button onClick={reset}>Reintentar</Button>
    </div>
  )
}
