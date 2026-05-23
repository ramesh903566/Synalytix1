import * as React from "react"
import { cn } from "@/lib/utils"

export interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  description?: string
  actions?: React.ReactNode
  maxWidth?: 'default' | 'wide' | 'full'
  children: React.ReactNode
}

export function PageContainer({ 
  title, 
  description, 
  actions, 
  maxWidth = 'default',
  className,
  children,
  ...props 
}: PageContainerProps) {
  return (
    <div 
      className={cn(
        "mx-auto w-full px-4 py-8 sm:px-6 lg:px-8",
        {
          'max-w-7xl': maxWidth === 'default',
          'max-w-[1600px]': maxWidth === 'wide',
          'max-w-none': maxWidth === 'full',
        },
        className
      )}
      {...props}
    >
      {(title || description || actions) && (
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1 min-w-0">
            {title && (
              <h1 className="text-display-md font-bold tracking-tight text-foreground truncate">
                {title}
              </h1>
            )}
            {description && (
              <p className="mt-1 text-sm text-muted-foreground truncate">
                {description}
              </p>
            )}
          </div>
          {actions && (
            <div className="flex shrink-0 items-center gap-3">
              {actions}
            </div>
          )}
        </div>
      )}
      <div className="w-full">
        {children}
      </div>
    </div>
  )
}
