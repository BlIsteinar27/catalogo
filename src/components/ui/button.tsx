'use client'

import { cn } from '@/lib/utils'
import type { ReactNode, Ref } from 'react'
import { motion, type HTMLMotionProps } from 'motion/react'
import { cloneElement, isValidElement, forwardRef } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'destructive'
type Size = 'sm' | 'md' | 'lg'

// Extendemos `HTMLMotionProps<'button'>` (en vez de `ButtonHTMLAttributes`)
// porque es el tipo real que espera `motion.button`: ya excluye los
// atributos nativos que colisionan de signatura con los de Motion
// (onDrag*, onAnimationStart/End, onTransitionEnd, style, etc.) y los
// reemplaza por las versiones de Motion. Así evitamos el cast `as any` que
// existía antes al spread-ear `props` sobre `<motion.button>`.
interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: Variant
  size?: Size
  loading?: boolean
  asChild?: boolean
  // Motion permite que `children` sea un `MotionValue<number | string>`
  // (para bindear texto animado), pero este Button solo necesita children
  // React normales. Lo redeclaramos como `ReactNode` para poder renderizarlo
  // directamente en JSX sin choque de tipos.
  children?: ReactNode
}

// Props que asumimos sobre el elemento hijo cuando se usa `asChild` (p. ej.
// <Link>, <MotionLink>). No conocemos su tipo exacto en tiempo de compilación,
// así que el resto de props se tipan con un índice `unknown` (en vez de `any`)
// para conservar seguridad de tipos: cualquier valor puede asignarse a
// `unknown`, pero para *usarlo* hay que angostar el tipo primero. Los campos
// que sí leemos/escribimos explícitamente (className, disabled, children,
// ref) quedan tipados de forma precisa.
type ChildLikeProps = {
  className?: string
  disabled?: boolean
  children?: ReactNode
  ref?: Ref<HTMLButtonElement>
} & Record<string, unknown>

const variants: Record<Variant, string> = {
  primary: 'bg-brand text-white hover:bg-brand-hover',
  secondary: 'bg-surface text-ink border border-border-strong hover:bg-surface-elevated',
  ghost: 'text-ink-secondary hover:bg-surface hover:text-ink',
  destructive: 'bg-destructive-bg text-destructive border border-destructive/20 hover:bg-destructive hover:text-white',
}

const sizes: Record<Size, string> = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button({
  variant = 'primary', size = 'md', loading = false,
  className, children, disabled, asChild = false, ...props
}, ref) {
  const buttonClassName = cn(
    'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
    variants[variant], sizes[size], className
  )

  const loadingContent = loading && (
    <motion.svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </motion.svg>
  )

  const isDisabled = disabled || loading

  // Si asChild es true y children es un elemento React válido, clonamos el elemento
  // y le reenviamos el ref recibido, para que Motion (y cualquier consumidor)
  // pueda seguir animando/referenciando el nodo real renderizado (p. ej. el
  // <a> de un <Link>), igual que en el caso sin asChild.
  if (asChild && isValidElement<ChildLikeProps>(children)) {
    const childProps = children.props
    return cloneElement(children, {
      ref,
      className: cn(buttonClassName, childProps.className),
      disabled: isDisabled,
      ...props,
      children: (
        <>
          {loadingContent}
          {childProps.children}
        </>
      ),
    })
  }

  // Renderizado normal del button con motion
  return (
    <motion.button
      ref={ref}
      className={buttonClassName}
      disabled={isDisabled}
      whileTap={!isDisabled ? { scale: 0.96 } : undefined}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      {...props}
    >
      {loadingContent}
      {children}
    </motion.button>
  )
})

Button.displayName = 'Button'
