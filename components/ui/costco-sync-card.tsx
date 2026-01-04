"use client"

import { useRouter } from "next/navigation"

const COSTCO_SYNC_ENABLED = process.env.NEXT_PUBLIC_ENABLE_COSTCO_SYNC_BETA === "true"

export function CostcoSyncCard() {
  const router = useRouter()

  if (!COSTCO_SYNC_ENABLED) return null

  return (
    <button
      onClick={() => router.push("/import/costco-sync")}
      className="w-full bg-card rounded-[16px] p-4 border border-border text-left transition-all active:scale-[0.98]"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-[12px] bg-primary/10 flex items-center justify-center">
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
            className="text-primary"
          >
            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
            <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
            <path d="M16 16h5v5" />
          </svg>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="font-medium">Sync with Costco</p>
            <span className="px-1.5 py-0.5 text-[10px] font-medium bg-warning/20 text-warning rounded">
              Beta
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Open Costco, share a receipt, we&apos;ll track the rest.
          </p>
        </div>
      </div>
    </button>
  )
}
