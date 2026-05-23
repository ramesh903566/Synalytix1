import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const avatarVariants = cva(
  "relative flex shrink-0 overflow-hidden rounded-full",
  {
    variants: {
      size: {
        xs: "h-6 w-6 text-[10px]",
        sm: "h-8 w-8 text-xs",
        md: "h-10 w-10 text-sm",
        lg: "h-12 w-12 text-base",
        xl: "h-16 w-16 text-lg",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
)

export interface AvatarProps
  extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>,
    VariantProps<typeof avatarVariants> {}

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  AvatarProps
>(({ className, size, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(avatarVariants({ size }), className)}
    {...props}
  />
))
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback> & {
    deterministicColorSeed?: string
  }
>(({ className, deterministicColorSeed, ...props }, ref) => {
  
  // Very naive hash function for deterministic colors
  const getColor = (seed: string) => {
    const colors = [
      'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
      'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
      'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
      'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
      'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
      'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
      'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
      'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      'bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900/30 dark:text-fuchsia-400',
      'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
      'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
    ];
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  }

  const bgClass = deterministicColorSeed ? getColor(deterministicColorSeed) : "bg-muted text-muted-foreground";

  return (
    <AvatarPrimitive.Fallback
      ref={ref}
      className={cn(
        "flex h-full w-full items-center justify-center rounded-full font-medium",
        bgClass,
        className
      )}
      {...props}
    />
  )
})
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export { Avatar, AvatarImage, AvatarFallback }
