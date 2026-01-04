"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { AppShell } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { BottomSheetModal } from "@/components/ui/bottom-sheet-modal"
import { useAppStore } from "@/lib/store"

const COSTCO_RECEIPTS_URL = "https://www.costco.com/OrderStatusCmd"
const COSTCO_SYNC_ENABLED = process.env.NEXT_PUBLIC_ENABLE_COSTCO_SYNC_BETA === "true"

export default function CostcoSyncPage() {
  const router = useRouter()
  const [showHelp, setShowHelp] = useState(false)
  const [showFallback, setShowFallback] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [importResult, setImportResult] = useState({ imported: 0, skipped: 0 })
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { addItem, items } = useAppStore()

  // Redirect if feature is disabled
  if (!COSTCO_SYNC_ENABLED) {
    router.replace("/import")
    return null
  }

  const handleOpenCostco = () => {
    window.open(COSTCO_RECEIPTS_URL, "_blank")
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // For POC: simulate processing the file
    // In production, this would parse PDF/image with OCR
    const reader = new FileReader()
    reader.onload = () => {
      // Simulate import - in real implementation would parse receipt
      // For now, show the fallback to manual entry
      setShowFallback(true)
    }
    reader.readAsDataURL(file)
  }

  const handleManualFallback = () => {
    setShowFallback(false)
    router.push("/import?manual=true")
  }

  const handleScreenshotFallback = () => {
    setShowFallback(false)
    fileInputRef.current?.click()
  }

  return (
    <AppShell title="Sync with Costco">
      <div className="space-y-6">
        {/* Beta badge */}
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 text-xs font-medium bg-warning/20 text-warning rounded-full">
            Beta
          </span>
          <span className="text-xs text-muted-foreground">
            May change or break if Costco updates their site
          </span>
        </div>

        {/* Safety bullets */}
        <div className="bg-card rounded-[16px] p-4 border border-border space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-success">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <p className="text-sm">
              Adjustly <strong>doesn&apos;t store your Costco password</strong>.
            </p>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-success">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <p className="text-sm">
              You&apos;ll sign in on Costco, then <strong>share a receipt PDF/screenshot</strong> back to Adjustly.
            </p>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-success">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <p className="text-sm">
              Works best when you import <strong>one receipt at a time</strong>.
            </p>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-warning/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-warning">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <p className="text-sm text-muted-foreground">
              Note: Warehouse receipts can take <strong>up to ~24 hours</strong> to appear online.
            </p>
          </div>
        </div>

        {/* Primary CTA */}
        <Button variant="primary" onClick={handleOpenCostco}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
          Open Costco Receipts
        </Button>

        {/* Upload receipt after returning */}
        <div className="bg-surface-2 rounded-[12px] p-4">
          <p className="text-sm font-medium mb-2">After you export a receipt:</p>
          <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" x2="12" y1="3" y2="15" />
            </svg>
            Upload Receipt PDF/Screenshot
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>

        {/* Secondary actions */}
        <div className="space-y-2">
          <Button variant="ghost" onClick={() => setShowHelp(true)}>
            How it works
          </Button>
          <Button variant="ghost" onClick={() => router.back()}>
            Not now
          </Button>
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-muted-foreground text-center">
          Not affiliated with Costco. Costco&apos;s site and app are subject to their terms.
        </p>
      </div>

      {/* Help sheet */}
      <BottomSheetModal
        open={showHelp}
        onOpenChange={setShowHelp}
        title="How it works"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-primary">1</span>
            </div>
            <p className="text-sm">Open Costco receipts in your browser and sign in</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-primary">2</span>
            </div>
            <p className="text-sm">Pick a purchase → View receipt</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-primary">3</span>
            </div>
            <p className="text-sm">Share/Save PDF (or screenshot) → come back and upload it here</p>
          </div>
        </div>
      </BottomSheetModal>

      {/* Fallback sheet */}
      <BottomSheetModal
        open={showFallback}
        onOpenChange={setShowFallback}
        title="Can't parse this file yet"
        description="PDF parsing is coming soon. For now, please add items manually."
      >
        <div className="space-y-3">
          <Button variant="secondary" onClick={handleScreenshotFallback}>
            Upload screenshots
          </Button>
          <Button variant="primary" onClick={handleManualFallback}>
            Add items manually
          </Button>
        </div>
      </BottomSheetModal>

      {/* Success sheet */}
      <BottomSheetModal
        open={showSuccess}
        onOpenChange={setShowSuccess}
        title="Import complete"
      >
        <div className="space-y-4">
          <div className="bg-success/10 rounded-[12px] p-4 text-center">
            <p className="text-2xl font-bold text-success">{importResult.imported}</p>
            <p className="text-sm text-muted-foreground">items imported</p>
          </div>
          {importResult.skipped > 0 && (
            <p className="text-sm text-muted-foreground text-center">
              Skipped {importResult.skipped} duplicate{importResult.skipped !== 1 ? "s" : ""}
            </p>
          )}
          <Button variant="primary" onClick={() => router.push("/")}>
            View tracked items
          </Button>
        </div>
      </BottomSheetModal>
    </AppShell>
  )
}
