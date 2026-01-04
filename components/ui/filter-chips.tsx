"use client"

import { cn } from "@/lib/utils"
import type { FilterOption, SortOption } from "@/lib/types"

interface FilterChipsProps {
  filter: FilterOption
  onFilterChange: (filter: FilterOption) => void
  sort: SortOption
  onSortChange: (sort: SortOption) => void
  className?: string
}

const filterOptions: { value: FilterOption; label: string }[] = [
  { value: "all", label: "All" },
  { value: "tracking", label: "Tracking" },
  { value: "ready", label: "Ready" },
  { value: "expiring", label: "Expiring" },
  { value: "expired", label: "Expired" },
]

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "expiring", label: "Expiring soon" },
  { value: "savings", label: "Most savings" },
  { value: "newest", label: "Newest" },
]

function FilterChips({
  filter,
  onFilterChange,
  sort,
  onSortChange,
  className,
}: FilterChipsProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {/* Filter row */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide">
        {filterOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onFilterChange(opt.value)}
            className={cn(
              "flex-shrink-0 px-3 py-1.5 text-sm font-medium rounded-full transition-colors",
              "min-h-[36px]", // tap target
              filter === opt.value
                ? "bg-primary text-primary-foreground"
                : "bg-surface-2 text-foreground hover:bg-muted"
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Sort dropdown */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Sort:</span>
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className={cn(
            "text-sm font-medium bg-transparent text-foreground",
            "border-none outline-none cursor-pointer",
            "focus:ring-0"
          )}
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

export { FilterChips }
