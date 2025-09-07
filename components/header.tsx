"use client"

import { useEffect } from "react"
import Link from "next/link"

interface HeaderProps {
  onSearch?: () => void
  onExtendedStats?: () => void
}

export function Header({ onSearch, onExtendedStats }: HeaderProps) {
  useEffect(() => {
    if (typeof window !== "undefined" && window.lucide) {
      window.lucide.createIcons()
    }
  }, [])

  return (
    <header className="fixed top-4 left-4 right-4 z-50 bg-white/8 backdrop-blur-xl border border-white/15 rounded-3xl shadow-2xl">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex h-14 items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-3 transform hover:scale-105 transition-transform duration-300"
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
              <i
                data-lucide="asterisk"
                className="text-white/90"
                style={{ width: "14px", height: "14px", strokeWidth: "2" }}
              ></i>
            </span>
            <span className="text-base font-medium tracking-tight text-white/95">WinMix</span>
          </Link>

          <nav className="hidden md:flex bg-white/5 backdrop-blur-md rounded-full px-2 py-1 border border-white/10">
            <Link
              href="/"
              className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white/95 rounded-full transition-all duration-300 hover:bg-white/10"
            >
              Mérkőzések
            </Link>
            <Link
              href="/stats"
              className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white/95 rounded-full transition-all duration-300 hover:bg-white/10"
            >
              Statisztikák
            </Link>
            <Link
              href="/results"
              className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white/95 rounded-full transition-all duration-300 hover:bg-white/10"
            >
              Eredmények
            </Link>
          </nav>

          <div className="flex gap-3 items-center">
            {onExtendedStats && (
              <button
                type="button"
                onClick={onExtendedStats}
                className="hidden sm:inline-flex items-center gap-2 text-sm bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-2 text-white/90 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
              >
                <i data-lucide="chart-line" style={{ width: "16px", height: "16px", strokeWidth: "1.5" }}></i>
                Bővített stat.
              </button>
            )}
            {onSearch && (
              <button
                type="button"
                onClick={onSearch}
                className="flex items-center gap-2 text-sm bg-gradient-to-r from-white/15 to-white/8 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-2 text-white/95 hover:from-white/20 hover:to-white/12 hover:border-white/30 transition-all duration-300 transform hover:scale-105"
              >
                <i data-lucide="search" style={{ width: "16px", height: "16px", strokeWidth: "1.5" }}></i>
                <span>Keresés</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
