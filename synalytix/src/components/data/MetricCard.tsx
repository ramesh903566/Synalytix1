import * as React from "react"
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react"

import { Card, CardContent } from "../ui/card"
import { Skeleton } from "../ui/skeleton"
import { cn, formatNumber } from "@/lib/utils"

export interface MetricCardProps {
  title: string
  value: number | string
  previousValue?: number
  unit?: string
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string | number
  loading?: boolean
  icon?: React.ReactNode
  description?: string
  className?: string
}

export function MetricCard({
  title,
  value,
  previousValue,
  unit = '',
  trend,
  trendValue,
  loading = false,
  icon,
  description,
  className,
}: MetricCardProps) {
  
  const displayValue = typeof value === 'number' ? formatNumber(value) : value

  // Auto-calculate trend if previous value is provided and trend isn't explicitly set
  let calculatedTrend = trend
  let calcTrendValue = trendValue
  
  if (typeof value === 'number' && typeof previousValue === 'number' && !trend && !trendValue) {
    if (value > previousValue) {
      calculatedTrend = 'up'
      calcTrendValue = `${((value - previousValue) / previousValue * 100).toFixed(1)}%`
    } else if (value < previousValue) {
      calculatedTrend = 'down'
      calcTrendValue = `${((previousValue - value) / previousValue * 100).toFixed(1)}%`
    } else {
      calculatedTrend = 'neutral'
      calcTrendValue = '0%'
    }
  }

  const TrendIcon = 
    calculatedTrend === 'up' ? ArrowUpRight :
    calculatedTrend === 'down' ? ArrowDownRight :
    Minus

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          {icon && (
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted text-muted-foreground">
              {icon}
            </div>
          )}
        </div>
        
        <div className="mt-4 flex flex-col gap-2">
          {loading ? (
            <>
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-4 w-32" />
            </>
          ) : (
            <>
              <div className="flex items-baseline gap-1">
                <span className="text-display-md font-bold text-foreground tracking-tight">
                  {displayValue}
                </span>
                {unit && (
                  <span className="text-lg font-medium text-muted-foreground">
                    {unit}
                  </span>
                )}
              </div>
              
              {(calculatedTrend || description) && (
                <div className="flex items-center gap-2">
                  {calculatedTrend && calcTrendValue && (
                    <div className={cn(
                      "flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold",
                      calculatedTrend === 'up' ? "bg-success/10 text-success" :
                      calculatedTrend === 'down' ? "bg-error/10 text-error" :
                      "bg-muted text-muted-foreground"
                    )}>
                      <TrendIcon className="h-3 w-3" />
                      <span>{calcTrendValue}</span>
                    </div>
                  )}
                  {description && (
                    <span className="text-xs text-muted-foreground">
                      {description}
                    </span>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
