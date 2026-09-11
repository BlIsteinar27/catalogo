'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutGrid, Plus, Tags, LogOut, ArrowLeft } from 'lucide-react'
import { motion } from 'motion/react'
import { signOut } from '@/server/auth'
import { cn } from '@/lib/utils'

const MotionLink = motion(Link)

const navItems = [
  { href: '/dashboard', label: 'Productos', icon: LayoutGrid, exact: true },
  { href: '/dashboard/nuevo', label: 'Nuevo producto', icon: Plus, exact: false },
  { href: '/dashboard/categorias', label: 'Categorías', icon: Tags, exact: false },
]

export function DashboardSidebar({ totalProducts }: { totalProducts: number }) {
  const pathname = usePathname()

  const handleLogout = async () => {
    const result = await signOut()
    if (result.success) {
      window.location.href = '/login'
    }
  }

  const navItems = [
    { href: '/dashboard', label: 'Productos', icon: LayoutGrid, exact: true },
    { href: '/dashboard/categorias', label: 'Categorías', icon: Tags, exact: false },
  ]

  return (
    <aside className="flex w-16 md:w-60 flex-col border-r border-glass-border bg-canvas h-full overflow-hidden">
      <div className="border-b border-glass-border px-3 md:px-5 py-4 hidden md:block flex-shrink-0">
        <MotionLink href="/" className="text-xs text-ink-muted" whileHover={{ color: 'var(--color-brand)' }} transition={{ duration: 0.2 }} aria-label="Volver al catálogo">← Ver catálogo</MotionLink>
        <p className="mt-1 font-display text-lg font-bold text-ink">Admin Panel</p>
      </div>
      <div className="border-b border-glass-border px-3 py-4 md:hidden flex-shrink-0">
        <MotionLink href="/" className="flex items-center justify-center text-ink-secondary" whileHover={{ color: 'var(--color-brand)' }} transition={{ duration: 0.2 }} aria-label="Volver al catálogo">
          <ArrowLeft size={20} />
        </MotionLink>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-2 md:p-3 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const isActive = exact 
            ? pathname === href 
            : pathname.startsWith(href) && (pathname === href || pathname[href.length] === '/')
          return (
            <MotionLink key={href} href={href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium',
                isActive ? 'text-white' : 'text-ink-secondary'
              )}
              style={isActive ? { backgroundColor: 'var(--color-brand)' } : undefined}
              whileHover={!isActive ? { backgroundColor: 'var(--color-brand)', color: 'white', x: 4 } : undefined}
              transition={{ duration: 0.2 }}
              aria-current={isActive ? 'page' : undefined}
              aria-label={label}
            >
              <Icon size={16} />
              <span className="hidden md:inline">{label}</span>
            </MotionLink>
          )
        })}
      </nav>
      <div className="border-t border-glass-border p-2 md:p-3 flex-shrink-0">
        <motion.button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center justify-center md:justify-start gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-ink-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
          whileHover={{ backgroundColor: 'var(--color-destructive-bg)', color: 'var(--color-destructive)' }}
          transition={{ duration: 0.2 }}
          aria-label="Cerrar sesión"
        >
          <LogOut size={16} />
          <span className="hidden md:inline">Cerrar sesión</span>
        </motion.button>
      </div>
    </aside>
  )
}
