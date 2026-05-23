import * as React from "react"
import { AlertCircle } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Skeleton } from "../ui/skeleton"

export interface ChartCardProps {
  title: string
  description?: string
  actions?: React.ReactNode
  loading?: boolean
  error?: Error | null
  empty?: boolean
  height?: number | string
  children: React.ReactNode
  className?: string
}

export function ChartCard({
  title,
  description,
  actions,
  loading = false,
  error = null,
  empty = false,
  height = 350,
  children,
  className,
}: ChartCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex flex-col space-y-1">
          <CardTitle className="text-lg">{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        {actions && <div>{actions}</div>}
      </CardHeader>
      <CardContent>
        <div 
          className="mt-4 flex items-center justify-center w-full"
          style={{ height }}
        >
          {loading ? (
            <div className="flex w-full h-full items-end justify-between gap-2">
              {Array.from({ length: 7 }).map((_, i) => (
                <Skeleton 
                  key={i} 
                  className="w-full bg-muted" 
                  style={{ height: `${Math.max(20, Math.random() * 100)}%` }} 
                />
              ))}
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center text-center p-6 border rounded-lg bg-error/5 text-error w-full h-full">
              <AlertCircle className="h-8 w-8 mb-2 opacity-80" />
              <p className="text-sm font-medium">Failed to load chart data</p>
              <p className="text-xs mt-1 opacity-80">{error.message || "An unexpected error occurred"}</p>
            </div>
          ) : empty ? (
            <div className="flex flex-col items-center justify-center text-center p-6 border border-dashed rounded-lg bg-muted/30 w-full h-full">
              <p className="text-sm font-medium text-muted-foreground">No data available</p>
              <p className="text-xs text-muted-foreground/70 mt-1">There is not enough data to generate this chart.</p>
            </div>
          ) : (
            children
          )}
        </div>
      </CardContent>
    </Card>
  )
}
