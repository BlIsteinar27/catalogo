'use client'

import { forwardRef, useId, useState } from 'react'
import { motion } from 'motion/react'
import { Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'

type NativeButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'onAnimationStart' | 'onDrag' | 'onDragStart' | 'onDragEnd'
>

interface SwitchProps extends NativeButtonProps {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  label?: string
}

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  ({ checked, onCheckedChange, disabled = false, className, label, id, ...props }, ref) => {
    const [internalChecked, setInternalChecked] = useState(checked ?? false)
    const isControlled = checked !== undefined
    const isChecked = isControlled ? checked : internalChecked
    const generatedId = useId()
    const switchId = id ?? generatedId
    const labelId = `${switchId}-label`

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        const newValue = !isChecked
        if (!isControlled) setInternalChecked(newValue)
        onCheckedChange?.(newValue)
      }
    }

    const handleClick = () => {
      const newValue = !isChecked
      if (!isControlled) setInternalChecked(newValue)
      onCheckedChange?.(newValue)
    }

    return (
      <div className="flex items-center gap-3">
        <motion.button
          {...props}
          ref={ref}
          id={switchId}
          type="button"
          role="switch"
          aria-checked={isChecked}
          aria-labelledby={label ? labelId : undefined}
          aria-label={label ? undefined : props['aria-label']}
          disabled={disabled}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            'relative h-7 w-12 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            isChecked ? 'bg-success' : 'bg-border-strong',
            className
          )}
        >
          <motion.span
            className="absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow-md flex items-center justify-center"
            animate={{ x: isChecked ? 20 : 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          >
            {isChecked ? (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              >
                <Check className="h-4 w-4 text-success" strokeWidth={3} />
              </motion.div>
            ) : (
              <motion.div
                initial={{ scale: 0, rotate: 180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              >
                <X className="h-4 w-4 text-destructive" strokeWidth={3} />
              </motion.div>
            )}
          </motion.span>
        </motion.button>
        {label && (
          <label
            htmlFor={switchId}
            id={labelId}
            className={cn(
              'text-sm font-medium cursor-pointer select-none transition-colors duration-200',
              isChecked ? 'text-success' : 'text-ink-secondary'
            )}
          >
            {label}
          </label>
        )}
      </div>
    )
  }
)

Switch.displayName = 'Switch'
