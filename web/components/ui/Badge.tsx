import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1 font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-foreground text-background',
        brand: 'bg-brand-100 text-brand-700',
        success: 'bg-success-bg text-success',
        warning: 'bg-warning-bg text-warning',
        danger: 'bg-danger-bg text-danger',
        info: 'bg-info-bg text-info',
        muted: 'bg-border-subtle text-foreground-muted',
        outline: 'border border-border text-foreground-muted bg-transparent',
      },
      size: {
        sm: 'text-[10px] px-1.5 py-0.5 rounded-[var(--radius-xs)]',
        md: 'text-xs px-2 py-0.5 rounded-[var(--radius-sm)]',
        lg: 'text-sm px-2.5 py-1 rounded-[var(--radius-sm)]',
      },
    },
    defaultVariants: {
      variant: 'muted',
      size: 'md',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, size }), className)} {...props} />
}
