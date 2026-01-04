import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { TrackedItem, Alert, AppSettings, ItemStatus } from "./types"

interface AppState {
  // Items
  items: TrackedItem[]
  addItem: (item: Omit<TrackedItem, "id">) => string
  updateItem: (id: string, updates: Partial<TrackedItem>) => void
  deleteItem: (id: string) => void
  getItem: (id: string) => TrackedItem | undefined

  // Alerts
  alerts: Alert[]
  addAlert: (alert: Omit<Alert, "id" | "createdAt">) => void
  markAlertRead: (id: string) => void
  clearAlerts: () => void
  unreadCount: () => number

  // Settings
  settings: AppSettings
  updateSettings: (updates: Partial<AppSettings>) => void

  // Bulk operations
  wipeAllData: () => void
  exportData: () => string
  importData: (json: string) => boolean
}

const defaultSettings: AppSettings = {
  adjustmentWindowDays: 30,
  darkMode: "system",
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Items
      items: [],

      addItem: (item) => {
        const id = generateId()
        const newItem: TrackedItem = { ...item, id }
        set((state) => ({ items: [...state.items, newItem] }))
        return id
      },

      updateItem: (id, updates) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, ...updates } : item
          ),
        }))
      },

      deleteItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }))
      },

      getItem: (id) => {
        return get().items.find((item) => item.id === id)
      },

      // Alerts
      alerts: [],

      addAlert: (alert) => {
        const newAlert: Alert = {
          ...alert,
          id: generateId(),
          createdAt: new Date().toISOString(),
        }
        set((state) => ({ alerts: [newAlert, ...state.alerts] }))
      },

      markAlertRead: (id) => {
        set((state) => ({
          alerts: state.alerts.map((alert) =>
            alert.id === id ? { ...alert, read: true } : alert
          ),
        }))
      },

      clearAlerts: () => {
        set({ alerts: [] })
      },

      unreadCount: () => {
        return get().alerts.filter((a) => !a.read).length
      },

      // Settings
      settings: defaultSettings,

      updateSettings: (updates) => {
        set((state) => ({
          settings: { ...state.settings, ...updates },
        }))
      },

      // Bulk operations
      wipeAllData: () => {
        set({
          items: [],
          alerts: [],
          settings: defaultSettings,
        })
      },

      exportData: () => {
        const { items, alerts, settings } = get()
        return JSON.stringify({ items, alerts, settings }, null, 2)
      },

      importData: (json) => {
        try {
          const data = JSON.parse(json)
          if (data.items && Array.isArray(data.items)) {
            set({
              items: data.items,
              alerts: data.alerts || [],
              settings: { ...defaultSettings, ...data.settings },
            })
            return true
          }
          return false
        } catch {
          return false
        }
      },
    }),
    {
      name: "adjustly-storage",
    }
  )
)

// Helper to compute days left
export function computeDaysLeft(
  purchaseDate: string,
  windowDays: number
): number {
  const purchase = new Date(purchaseDate)
  const deadline = new Date(purchase)
  deadline.setDate(deadline.getDate() + windowDays)
  const now = new Date()
  const diffMs = deadline.getTime() - now.getTime()
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24))
}

// Helper to compute status based on days left
export function computeStatus(
  item: TrackedItem,
  windowDays: number
): ItemStatus {
  const daysLeft = computeDaysLeft(item.purchaseDate, windowDays)

  if (daysLeft <= 0) return "expired"
  if (item.promoPrice || item.verifiedPrice) {
    const priceDrop =
      (item.promoPrice ?? item.verifiedPrice ?? item.unitPrice) < item.unitPrice
    if (priceDrop) return "ready"
    return "possible"
  }
  return "tracking"
}

// Helper to compute potential refund
export function computePotentialRefund(item: TrackedItem): number {
  const newPrice = item.promoPrice ?? item.verifiedPrice ?? item.unitPrice
  const diff = item.unitPrice - newPrice
  if (diff <= 0) return 0
  return diff * item.quantity
}
