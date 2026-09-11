'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'

const MotionLink = motion(Link)

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center px-4">
      <Search size={64} className="text-ink-placeholder" aria-hidden="true" />
      <h1 className="text-2xl font-bold text-ink">Página no encontrada</h1>
      <Button asChild>
        <MotionLink href="/" whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
          Volver al catálogo
        </MotionLink>
      </Button>
    </div>
  )
}
