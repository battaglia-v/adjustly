"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { StatusPill } from "@/components/ui/status-pill"
import { DaysLeftMeter } from "@/components/ui/days-left-meter"
import { ItemCard } from "@/components/ui/item-card"
import { FilterChips } from "@/components/ui/filter-chips"
import { EmptyState, ReceiptIcon } from "@/components/ui/empty-state"
import { RefundPassCard } from "@/components/ui/refund-pass-card"
import { BottomSheetModal } from "@/components/ui/bottom-sheet-modal"
import type { TrackedItem, FilterOption, SortOption } from "@/lib/types"

// Sample data
const sampleItem: TrackedItem = {
  id: "1",
  itemNumber: "1234567",
  description: "Kirkland Signature Organic Extra Virgin Olive Oil, 2L",
  unitPrice: 19.99,
  quantity: 2,
  purchaseDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  status: "possible",
  promoPrice: 14.99,
  detectionSource: "promo_match",
  potentialRefund: 10.0,
  daysLeft: 23,
}

const readyItem: TrackedItem = {
  ...sampleItem,
  id: "2",
  status: "ready",
  verifiedPrice: 15.99,
  detectionSource: "verified_shelf",
  potentialRefund: 8.0,
  daysLeft: 5,
  receiptImage: "data:image/png;base64,test",
}

export default function UIKitPage() {
  const [filter, setFilter] = useState<FilterOption>("all")
  const [sort, setSort] = useState<SortOption>("expiring")
  const [sheetOpen, setSheetOpen] = useState(false)

  // Gate by env var
  if (process.env.NEXT_PUBLIC_ENABLE_DEV_PAGES !== "true") {
    return (
      <div className="p-4">
        <p className="text-muted-foreground">Dev pages disabled.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4 space-y-8 pb-24">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">UI Kit</h1>
        <p className="text-sm text-muted-foreground">Adjustly component library</p>
      </header>

      {/* Buttons */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">Button</h2>
        <div className="space-y-3">
          <Button variant="primary">Primary Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="ghost">Ghost Button</Button>
          <Button variant="destructive">Destructive</Button>
          <Button disabled>Disabled</Button>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="primary" className="w-auto">Small</Button>
          <Button size="icon" variant="secondary">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          </Button>
        </div>
      </section>

      {/* Status Pills */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">StatusPill</h2>
        <div className="flex flex-wrap gap-2">
          <StatusPill status="tracking" />
          <StatusPill status="possible" />
          <StatusPill status="ready" />
          <StatusPill status="expired" />
        </div>
      </section>

      {/* Days Left Meter */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">DaysLeftMeter</h2>
        <div className="space-y-4 max-w-xs">
          <DaysLeftMeter daysLeft={25} windowDays={30} />
          <DaysLeftMeter daysLeft={10} windowDays={30} />
          <DaysLeftMeter daysLeft={3} windowDays={30} />
          <DaysLeftMeter daysLeft={1} windowDays={30} />
          <DaysLeftMeter daysLeft={0} windowDays={30} />
        </div>
      </section>

      {/* Filter Chips */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">FilterChips</h2>
        <FilterChips
          filter={filter}
          onFilterChange={setFilter}
          sort={sort}
          onSortChange={setSort}
        />
        <p className="text-xs text-muted-foreground">
          Filter: {filter}, Sort: {sort}
        </p>
      </section>

      {/* Item Card */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">ItemCard</h2>
        <ItemCard item={sampleItem} onClick={() => alert("Item clicked")} />
      </section>

      {/* Empty State */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">EmptyState</h2>
        <div className="bg-card rounded-[16px] border border-border">
          <EmptyState
            icon={<ReceiptIcon />}
            title="No items tracked"
            description="Import a receipt or add items manually to start tracking price drops."
            primaryAction={{ label: "Import receipt", onClick: () => {} }}
            secondaryAction={{ label: "Add manually", onClick: () => {} }}
          />
        </div>
      </section>

      {/* Refund Pass Card */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">RefundPassCard</h2>
        <RefundPassCard
          item={readyItem}
          onCopyDetails={() => alert("Copied!")}
          onShowReceipt={() => alert("Show receipt")}
          onMarkClaimed={() => alert("Marked claimed")}
        />
      </section>

      {/* Bottom Sheet Modal */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">BottomSheetModal</h2>
        <Button variant="secondary" onClick={() => setSheetOpen(true)}>
          Open Bottom Sheet
        </Button>
        <BottomSheetModal
          open={sheetOpen}
          onOpenChange={setSheetOpen}
          title="Quick Verify"
          description="Enter the current shelf price to verify a price drop."
          footer={<Button variant="primary">Confirm</Button>}
        >
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Current shelf price</label>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                className="mt-1 w-full h-12 px-4 rounded-[12px] border border-border bg-background text-foreground text-lg tabular-nums"
              />
            </div>
          </div>
        </BottomSheetModal>
      </section>
    </div>
  )
}
