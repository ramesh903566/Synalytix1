import * as React from "react"
import { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "../ui/button"

export interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
  secondaryAction?: {
    label: string
    onClick: () => void
  }
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  secondaryAction,
  size = 'md',
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        {
          'py-12 px-6': size === 'md',
          'py-6 px-4': size === 'sm',
          'py-24 px-8': size === 'lg',
        },
        className
      )}
    >
      {Icon && (
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted/50 text-muted-foreground/60">
          <Icon className={cn(
            {
              'h-8 w-8': size === 'md' || size === 'sm',
              'h-10 w-10': size === 'lg',
            }
          )} />
        </div>
      )}
      <h3 className={cn(
        "font-bold text-foreground",
        {
          'text-lg': size === 'sm',
          'text-xl': size === 'md',
          'text-2xl': size === 'lg',
        }
      )}>
        {title}
      </h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        {description}
      </p>
      {(action || secondaryAction) && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {secondaryAction && (
            <Button variant="outline" onClick={secondaryAction.onClick}>
              {secondaryAction.label}
            </Button>
          )}
          {action && (
            <Button onClick={action.onClick}>
              {action.label}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
