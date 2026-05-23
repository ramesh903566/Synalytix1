"use client"

import { useEffect, useState } from "react"

type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl" | "2xl"

// Values match tailwind default theme
const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
}

export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>("md") // Default to md for SSR

  useEffect(() => {
    const calcBreakpoint = (): Breakpoint => {
      const w = window.innerWidth
      if (w < breakpoints.sm) return "xs"
      if (w < breakpoints.md) return "sm"
      if (w < breakpoints.lg) return "md"
      if (w < breakpoints.xl) return "lg"
      if (w < breakpoints["2xl"]) return "xl"
      return "2xl"
    }

    setBreakpoint(calcBreakpoint())

    const onResize = () => {
      setBreakpoint(calcBreakpoint())
    }

    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  return breakpoint
}
