"use client"

import { cn } from "@/lib/utils"
import type { TrackedItem } from "@/lib/types"
import { StatusPill } from "./status-pill"
import { DaysLeftMeter } from "./days-left-meter"

interface ItemCardProps {
  item: TrackedItem
  windowDays?: number
  onClick?: () => void
  className?: string
}

function ItemCard({ item, windowDays = 30, onClick, className }: ItemCardProps) {
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(item.unitPrice)

  const formattedDate = new Date(item.purchaseDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left bg-card rounded-[16px] p-4 border border-border",
        "transition-all active:scale-[0.98]",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <p className="text-base font-medium text-foreground line-clamp-2">
            {item.description}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            #{item.itemNumber}
          </p>
        </div>
        <StatusPill status={item.status} />
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
        <span className="tabular-nums">
          {formattedPrice} × {item.quantity}
        </span>
        <span>{formattedDate}</span>
      </div>

      {item.status !== "expired" && item.daysLeft !== undefined && (
        <DaysLeftMeter daysLeft={item.daysLeft} windowDays={windowDays} />
      )}

      {item.potentialRefund && item.potentialRefund > 0 && (
        <div className="mt-3 pt-3 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Potential refund</span>
            <span className="text-sm font-semibold text-success tabular-nums">
              +{new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(item.potentialRefund)}
            </span>
          </div>
        </div>
      )}
    </button>
  )
}

export { ItemCard }
