'use client'

import { forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 font-medium transition-all duration-[120ms] cursor-pointer select-none disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-1',
  {
    variants: {
      variant: {
        primary:
          'bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800 shadow-sm',
        secondary:
          'bg-surface text-foreground border border-border hover:bg-surface-raised hover:border-border-strong shadow-xs',
        ghost:
          'text-foreground-muted hover:text-foreground hover:bg-border-subtle',
        danger:
          'bg-danger text-white hover:opacity-90 active:opacity-80 shadow-sm',
        'danger-ghost':
          'text-danger hover:bg-danger-bg',
        link:
          'text-brand-600 underline-offset-4 hover:underline p-0 h-auto',
      },
      size: {
        xs: 'h-7 px-2.5 text-xs rounded-[var(--radius-sm)]',
        sm: 'h-8 px-3 text-xs rounded-[var(--radius-sm)]',
        md: 'h-9 px-4 text-sm rounded-[var(--radius-md)]',
        lg: 'h-10 px-5 text-sm rounded-[var(--radius-md)]',
        xl: 'h-12 px-6 text-base rounded-[var(--radius-lg)]',
        icon: 'h-9 w-9 rounded-[var(--radius-md)]',
        'icon-sm': 'h-7 w-7 rounded-[var(--radius-sm)]',
        'icon-lg': 'h-10 w-10 rounded-[var(--radius-md)]',
      },
    },
    defaultVariants: {
      variant: 'secondary',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      >
        {loading && (
          <svg
            className="h-3.5 w-3.5 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button, buttonVariants }
