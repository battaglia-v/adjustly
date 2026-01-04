"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { AppShell } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { RefundPassCard } from "@/components/ui/refund-pass-card"
import { useAppStore } from "@/lib/store"

export default function RefundPassPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const { getItem, updateItem } = useAppStore()
  const item = getItem(id)

  const [copied, setCopied] = useState(false)
  const [showReceipt, setShowReceipt] = useState(false)

  if (!item) {
    return (
      <AppShell title="Not Found" hideNav>
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Item not found.</p>
          <Button variant="primary" onClick={() => router.push("/")}>
            Go to Tracked
          </Button>
        </div>
      </AppShell>
    )
  }

  const newPrice = item.promoPrice ?? item.verifiedPrice ?? item.unitPrice
  const refundAmount = (item.unitPrice - newPrice) * item.quantity

  const handleCopyDetails = async () => {
    const details = `
PRICE ADJUSTMENT REQUEST
========================
Item: ${item.description}
Item #: ${item.itemNumber}
Purchase Date: ${new Date(item.purchaseDate).toLocaleDateString()}
${item.warehouse ? `Warehouse: ${item.warehouse}` : ""}

Price Paid: $${item.unitPrice.toFixed(2)} × ${item.quantity}
Current Price: $${newPrice.toFixed(2)} × ${item.quantity}
Refund Amount: $${refundAmount.toFixed(2)}

Source: ${item.detectionSource === "promo_match" ? "Promo Match" : "Verified Shelf Price"}
    `.trim()

    try {
      await navigator.clipboard.writeText(details)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      // Fallback for older browsers
      const textarea = document.createElement("textarea")
      textarea.value = details
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand("copy")
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleShowReceipt = () => {
    setShowReceipt(true)
  }

  const handleMarkClaimed = () => {
    updateItem(id, { status: "expired" })
    router.push("/")
  }

  return (
    <AppShell
      title="Refund Pass"
      hideNav
      rightAction={
        <button
          onClick={() => router.back()}
          className="p-2 -mr-2 text-muted-foreground hover:text-foreground transition-colors"
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
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      }
    >
      <div className="space-y-4">
        {/* Copied toast */}
        {copied && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-foreground text-background px-4 py-2 rounded-full text-sm font-medium shadow-lg">
            Copied to clipboard!
          </div>
        )}

        <RefundPassCard
          item={item}
          onCopyDetails={handleCopyDetails}
          onShowReceipt={handleShowReceipt}
          onMarkClaimed={handleMarkClaimed}
        />

        {/* Disclaimer */}
        <div className="bg-surface-2 rounded-[12px] p-3">
          <p className="text-xs text-muted-foreground">
            <strong>Disclaimer:</strong> Adjustly is not affiliated with Costco Wholesale Corporation.
            Price adjustment policies vary by location. Please verify with your warehouse.
          </p>
        </div>
      </div>

      {/* Receipt modal */}
      {showReceipt && item.receiptImage && (
        <div
          className="fixed inset-0 z-50 bg-background/95 flex items-center justify-center p-4"
          onClick={() => setShowReceipt(false)}
        >
          <div className="relative max-w-lg w-full">
            <button
              onClick={() => setShowReceipt(false)}
              className="absolute -top-12 right-0 p-2 text-foreground"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
            <img
              src={item.receiptImage}
              alt="Receipt"
              className="w-full rounded-[16px]"
            />
          </div>
        </div>
      )}
    </AppShell>
  )
}
