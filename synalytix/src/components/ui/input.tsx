import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
  hint?: string
  prefixIcon?: React.ReactNode
  suffixIcon?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, hint, prefixIcon, suffixIcon, ...props }, ref) => {
    return (
      <div className="w-full">
        <div className="relative flex items-center">
          {prefixIcon && (
            <div className="absolute left-3 text-muted-foreground">
              {prefixIcon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
              prefixIcon && "pl-9",
              suffixIcon && "pr-9",
              error && "border-destructive focus-visible:ring-destructive",
              className
            )}
            ref={ref}
            {...props}
          />
          {suffixIcon && (
            <div className="absolute right-3 text-muted-foreground">
              {suffixIcon}
            </div>
          )}
        </div>
        {(hint || error) && (
          <p
            className={cn(
              "mt-1.5 text-xs",
              error ? "text-destructive" : "text-muted-foreground"
            )}
          >
            {hint}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
