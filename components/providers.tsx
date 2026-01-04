"use client"

import { useEffect } from "react"
import { useAppStore } from "@/lib/store"
import { runPromoMatchForAllItems } from "@/lib/promo-matcher"

export function Providers({ children }: { children: React.ReactNode }) {
  const { settings, items, updateItem, addAlert } = useAppStore()

  // Apply dark mode on mount and when settings change
  useEffect(() => {
    const root = document.documentElement

    if (settings.darkMode === "dark") {
      root.classList.add("dark")
    } else if (settings.darkMode === "light") {
      root.classList.remove("dark")
    } else {
      // System preference
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
      if (mediaQuery.matches) {
        root.classList.add("dark")
      } else {
        root.classList.remove("dark")
      }

      // Listen for system changes
      const handler = (e: MediaQueryListEvent) => {
        if (e.matches) {
          root.classList.add("dark")
        } else {
          root.classList.remove("dark")
        }
      }
      mediaQuery.addEventListener("change", handler)
      return () => mediaQuery.removeEventListener("change", handler)
    }
  }, [settings.darkMode])

  // Run promo matching on app load
  useEffect(() => {
    if (items.length > 0) {
      runPromoMatchForAllItems(items, updateItem, addAlert)
    }
  }, []) // Only on mount

  return <>{children}</>
}
