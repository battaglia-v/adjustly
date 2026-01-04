import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const statusPillVariants = cva(
  "inline-flex items-center justify-center px-2.5 py-1 text-xs font-medium rounded-full",
  {
    variants: {
      status: {
        tracking: "bg-primary/10 text-primary",
        possible: "bg-warning/10 text-warning",
        ready: "bg-success/10 text-success",
        expired: "bg-muted text-muted-foreground",
      },
    },
    defaultVariants: {
      status: "tracking",
    },
  }
)

const statusLabels: Record<string, string> = {
  tracking: "Tracking",
  possible: "Possible",
  ready: "Ready to Claim",
  expired: "Expired",
}

interface StatusPillProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusPillVariants> {}

function StatusPill({ className, status, ...props }: StatusPillProps) {
  return (
    <span
      className={cn(statusPillVariants({ status, className }))}
      {...props}
    >
      {statusLabels[status ?? "tracking"]}
    </span>
  )
}

export { StatusPill, statusPillVariants }
export type { StatusPillProps }
