"use client"

import { cn } from "@/lib/utils"

interface TopBarProps {
  title?: string
  rightAction?: React.ReactNode
  className?: string
}

function TopBar({ title, rightAction, className }: TopBarProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 bg-background/80 backdrop-blur-lg",
        "h-14 px-4 flex items-center justify-between",
        "border-b border-border",
        className
      )}
    >
      {title ? (
        <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
      ) : (
        <div />
      )}
      {rightAction && <div className="flex items-center">{rightAction}</div>}
    </header>
  )
}

export { TopBar }
