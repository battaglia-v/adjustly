"use client"

import { cn } from "@/lib/utils"
import type { TrackedItem } from "@/lib/types"
import { Button } from "./button"

interface RefundPassCardProps {
  item: TrackedItem
  onCopyDetails: () => void
  onShowReceipt: () => void
  onMarkClaimed: () => void
  className?: string
}

function RefundPassCard({
  item,
  onCopyDetails,
  onShowReceipt,
  onMarkClaimed,
  className,
}: RefundPassCardProps) {
  const paidTotal = item.unitPrice * item.quantity
  const newPrice = item.promoPrice ?? item.verifiedPrice ?? item.unitPrice
  const newTotal = newPrice * item.quantity
  const refundAmount = paidTotal - newTotal

  const formattedPaid = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(paidTotal)

  const formattedNew = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(newTotal)

  const formattedRefund = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(refundAmount)

  const sourceLabel =
    item.detectionSource === "promo_match"
      ? "High confidence — promo match"
      : item.detectionSource === "verified_shelf"
        ? "Medium confidence — verified shelf price"
        : "Price difference detected"

  const purchaseDate = new Date(item.purchaseDate).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  return (
    <div
      className={cn(
        "bg-card rounded-[16px] border border-border overflow-hidden",
        className
      )}
    >
      {/* Header with dashed border effect */}
      <div className="bg-primary/5 px-4 py-3 border-b border-dashed border-border">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-primary uppercase tracking-wider">
            Refund Pass
          </span>
          <span className="text-xs text-muted-foreground">
            #{item.itemNumber}
          </span>
        </div>
      </div>

      {/* Main content */}
      <div className="p-4 space-y-4">
        {/* Item info */}
        <div>
          <h3 className="text-lg font-semibold text-foreground line-clamp-2">
            {item.description}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Purchased {purchaseDate}
            {item.warehouse && ` • ${item.warehouse}`}
          </p>
        </div>

        {/* Price comparison */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Paid</p>
            <p className="text-lg font-semibold tabular-nums line-through text-muted-foreground">
              {formattedPaid}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Current price</p>
            <p className="text-lg font-semibold tabular-nums text-foreground">
              {formattedNew}
            </p>
          </div>
        </div>

        {/* Refund amount - hero */}
        <div className="bg-success/10 rounded-[12px] p-4 text-center">
          <p className="text-xs text-success font-medium mb-1">Potential Refund</p>
          <p className="text-3xl font-bold text-success tabular-nums">
            {formattedRefund}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            {sourceLabel}
          </p>
        </div>

        {/* Quantity note */}
        {item.quantity > 1 && (
          <p className="text-xs text-muted-foreground text-center">
            Based on {item.quantity} units purchased
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="p-4 pt-0 space-y-3">
        <Button variant="primary" onClick={onCopyDetails}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
          </svg>
          Copy details
        </Button>

        {item.receiptImage && (
          <Button variant="secondary" onClick={onShowReceipt}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" />
              <path d="M14 8H8" />
              <path d="M16 12H8" />
              <path d="M13 16H8" />
            </svg>
            Show receipt
          </Button>
        )}

        <Button variant="ghost" onClick={onMarkClaimed} className="text-success">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
          Mark as claimed
        </Button>
      </div>
    </div>
  )
}

export { RefundPassCard }
