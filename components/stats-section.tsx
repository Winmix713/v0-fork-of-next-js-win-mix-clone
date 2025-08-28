"use client"

import { useEffect } from "react"

interface StatsSectionProps {
  stats: {
    total: number
    home: number
    draw: number
    away: number
    bttsYes: number
    bttsNo: number
    comebacks: number
  }
  matches: any[]
  onExtendedStats: () => void
}

declare global {
  interface Window {
    lucide: any
  }
}

export function StatsSection({ stats, matches, onExtendedStats }: StatsSectionProps) {
  useEffect(() => {
    if (typeof window !== "undefined" && window.lucide) {
      window.lucide.createIcons()
    }
  }, [])

  const getPercentage = (value: number, total: number) => {
    return total > 0 ? Math.round((value / total) * 100) : 0
  }

  return (
    <section id="stats" className="mt-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">Statisztikák</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={onExtendedStats}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-zinc-200 border border-white/10 rounded-full px-3 py-1.5 hover:bg-white/5 transition-colors duration-200"
          >
            <i data-lucide="chart-line" style={{ width: "16px", height: "16px", strokeWidth: "1.5" }}></i>
            Bővített statisztika
          </button>
          <div className="hidden sm:flex items-center gap-2 text-xs text-zinc-400">
            <i data-lucide="info" style={{ width: "16px", height: "16px", strokeWidth: "1.5" }}></i>
            <span>Szűrt eredmények alapján</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 stats-grid">
        <div className="rounded-2xl ring-1 ring-white/10 bg-white/5 px-4 py-4 stats-card">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400">Összes mérkőzés</span>
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-white/5 ring-1 ring-white/10">
              <i
                data-lucide="list"
                className="text-zinc-200"
                style={{ width: "16px", height: "16px", strokeWidth: "1.5" }}
              ></i>
            </span>
          </div>
          <p id="statTotal" className="mt-2 text-2xl font-semibold tracking-tight">
            {stats.total}
          </p>
        </div>
        <div className="rounded-2xl ring-1 ring-white/10 bg-white/5 px-4 py-4 stats-card">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400">Hazai győzelem</span>
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500/15 to-emerald-400/10 ring-1 ring-emerald-400/30">
              <i
                data-lucide="circle-dot"
                className="text-emerald-300"
                style={{ width: "16px", height: "16px", strokeWidth: "1.5" }}
              ></i>
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <p id="statHome" className="text-2xl font-semibold tracking-tight">
              {stats.home}
            </p>
            <span className="text-xs text-emerald-400">({getPercentage(stats.home, stats.total)}%)</span>
          </div>
        </div>
        <div className="rounded-2xl ring-1 ring-white/10 bg-white/5 px-4 py-4 stats-card">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400">Döntetlen</span>
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500/15 to-amber-400/10 ring-1 ring-amber-400/30">
              <i
                data-lucide="minus"
                className="text-amber-300"
                style={{ width: "16px", height: "16px", strokeWidth: "1.5" }}
              ></i>
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <p id="statDraw" className="text-2xl font-semibold tracking-tight">
              {stats.draw}
            </p>
            <span className="text-xs text-amber-400">({getPercentage(stats.draw, stats.total)}%)</span>
          </div>
        </div>
        <div className="rounded-2xl ring-1 ring-white/10 bg-white/5 px-4 py-4 stats-card">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400">Vendég győzelem</span>
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500/15 to-sky-400/10 ring-1 ring-sky-400/30">
              <i
                data-lucide="circle"
                className="text-sky-300"
                style={{ width: "16px", height: "16px", strokeWidth: "1.5" }}
              ></i>
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <p id="statAway" className="text-2xl font-semibold tracking-tight">
              {stats.away}
            </p>
            <span className="text-xs text-sky-400">({getPercentage(stats.away, stats.total)}%)</span>
          </div>
        </div>
      </div>

      <div className="mt-6 ring-1 ring-white/10 bg-white/5 rounded-2xl p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold tracking-tight text-white">Részletes statisztika</h3>
          <div className="text-xs text-zinc-400 flex items-center gap-2">
            <i data-lucide="chart-no-axes-column" style={{ width: "16px", height: "16px", strokeWidth: "1.5" }}></i>
            <span>Megoszlások</span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Results breakdown */}
          <div className="rounded-xl ring-1 ring-white/10 bg-white/5 p-4">
            <p className="text-sm text-zinc-300 mb-4 flex items-center gap-2">
              <i data-lucide="bar-chart-3" style={{ width: "14px", height: "14px", strokeWidth: "1.5" }}></i>
              Eredmény megoszlás (H/D/V)
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                  <span className="text-sm text-zinc-300">Hazai</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{stats.home}</span>
                  <span className="text-xs text-emerald-400">({getPercentage(stats.home, stats.total)}%)</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <span className="text-sm text-zinc-300">Döntetlen</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{stats.draw}</span>
                  <span className="text-xs text-amber-400">({getPercentage(stats.draw, stats.total)}%)</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-sky-400"></div>
                  <span className="text-sm text-zinc-300">Vendég</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{stats.away}</span>
                  <span className="text-xs text-sky-400">({getPercentage(stats.away, stats.total)}%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* BTTS breakdown */}
          <div className="rounded-xl ring-1 ring-white/10 bg-white/5 p-4">
            <p className="text-sm text-zinc-300 mb-4 flex items-center gap-2">
              <i data-lucide="target" style={{ width: "14px", height: "14px", strokeWidth: "1.5" }}></i>
              BTTS & Comeback statisztika
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-400"></div>
                  <span className="text-sm text-zinc-300">BTTS Igen</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{stats.bttsYes}</span>
                  <span className="text-xs text-purple-400">({getPercentage(stats.bttsYes, stats.total)}%)</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-zinc-400"></div>
                  <span className="text-sm text-zinc-300">BTTS Nem</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{stats.bttsNo}</span>
                  <span className="text-xs text-zinc-400">({getPercentage(stats.bttsNo, stats.total)}%)</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-400"></div>
                  <span className="text-sm text-zinc-300">Comeback</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{stats.comebacks}</span>
                  <span className="text-xs text-orange-400">({getPercentage(stats.comebacks, stats.total)}%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
