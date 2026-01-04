export type ItemStatus = "tracking" | "possible" | "ready" | "expired"

export interface TrackedItem {
  id: string
  itemNumber: string
  description: string
  unitPrice: number  // price paid per unit
  quantity: number
  purchaseDate: string // ISO date
  warehouse?: string
  receiptImage?: string // base64 or blob URL
  status: ItemStatus
  // Detection results
  promoPrice?: number // from promo match
  verifiedPrice?: number // user-entered shelf price
  detectionSource?: "promo_match" | "verified_shelf" | null
  // Computed
  potentialRefund?: number
  daysLeft?: number
}

export interface Promo {
  id: string
  name: string
  start: string // ISO date
  end: string // ISO date
  items: PromoItem[]
}

export interface PromoItem {
  item_number: string
  promo_unit_price: number
}

export interface Alert {
  id: string
  itemId: string
  type: "price_drop" | "expiring_soon" | "ready_to_claim"
  message: string
  createdAt: string // ISO date
  read: boolean
}

export interface AppSettings {
  adjustmentWindowDays: number
  darkMode: "system" | "light" | "dark"
  costcoSyncEnabled: boolean
}

// Filter/sort options for Tracked page
export type FilterOption = "all" | "tracking" | "ready" | "expiring" | "expired"
export type SortOption = "expiring" | "savings" | "newest"
