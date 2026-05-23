"use client"

import * as React from "react"
import { useSidebar } from "@/hooks/use-sidebar"
import { Sidebar } from "./Sidebar"
import { TopNav } from "./TopNav"
import { cn } from "@/lib/utils"

export function Shell({ children }: { children: React.ReactNode }) {
  const { collapsed } = useSidebar()
  const [mounted, setMounted] = React.useState(false)

  // Prevent hydration mismatch on sidebar width by only rendering shell properly after mount
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null // Or a very basic loading skeleton if needed
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar />
      <div 
        className={cn(
          "flex flex-col h-full flex-1 transition-[margin] duration-300 ease-in-out min-w-0"
        )}
      >
        <TopNav />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
