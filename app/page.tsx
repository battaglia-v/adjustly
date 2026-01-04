"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { AppShell } from "@/components/layout"
import { ItemCard } from "@/components/ui/item-card"
import { FilterChips } from "@/components/ui/filter-chips"
import { EmptyState, ReceiptIcon } from "@/components/ui/empty-state"
import { Button } from "@/components/ui/button"
import { CostcoSyncCard } from "@/components/ui/costco-sync-card"
import { useAppStore, computeDaysLeft, computeStatus, computePotentialRefund } from "@/lib/store"
import { getSampleItems } from "@/lib/sample-data"
import type { FilterOption, SortOption } from "@/lib/types"

export default function TrackedPage() {
  const router = useRouter()
  const { items, settings, addItem } = useAppStore()
  const [filter, setFilter] = useState<FilterOption>("all")
  const [sort, setSort] = useState<SortOption>("expiring")

  // Enrich items with computed fields
  const enrichedItems = useMemo(() => {
    return items.map((item) => {
      const daysLeft = computeDaysLeft(item.purchaseDate, settings.adjustmentWindowDays)
      const status = computeStatus(item, settings.adjustmentWindowDays)
      const potentialRefund = computePotentialRefund(item)
      return { ...item, daysLeft, status, potentialRefund }
    })
  }, [items, settings.adjustmentWindowDays])

  // Filter items
  const filteredItems = useMemo(() => {
    return enrichedItems.filter((item) => {
      switch (filter) {
        case "tracking":
          return item.status === "tracking"
        case "ready":
          return item.status === "ready" || item.status === "possible"
        case "expiring":
          return item.daysLeft !== undefined && item.daysLeft <= 10 && item.daysLeft > 0
        case "expired":
          return item.status === "expired"
        default:
          return true
      }
    })
  }, [enrichedItems, filter])

  // Sort items
  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      switch (sort) {
        case "expiring":
          return (a.daysLeft ?? 999) - (b.daysLeft ?? 999)
        case "savings":
          return (b.potentialRefund ?? 0) - (a.potentialRefund ?? 0)
        case "newest":
          return new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime()
        default:
          return 0
      }
    })
  }, [filteredItems, sort])

  // Summary stats
  const stats = useMemo(() => {
    const ready = enrichedItems.filter((i) => i.status === "ready" || i.status === "possible")
    const totalSavings = ready.reduce((sum, i) => sum + (i.potentialRefund ?? 0), 0)
    return {
      total: enrichedItems.length,
      ready: ready.length,
      totalSavings,
    }
  }, [enrichedItems])

  const loadSampleData = () => {
    const samples = getSampleItems()
    samples.forEach((item) => addItem(item))
  }

  if (items.length === 0) {
    return (
      <AppShell title="Tracked">
        <EmptyState
          icon={<ReceiptIcon />}
          title="No items tracked"
          description="Import a receipt or add items manually to start tracking price drops."
          primaryAction={{
            label: "Import receipt",
            onClick: () => router.push("/import"),
          }}
          secondaryAction={{
            label: "Add manually",
            onClick: () => router.push("/import?manual=true"),
          }}
        />

        {/* Costco Sync CTA */}
        <div className="mt-4 px-6">
          <CostcoSyncCard />
        </div>

        <div className="mt-8 pt-6 border-t border-border">
          <p className="text-xs text-muted-foreground text-center mb-3">
            Testing the app?
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={loadSampleData}
            className="w-full text-primary"
          >
            Load sample data
          </Button>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell title="Tracked">
      {/* Summary */}
      {stats.totalSavings > 0 && (
        <div className="bg-success/10 rounded-[16px] p-4 mb-4">
          <p className="text-xs text-success font-medium mb-1">Potential savings</p>
          <p className="text-2xl font-bold text-success tabular-nums">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(stats.totalSavings)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {stats.ready} item{stats.ready !== 1 ? "s" : ""} ready to claim
          </p>
        </div>
      )}

      {/* Filters */}
      <FilterChips
        filter={filter}
        onFilterChange={setFilter}
        sort={sort}
        onSortChange={setSort}
        className="mb-4"
      />

      {/* Items list */}
      <div className="space-y-3">
        {sortedItems.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            windowDays={settings.adjustmentWindowDays}
            onClick={() => router.push(`/item/${item.id}`)}
          />
        ))}
      </div>

      {sortedItems.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No items match this filter</p>
        </div>
      )}
    </AppShell>
  )
}
