"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AppShell } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { BottomSheetModal } from "@/components/ui/bottom-sheet-modal"
import { useAppStore } from "@/lib/store"

const COSTCO_SYNC_AVAILABLE = process.env.NEXT_PUBLIC_ENABLE_COSTCO_SYNC_BETA === "true"

export default function SettingsPage() {
  const router = useRouter()
  const { settings, updateSettings, exportData, wipeAllData, items } = useAppStore()
  const [wipeConfirm, setWipeConfirm] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleExport = () => {
    const data = exportData()
    const blob = new Blob([data], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `adjustly-backup-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleWipe = () => {
    wipeAllData()
    setWipeConfirm(false)
  }

  const handleDarkModeChange = (mode: "system" | "light" | "dark") => {
    updateSettings({ darkMode: mode })

    // Apply immediately
    const root = document.documentElement
    if (mode === "dark") {
      root.classList.add("dark")
    } else if (mode === "light") {
      root.classList.remove("dark")
    } else {
      // System preference
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        root.classList.add("dark")
      } else {
        root.classList.remove("dark")
      }
    }
  }

  return (
    <AppShell title="Settings">
      <div className="space-y-6">
        {/* Adjustment Window */}
        <section className="bg-card rounded-[16px] p-4 border border-border">
          <h3 className="text-sm font-medium mb-3">Adjustment Window</h3>
          <p className="text-xs text-muted-foreground mb-3">
            Number of days after purchase to claim a price adjustment.
          </p>
          <div className="flex items-center gap-3">
            {[14, 30, 60, 90].map((days) => (
              <button
                key={days}
                onClick={() => updateSettings({ adjustmentWindowDays: days })}
                className={`flex-1 h-10 rounded-[8px] text-sm font-medium transition-colors ${
                  settings.adjustmentWindowDays === days
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-foreground"
                }`}
              >
                {days}d
              </button>
            ))}
          </div>
        </section>

        {/* Appearance */}
        <section className="bg-card rounded-[16px] p-4 border border-border">
          <h3 className="text-sm font-medium mb-3">Appearance</h3>
          <div className="flex items-center gap-3">
            {(["system", "light", "dark"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => handleDarkModeChange(mode)}
                className={`flex-1 h-10 rounded-[8px] text-sm font-medium transition-colors capitalize ${
                  settings.darkMode === mode
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-foreground"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </section>

        {/* Costco Sync (Beta) */}
        {COSTCO_SYNC_AVAILABLE && (
          <section className="bg-card rounded-[16px] p-4 border border-border space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-medium">Costco Sync</h3>
                <span className="px-1.5 py-0.5 text-[10px] font-medium bg-warning/20 text-warning rounded">
                  Beta
                </span>
              </div>
              <button
                onClick={() => updateSettings({ costcoSyncEnabled: !settings.costcoSyncEnabled })}
                className={`w-12 h-7 rounded-full transition-colors relative ${
                  settings.costcoSyncEnabled ? "bg-primary" : "bg-secondary"
                }`}
              >
                <span
                  className={`absolute w-5 h-5 bg-white rounded-full top-1 transition-transform ${
                    settings.costcoSyncEnabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              Import receipts from Costco.com by signing in on their site and sharing a receipt PDF or screenshot.
            </p>
            {settings.costcoSyncEnabled && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => router.push("/import/costco-sync")}
              >
                Sync now
              </Button>
            )}
          </section>
        )}

        {/* Data Management */}
        <section className="bg-card rounded-[16px] p-4 border border-border space-y-3">
          <h3 className="text-sm font-medium">Data Management</h3>
          <p className="text-xs text-muted-foreground">
            {mounted ? items.length : 0} items tracked
          </p>

          <Button variant="secondary" onClick={handleExport}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" x2="12" y1="15" y2="3" />
            </svg>
            Export Data
          </Button>

          <Button
            variant="ghost"
            onClick={() => setWipeConfirm(true)}
            className="text-danger hover:text-danger hover:bg-danger/10"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
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
            </svg>
            Wipe All Data
          </Button>
        </section>

        {/* About */}
        <section className="bg-card rounded-[16px] p-4 border border-border">
          <h3 className="text-sm font-medium mb-2">About Adjustly</h3>
          <p className="text-xs text-muted-foreground mb-3">
            Track purchases. Catch price drops. Claim adjustments.
          </p>
          <p className="text-xs text-muted-foreground">Version 1.0.0 (POC)</p>
        </section>

        {/* Privacy & Disclaimer */}
        <section className="bg-surface-2 rounded-[12px] p-4">
          <h4 className="text-xs font-medium mb-2">Privacy & Disclaimer</h4>
          <p className="text-xs text-muted-foreground mb-2">
            All data is stored locally on your device. We never send your purchase
            information, receipts, or personal data to any server.
          </p>
          <p className="text-xs text-muted-foreground">
            <strong>Disclaimer:</strong> Adjustly is not affiliated with Costco
            Wholesale Corporation or any other retailer. Price adjustment policies
            vary by store and are subject to change.
          </p>
        </section>
      </div>

      {/* Wipe Confirmation */}
      <BottomSheetModal
        open={wipeConfirm}
        onOpenChange={setWipeConfirm}
        title="Wipe All Data"
        description="This will permanently delete all your tracked items, alerts, and settings."
        footer={
          <Button variant="destructive" onClick={handleWipe}>
            Yes, Wipe Everything
          </Button>
        }
      >
        <p className="text-sm text-muted-foreground">
          This action cannot be undone. Consider exporting your data first.
        </p>
      </BottomSheetModal>
    </AppShell>
  )
}
