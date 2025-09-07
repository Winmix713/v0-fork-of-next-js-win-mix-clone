"use client"

import { useEffect, useState } from "react"
import { Trophy, Bell, User, ChevronDown } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"

const Header = () => {
  const userStats = useAppStore((state) => state.userStats)
  const [scrolled, setScrolled] = useState(false)
  const [animationComplete, setAnimationComplete] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [scrolled])

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationComplete(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b backdrop-blur-lg",
        scrolled ? "bg-background/70 border-white/10 py-3" : "bg-transparent border-transparent py-5",
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div
          className={cn(
            "flex items-center transition-all duration-500",
            animationComplete ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4",
          )}
        >
          <div className="mr-2 h-8 w-8 overflow-hidden rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 p-0.5">
            <div className="h-full w-full rounded-md bg-background flex items-center justify-center">
              <Trophy className="h-4 w-4 text-blue-400" />
            </div>
          </div>
          <h1 className="text-lg font-semibold tracking-tight text-white">
            Win<span className="text-blue-400">Mix.hu</span>
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div
            className={cn(
              "hidden md:flex items-center gap-3 transition-all duration-500 delay-100",
              animationComplete ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4",
            )}
          >
            <div className="px-3 py-1.5 rounded-md bg-muted/50 hover:bg-muted/80 transition-colors duration-200 flex items-center gap-2">
              <Trophy className="h-4 w-4 text-blue-400" />
              <span className="text-xs font-medium text-white">{userStats.points} Points</span>
            </div>

            <div className="px-3 py-1.5 rounded-md bg-muted/50 hover:bg-muted/80 transition-colors duration-200">
              <span className="text-xs font-medium text-white">{userStats.winRate}% Win Rate</span>
            </div>
          </div>

          <div
            className={cn(
              "flex items-center gap-2 transition-all duration-500 delay-200",
              animationComplete ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4",
            )}
          >
            <button className="relative p-2 rounded-full bg-muted/50 hover:bg-muted/80 transition-colors duration-200">
              <Bell className="h-4 w-4 text-white" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-blue-500"></span>
            </button>

            <button className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted/50 hover:bg-muted/80 transition-colors duration-200">
              <div className="h-5 w-5 rounded-full bg-blue-600 flex items-center justify-center">
                <User className="h-3 w-3 text-white" />
              </div>
              <span className="text-xs font-medium text-white">Profile</span>
              <ChevronDown className="h-3 w-3 text-white opacity-60" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
