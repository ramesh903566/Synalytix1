import * as React from "react"
import { Card, CardContent, CardHeader } from "../ui/card"
import { Skeleton } from "../ui/skeleton"

export function SkeletonCard({ 
  type = 'card' 
}: { 
  type?: 'card' | 'metric' | 'chart' | 'table' | 'list' 
}) {
  if (type === 'metric') {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
          <div className="mt-4 space-y-2">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-4 w-32" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (type === 'chart') {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="space-y-1">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="flex h-[300px] items-end justify-between gap-2">
            {Array.from({ length: 12 }).map((_, i) => (
              <Skeleton 
                key={i} 
                className="w-full" 
                style={{ height: `${Math.random() * 80 + 20}%` }} 
              />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (type === 'table') {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-9 w-24" />
        </div>
        <Card className="overflow-hidden">
          <div className="border-b p-4">
            <div className="flex gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </div>
          </div>
          <div className="space-y-4 p-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex gap-4">
                {Array.from({ length: 4 }).map((_, j) => (
                  <Skeleton key={j} className="h-10 w-full" />
                ))}
              </div>
            ))}
          </div>
        </Card>
      </div>
    )
  }

  if (type === 'list') {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-1 flex-1">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="h-8 w-20 rounded-md" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-1/4" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-32 w-full" />
      </CardContent>
    </Card>
  )
}
