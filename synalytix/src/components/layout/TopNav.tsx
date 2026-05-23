"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, Bell, User as UserIcon, Monitor, Moon, Sun, Keyboard, LogOut } from "lucide-react"

import { Button } from "../ui/button"
import { Avatar, AvatarFallback } from "../ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { useTheme } from "@/hooks/use-theme"

export function TopNav() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  // Derive simple breadcrumbs from pathname for the prototype
  const paths = pathname.split('/').filter(Boolean)
  const breadcrumb = paths.length > 0 
    ? paths[0].charAt(0).toUpperCase() + paths[0].slice(1)
    : "Dashboard"

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b bg-card px-6 lg:px-8 z-10 w-full">
      {/* Left: Breadcrumb */}
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <span className="text-foreground">{breadcrumb}</span>
        {paths.length > 1 && (
          <>
            <span>/</span>
            <span>{paths[1]}</span>
          </>
        )}
      </div>

      {/* Center: Search (Visual Only for Layout) */}
      <div className="hidden md:flex flex-1 max-w-md mx-8">
        <Button 
          variant="outline" 
          className="w-full justify-start text-muted-foreground bg-muted/30 border-muted-foreground/20 shadow-none hover:bg-muted"
        >
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <span className="text-xs">Search everywhere...</span>
          <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-error ring-2 ring-background" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar size="sm">
                <AvatarFallback deterministicColorSeed="demo@user.com">DU</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Demo User</p>
                <p className="text-xs leading-none text-muted-foreground">
                  demo@synalytix.io
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href="/settings/account" className="cursor-pointer flex items-center w-full">
                  <UserIcon className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                  <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Keyboard className="mr-2 h-4 w-4" />
                <span>Keyboard shortcuts</span>
                <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => setTheme('light')} className="cursor-pointer">
                <Sun className="mr-2 h-4 w-4" />
                <span>Light Theme</span>
                {theme === 'light' && <DropdownMenuShortcut className="text-primary font-bold">✓</DropdownMenuShortcut>}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('dark')} className="cursor-pointer">
                <Moon className="mr-2 h-4 w-4" />
                <span>Dark Theme</span>
                {theme === 'dark' && <DropdownMenuShortcut className="text-primary font-bold">✓</DropdownMenuShortcut>}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('system')} className="cursor-pointer">
                <Monitor className="mr-2 h-4 w-4" />
                <span>System</span>
                {theme === 'system' && <DropdownMenuShortcut className="text-primary font-bold">✓</DropdownMenuShortcut>}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-destructive focus:bg-destructive focus:text-destructive-foreground">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
              <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
