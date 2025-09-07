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
      <div className="container-lg max-w-7xl mx-auto px-6">
        <div className="flex h-14 items-center justify-between">
          <Link
            href="/"
            className="logo-with-name header-logo flex items-center gap-3 transform hover:scale-105 transition-transform duration-300"
          >
            <img src="/abstract-team-logo.png" alt="Logo" className="logo-with-name-logo h-8 w-8 rounded-2xl" />
            <div className="logo-with-name-name text-base font-medium tracking-tight text-white/95">WinMix</div>
          </Link>

          <ul className="header-nav hidden md:flex bg-white/5 backdrop-blur-md rounded-full px-2 py-1 border border-white/10">
            <li>
              <Link
                href="/"
                aria-label="Mérkőzések"
                className="header-nav-link px-4 py-2 text-sm font-medium text-white/70 hover:text-white/95 rounded-full transition-all duration-300 hover:bg-white/10"
              >
                Mérkőzések
              </Link>
            </li>
            <li>
              <Link
                href="/stats"
                aria-label="Statisztikák"
                className="header-nav-link px-4 py-2 text-sm font-medium text-white/70 hover:text-white/95 rounded-full transition-all duration-300 hover:bg-white/10"
              >
                Statisztikák
              </Link>
            </li>
            <li>
              <Link
                href="/results"
                aria-label="Eredmények"
                className="header-nav-link px-4 py-2 text-sm font-medium text-white/70 hover:text-white/95 rounded-full transition-all duration-300 hover:bg-white/10"
              >
                Eredmények
              </Link>
            </li>
          </ul>

          <div className="header-actions flex gap-3 items-center">
            {onExtendedStats && (
              <button
                type="button"
                onClick={onExtendedStats}
                className="header-actions-login hidden sm:inline-flex items-center gap-2 text-sm bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-2 text-white/90 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
              >
                <i data-lucide="chart-line" style={{ width: "16px", height: "16px", strokeWidth: "1.5" }}></i>
                Bővített stat.
              </button>
            )}
            {onSearch && (
              <button
                type="button"
                onClick={onSearch}
                className="button button-primary header-actions-trial flex items-center gap-2 text-sm bg-gradient-to-r from-white/15 to-white/8 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-2 text-white/95 hover:from-white/20 hover:to-white/12 hover:border-white/30 transition-all duration-300 transform hover:scale-105"
              >
                <i data-lucide="search" style={{ width: "16px", height: "16px", strokeWidth: "1.5" }}></i>
                <span>Keresés</span>
                <div className="button-border"></div>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
