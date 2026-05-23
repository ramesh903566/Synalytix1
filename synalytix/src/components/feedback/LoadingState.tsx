import * as React from "react"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export function LoadingState({
  label = "Loading page...",
  className,
}: {
  label?: string
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex h-full w-full min-h-[400px] flex-col items-center justify-center gap-3",
        className
      )}
    >
      <div className="relative flex items-center justify-center">
        <div className="h-12 w-12 rounded-full border-4 border-muted opacity-20" />
        <Loader2 className="absolute h-12 w-12 animate-spin text-primary" strokeWidth={3} />
      </div>
      <p className="text-sm font-medium text-muted-foreground animate-pulse">
        {label}
      </p>
    </div>
  )
}
