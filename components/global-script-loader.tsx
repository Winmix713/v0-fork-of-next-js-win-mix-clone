"use client"

import { useEffect } from "react"

export function GlobalScriptLoader() {
  useEffect(() => {
    // Ensure global libraries are available
    const checkLibraries = () => {
      if (typeof window !== "undefined") {
        // Initialize Lucide icons
        if (window.lucide) {
          window.lucide.createIcons()
        }

        // Log Chart.js availability
        if (window.Chart) {
          console.log("[v0] Chart.js loaded successfully")
        }

        // Avoid referencing non-declared globals like window.supabase
      }
    }

    // Check immediately and after a short delay
    checkLibraries()
    const timer = setTimeout(checkLibraries, 1000)

    return () => clearTimeout(timer)
  }, [])

  return null
}
