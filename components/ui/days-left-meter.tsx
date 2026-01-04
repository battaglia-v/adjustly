import { cn } from "@/lib/utils"

interface DaysLeftMeterProps {
  daysLeft: number
  windowDays?: number
  className?: string
}

function DaysLeftMeter({
  daysLeft,
  windowDays = 30,
  className,
}: DaysLeftMeterProps) {
  const progress = Math.max(0, Math.min(100, (daysLeft / windowDays) * 100))
  const isUrgent = daysLeft <= 3
  const isWarning = daysLeft <= 10 && daysLeft > 3
  const isExpired = daysLeft <= 0

  const barColor = isExpired
    ? "bg-muted-foreground"
    : isUrgent
      ? "bg-danger"
      : isWarning
        ? "bg-warning"
        : "bg-success"

  const textColor = isExpired
    ? "text-muted-foreground"
    : isUrgent
      ? "text-danger"
      : isWarning
        ? "text-warning"
        : "text-success"

  const label = isExpired
    ? "Expired"
    : daysLeft === 1
      ? "1 day left"
      : `${daysLeft} days left`

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <span className={cn("text-xs font-medium tabular-nums", textColor)}>
        {label}
      </span>
      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all", barColor)}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}

export { DaysLeftMeter }
