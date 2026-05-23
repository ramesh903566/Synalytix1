import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

const tabsListVariants = cva(
  "inline-flex items-center justify-center text-muted-foreground",
  {
    variants: {
      variant: {
        underline: "w-full justify-start border-b border-border rounded-none p-0 h-10",
        pills: "rounded-md bg-muted p-1",
        bordered: "rounded-md border border-border p-1 bg-background",
      },
    },
    defaultVariants: {
      variant: "underline",
    },
  }
)

interface TabsListProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>, VariantProps<typeof tabsListVariants> {}

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  TabsListProps
>(({ className, variant, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(tabsListVariants({ variant }), className)}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const tabsTriggerVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        underline: "border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-foreground h-10 rounded-none",
        pills: "rounded-sm data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
        bordered: "rounded-sm data-[state=active]:bg-muted data-[state=active]:text-foreground",
      },
    },
    defaultVariants: {
      variant: "underline",
    },
  }
)

interface TabsTriggerProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>, VariantProps<typeof tabsTriggerVariants> {}

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  TabsTriggerProps
>(({ className, variant, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(tabsTriggerVariants({ variant }), className)}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants, tabsTriggerVariants }
