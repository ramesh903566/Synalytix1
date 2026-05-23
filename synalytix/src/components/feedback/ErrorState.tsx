import * as React from "react"
import { AlertTriangle, RefreshCcw } from "lucide-react"

import { Button } from "../ui/button"
import { cn } from "@/lib/utils"

export interface ErrorStateProps {
  title?: string
  description?: string
  retry?: () => void
  code?: string | number
  className?: string
}

export function ErrorState({
  title = "Something went wrong",
  description = "An unexpected error occurred while fetching data. Please try again.",
  retry,
  code,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border border-error/20 bg-error/5 p-8 text-center",
        className
      )}
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-error/10 text-error">
        <AlertTriangle className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-bold text-foreground">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground max-w-md">
        {description}
      </p>
      {code && (
        <code className="mt-3 rounded bg-muted px-2 py-1 text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
          Error Code: {code}
        </code>
      )}
      {retry && (
        <Button
          variant="outline"
          size="sm"
          onClick={retry}
          className="mt-6 gap-2 border-error/30 hover:bg-error/10 hover:text-error"
        >
          <RefreshCcw className="h-3.5 w-3.5" />
          Try Again
        </Button>
      )}
    </div>
  )
}
