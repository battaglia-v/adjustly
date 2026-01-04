"use client"

import { useRouter } from "next/navigation"
import { AppShell } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/lib/store"

export default function AlertsPage() {
  const router = useRouter()
  const { alerts, markAlertRead, clearAlerts } = useAppStore()

  const handleAlertClick = (alert: typeof alerts[0]) => {
    markAlertRead(alert.id)
    router.push(`/item/${alert.itemId}`)
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "price_drop":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-success"
          >
            <path d="m3 16 4 4 4-4" />
            <path d="M7 20V4" />
            <path d="M11 4h10" />
            <path d="M11 8h7" />
            <path d="M11 12h4" />
          </svg>
        )
      case "expiring_soon":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-warning"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        )
      case "ready_to_claim":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-primary"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        )
      default:
        return null
    }
  }

  if (alerts.length === 0) {
    return (
      <AppShell title="Alerts">
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-muted-foreground"
            >
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-1">No alerts yet</h3>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto">
            When we detect price drops or items about to expire, you&apos;ll see them here.
          </p>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell
      title="Alerts"
      rightAction={
        <button
          onClick={clearAlerts}
          className="text-sm text-primary font-medium"
        >
          Clear all
        </button>
      }
    >
      <div className="space-y-2">
        {alerts.map((alert) => (
          <button
            key={alert.id}
            onClick={() => handleAlertClick(alert)}
            className={`w-full text-left bg-card rounded-[12px] p-4 border transition-all active:scale-[0.98] ${
              alert.read ? "border-border opacity-60" : "border-primary/30 bg-primary/5"
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5">{getAlertIcon(alert.type)}</div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm ${alert.read ? "" : "font-medium"}`}>
                  {alert.message}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(alert.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              {!alert.read && (
                <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />
              )}
            </div>
          </button>
        ))}
      </div>
    </AppShell>
  )
}
