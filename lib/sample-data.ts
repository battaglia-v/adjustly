import type { TrackedItem } from "./types"

// Sample items for POC testing
export function getSampleItems(): Omit<TrackedItem, "id">[] {
  const today = new Date()

  // Item purchased 5 days ago - will match promo
  const fiveDaysAgo = new Date(today)
  fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5)

  // Item purchased 20 days ago - expiring soon
  const twentyDaysAgo = new Date(today)
  twentyDaysAgo.setDate(twentyDaysAgo.getDate() - 20)

  // Item purchased 3 days ago - fresh tracking
  const threeDaysAgo = new Date(today)
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)

  return [
    {
      itemNumber: "1234567",
      description: "Kirkland Signature Organic Extra Virgin Olive Oil, 2L",
      unitPrice: 19.99,
      quantity: 2,
      purchaseDate: fiveDaysAgo.toISOString().split("T")[0],
      warehouse: "San Francisco #123",
      status: "tracking",
      // This will get matched by promo (promo price is $14.99)
    },
    {
      itemNumber: "9876543",
      description: "Charmin Ultra Soft Toilet Paper, 30 Mega Rolls",
      unitPrice: 32.99,
      quantity: 1,
      purchaseDate: twentyDaysAgo.toISOString().split("T")[0],
      warehouse: "San Francisco #123",
      status: "tracking",
      // No promo match, will show as expiring soon
    },
    {
      itemNumber: "5555555",
      description: "Tide Pods Laundry Detergent, 112 ct",
      unitPrice: 28.99,
      quantity: 1,
      purchaseDate: threeDaysAgo.toISOString().split("T")[0],
      warehouse: "Daly City #456",
      status: "tracking",
      verifiedPrice: 23.99,
      detectionSource: "verified_shelf",
      // Already has a verified price drop
    },
  ]
}
