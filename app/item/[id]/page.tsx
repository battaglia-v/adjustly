"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { AppShell } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { StatusPill } from "@/components/ui/status-pill"
import { DaysLeftMeter } from "@/components/ui/days-left-meter"
import { BottomSheetModal } from "@/components/ui/bottom-sheet-modal"
import { useAppStore, computeDaysLeft, computeStatus, computePotentialRefund } from "@/lib/store"

export default function ItemDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const { getItem, updateItem, deleteItem, settings } = useAppStore()
  const item = getItem(id)

  const [verifyOpen, setVerifyOpen] = useState(false)
  const [verifyPrice, setVerifyPrice] = useState("")
  const [deleteConfirm, setDeleteConfirm] = useState(false)

  if (!item) {
    return (
      <AppShell title="Item Not Found">
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">This item doesn&apos;t exist.</p>
          <Button variant="primary" onClick={() => router.push("/")}>
            Go to Tracked
          </Button>
        </div>
      </AppShell>
    )
  }

  const daysLeft = computeDaysLeft(item.purchaseDate, settings.adjustmentWindowDays)
  const status = computeStatus(item, settings.adjustmentWindowDays)
  const potentialRefund = computePotentialRefund({ ...item, status })

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(item.unitPrice)

  const formattedTotal = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(item.unitPrice * item.quantity)

  const purchaseDate = new Date(item.purchaseDate).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  const handleVerify = () => {
    const price = parseFloat(verifyPrice)
    if (isNaN(price) || price <= 0) return

    updateItem(id, {
      verifiedPrice: price,
      detectionSource: "verified_shelf",
    })
    setVerifyOpen(false)
    setVerifyPrice("")
  }

  const handleDelete = () => {
    deleteItem(id)
    router.push("/")
  }

  const showRefundPass = status === "ready" || status === "possible"

  return (
    <AppShell
      title="Item Details"
      rightAction={
        <button
          onClick={() => setDeleteConfirm(true)}
          className="p-2 -mr-2 text-muted-foreground hover:text-danger transition-colors"
        >
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
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            <line x1="10" x2="10" y1="11" y2="17" />
            <line x1="14" x2="14" y1="11" y2="17" />
          </svg>
        </button>
      }
    >
      <div className="space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-start justify-between gap-3 mb-2">
            <h2 className="text-xl font-semibold">{item.description}</h2>
            <StatusPill status={status} />
          </div>
          <p className="text-sm text-muted-foreground">#{item.itemNumber}</p>
        </div>

        {/* Receipt image */}
        {item.receiptImage && (
          <div>
            <img
              src={item.receiptImage}
              alt="Receipt"
              className="w-full rounded-[12px] border border-border"
            />
          </div>
        )}

        {/* Details card */}
        <div className="bg-card rounded-[16px] p-4 border border-border space-y-4">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Unit price</span>
            <span className="font-medium tabular-nums">{formattedPrice}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Quantity</span>
            <span className="font-medium tabular-nums">{item.quantity}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Total paid</span>
            <span className="font-medium tabular-nums">{formattedTotal}</span>
          </div>
          <div className="border-t border-border pt-4">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Purchased</span>
              <span className="text-sm">{purchaseDate}</span>
            </div>
            {item.warehouse && (
              <div className="flex justify-between mt-2">
                <span className="text-sm text-muted-foreground">Warehouse</span>
                <span className="text-sm">{item.warehouse}</span>
              </div>
            )}
          </div>
        </div>

        {/* Days left */}
        {status !== "expired" && (
          <div className="bg-card rounded-[16px] p-4 border border-border">
            <DaysLeftMeter daysLeft={daysLeft} windowDays={settings.adjustmentWindowDays} />
          </div>
        )}

        {/* Price detection status */}
        {(item.promoPrice || item.verifiedPrice) && (
          <div className="bg-success/10 rounded-[16px] p-4">
            <p className="text-xs text-success font-medium mb-1">Price drop detected</p>
            <p className="text-lg font-semibold tabular-nums">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(item.promoPrice ?? item.verifiedPrice ?? 0)}
              <span className="text-sm text-muted-foreground font-normal ml-2">
                (was {formattedPrice})
              </span>
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              {item.detectionSource === "promo_match"
                ? "High confidence — promo match"
                : "Medium confidence — verified shelf price"}
            </p>
            {potentialRefund > 0 && (
              <p className="text-sm font-medium text-success mt-3">
                Potential refund: {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(potentialRefund)}
              </p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          {showRefundPass && (
            <Button variant="primary" onClick={() => router.push(`/refund/${id}`)}>
              View Refund Pass
            </Button>
          )}

          {status === "tracking" && (
            <Button variant="primary" onClick={() => setVerifyOpen(true)}>
              Quick Verify Price
            </Button>
          )}

          {!item.verifiedPrice && item.promoPrice && (
            <Button variant="secondary" onClick={() => setVerifyOpen(true)}>
              Override with Shelf Price
            </Button>
          )}
        </div>
      </div>

      {/* Verify Bottom Sheet */}
      <BottomSheetModal
        open={verifyOpen}
        onOpenChange={setVerifyOpen}
        title="Quick Verify"
        description="Enter the current shelf price you see in the warehouse."
        footer={
          <Button
            variant="primary"
            onClick={handleVerify}
            disabled={!verifyPrice || parseFloat(verifyPrice) <= 0}
          >
            Confirm Price
          </Button>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Current shelf price</label>
            <div className="relative mt-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                $
              </span>
              <input
                type="number"
                step="0.01"
                value={verifyPrice}
                onChange={(e) => setVerifyPrice(e.target.value)}
                placeholder="0.00"
                className="w-full h-12 pl-8 pr-4 rounded-[12px] border border-border bg-background text-foreground text-lg tabular-nums"
                autoFocus
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            If lower than your purchase price ({formattedPrice}), we&apos;ll calculate your potential refund.
          </p>
        </div>
      </BottomSheetModal>

      {/* Delete Confirmation */}
      <BottomSheetModal
        open={deleteConfirm}
        onOpenChange={setDeleteConfirm}
        title="Delete Item"
        description="Are you sure you want to remove this item from tracking?"
        footer={
          <Button variant="destructive" onClick={handleDelete}>
            Delete Item
          </Button>
        }
      >
        <p className="text-sm text-muted-foreground">
          This action cannot be undone.
        </p>
      </BottomSheetModal>
    </AppShell>
  )
}
