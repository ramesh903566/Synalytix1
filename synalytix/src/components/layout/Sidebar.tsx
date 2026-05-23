"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  Home, Database, LayoutDashboard, FileText, Lightbulb, 
  Workflow, BellRing, Settings, Key, ChevronsLeft, ChevronsRight,
  User, LifeBuoy
} from "lucide-react"

import { cn } from "@/lib/utils"
import { useSidebar } from "@/hooks/use-sidebar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"
import { Avatar, AvatarFallback } from "../ui/avatar"

export interface SidebarItem {
  label: string
  href: string
  icon: React.ElementType
  badge?: number
}

const MAIN_NAV: SidebarItem[] = [
  { label: "Home", href: "/dashboard", icon: Home },
  { label: "Datasets", href: "/datasets", icon: Database },
  { label: "Dashboards", href: "/dashboards", icon: LayoutDashboard },
  { label: "Reports", href: "/reports", icon: FileText },
  { label: "Insights", href: "/insights", icon: Lightbulb },
]

const AUTOMATE_NAV: SidebarItem[] = [
  { label: "Workflows", href: "/workflows", icon: Workflow },
  { label: "Alerts", href: "/alerts", icon: BellRing },
]

const CONFIG_NAV: SidebarItem[] = [
  { label: "Settings", href: "/settings/account", icon: Settings },
  { label: "API Keys", href: "/settings/api-keys", icon: Key },
]

export function Sidebar() {
  const { collapsed, toggle } = useSidebar()
  const pathname = usePathname()

  const NavItem = ({ item }: { item: SidebarItem }) => {
    const isActive = pathname.startsWith(item.href)
    const Icon = item.icon

    const linkContent = (
      <Link
        href={item.href}
        className={cn(
          "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          isActive 
            ? "bg-secondary text-primary" 
            : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
          collapsed && "justify-center px-0"
        )}
      >
        <Icon className={cn("h-5 w-5 shrink-0", isActive ? "text-primary" : "text-muted-foreground")} />
        {!collapsed && (
          <span className="flex-1 truncate">{item.label}</span>
        )}
        {!collapsed && item.badge !== undefined && item.badge > 0 && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
            {item.badge}
          </span>
        )}
      </Link>
    )

    if (collapsed) {
      return (
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              {linkContent}
            </TooltipTrigger>
            <TooltipContent side="right" className="flex items-center gap-2">
              {item.label}
              {item.badge !== undefined && item.badge > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                  {item.badge}
                </span>
              )}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    }

    return linkContent
  }

  const NavGroup = ({ title, items }: { title: string, items: SidebarItem[] }) => (
    <div className="flex flex-col gap-1 px-2">
      {!collapsed && (
        <h4 className="px-3 pb-1 pt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
          {title}
        </h4>
      )}
      {collapsed && <div className="mt-4 border-t border-border/50 mx-4" />}
      {items.map((item) => (
        <NavItem key={item.href} item={item} />
      ))}
    </div>
  )

  return (
    <aside
      className={cn(
        "flex h-screen flex-col border-r bg-card transition-[width] duration-300 ease-in-out will-change-transform z-20",
        collapsed ? "w-[56px]" : "w-[240px]"
      )}
    >
      {/* Header */}
      <div className={cn("flex h-14 shrink-0 items-center border-b px-4", collapsed ? "justify-center px-0" : "justify-between")}>
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center gap-2 font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm">
            <div className="h-6 w-6 rounded bg-primary flex items-center justify-center">
              <span className="text-primary-foreground text-xs font-bold leading-none">S</span>
            </div>
            <span>Synalytix</span>
          </Link>
        )}
        {collapsed && (
          <div className="h-6 w-6 rounded bg-primary flex items-center justify-center">
            <span className="text-primary-foreground text-xs font-bold leading-none">S</span>
          </div>
        )}
      </div>

      {/* Nav Content */}
      <div className="flex-1 overflow-y-auto py-2 scrollbar-none hover:scrollbar-thin">
        <NavGroup title="Main" items={MAIN_NAV} />
        <NavGroup title="Automate" items={AUTOMATE_NAV} />
        <NavGroup title="Config" items={CONFIG_NAV} />
      </div>

      {/* Footer */}
      <div className="shrink-0 border-t p-2">
        <button
          onClick={toggle}
          className={cn(
            "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            collapsed && "justify-center px-0"
          )}
        >
          {collapsed ? <ChevronsRight className="h-5 w-5 shrink-0" /> : <ChevronsLeft className="h-5 w-5 shrink-0" />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  )
}
