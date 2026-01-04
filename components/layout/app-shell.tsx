"use client"

import { cn } from "@/lib/utils"
import { TopBar } from "./top-bar"
import { BottomNav } from "./bottom-nav"

interface AppShellProps {
  title?: string
  rightAction?: React.ReactNode
  children: React.ReactNode
  hideNav?: boolean
  className?: string
}

function AppShell({
  title,
  rightAction,
  children,
  hideNav = false,
  className,
}: AppShellProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {title && <TopBar title={title} rightAction={rightAction} />}
      <main
        className={cn(
          "flex-1 px-4 py-4",
          !hideNav && "pb-20", // space for bottom nav
          className
        )}
      >
        {children}
      </main>
      {!hideNav && <BottomNav />}
    </div>
  )
}

export { AppShell }
