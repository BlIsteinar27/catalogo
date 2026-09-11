'use client'

import { AlertTriangle } from 'lucide-react'

export default function DashboardError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 p-8 text-center">
      <AlertTriangle size={48} className="text-destructive" aria-hidden="true" />
      <h2 className="text-xl font-bold text-ink">Error en el panel</h2>
      <p className="text-sm text-ink-secondary">{error.message}</p>
      <button onClick={reset} className="rounded-md border border-border-strong bg-surface px-4 py-2 text-sm font-medium hover:bg-surface-elevated">Reintentar</button>
    </div>
  )
}
