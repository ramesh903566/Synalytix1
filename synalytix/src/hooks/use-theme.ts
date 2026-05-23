"use client"

import * as React from "react"
import { useTheme as useNextTheme } from "next-themes"

export function useTheme() {
  const context = useNextTheme()
  
  if (context === undefined) {
    // Return a safe default to avoid errors when next-themes provider is missing during dev/tests
    return {
      theme: 'system',
      setTheme: () => {},
      isDark: false,
      toggleTheme: () => {},
    }
  }

  const { theme, setTheme, systemTheme } = context
  
  const isDark = theme === "dark" || (theme === "system" && systemTheme === "dark")
  
  const toggleTheme = React.useCallback(() => {
    setTheme(isDark ? "light" : "dark")
  }, [isDark, setTheme])

  return {
    ...context,
    isDark,
    toggleTheme,
  }
}
