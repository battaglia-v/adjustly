import type { Promo, TrackedItem } from "./types"
import promosData from "@/data/promos.json"

const promos: Promo[] = promosData as Promo[]

interface PromoMatch {
  promoId: string
  promoName: string
  promoPrice: number
}

export function findPromoMatch(itemNumber: string): PromoMatch | null {
  const now = new Date()

  for (const promo of promos) {
    const start = new Date(promo.start)
    const end = new Date(promo.end)
    end.setHours(23, 59, 59, 999) // Include entire end day

    // Check if promo is currently active
    if (now >= start && now <= end) {
      const match = promo.items.find(
        (item) => item.item_number === itemNumber
      )
      if (match) {
        return {
          promoId: promo.id,
          promoName: promo.name,
          promoPrice: match.promo_unit_price,
        }
      }
    }
  }

  return null
}

export function checkItemForPromo(item: TrackedItem): Partial<TrackedItem> | null {
  // Skip if already has a promo match
  if (item.detectionSource === "promo_match") {
    return null
  }

  const match = findPromoMatch(item.itemNumber)
  if (!match) {
    return null
  }

  // Only update if promo price is lower than paid price
  if (match.promoPrice >= item.unitPrice) {
    return null
  }

  return {
    promoPrice: match.promoPrice,
    detectionSource: "promo_match",
  }
}

export function runPromoMatchForAllItems(
  items: TrackedItem[],
  updateItem: (id: string, updates: Partial<TrackedItem>) => void,
  addAlert: (alert: { itemId: string; type: "price_drop"; message: string; read: boolean }) => void
): number {
  let matchCount = 0

  for (const item of items) {
    const updates = checkItemForPromo(item)
    if (updates) {
      updateItem(item.id, updates)
      addAlert({
        itemId: item.id,
        type: "price_drop",
        message: `Price drop detected for ${item.description}! Now $${updates.promoPrice?.toFixed(2)}`,
        read: false,
      })
      matchCount++
    }
  }

  return matchCount
}
