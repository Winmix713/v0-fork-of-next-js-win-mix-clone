"use client"

import { useEffect, useMemo, useState, useCallback } from "react"
import { SplineBackground } from "@/components/spline-background"
import { LoadingOverlay } from "@/components/loading-overlay"
import { ToastContainer, useToast } from "@/components/toast-container"
import { Header } from "@/components/header"
import { FilterSection } from "@/components/filter-section"
import { StatsSection } from "@/components/stats-section"
import { ResultsSection } from "@/components/results-section"
import { Footer } from "@/components/footer"
import { ExtendedStatsModal } from "@/components/extended-stats-modal"
import { KeyboardShortcuts } from "@/components/keyboard-shortcuts"
import { GlobalScriptLoader } from "@/components/global-script-loader"
import { useWinMixStore } from "@/stores/winmix-store"
import { useDebounce } from "@/hooks/use-debounce"
import { BTTSHighlight } from "@/components/btts-highlight"

interface Match {
  id: number
  home: string
  away: string
  ht: string
  ft: string
  btts: string
  comeback: string
  result: string
  date?: string
  match_time: string
  league: string
  season: string
}

interface Stats {
  total: number
  home: number
  draw: number
  away: number
  bttsYes: number
  bttsNo: number
  comebacks: number
  bttsConfidenceInterval?: {
    lower: number
    upper: number
  }
  bttsTrend?: "up" | "down" | "stable"
  bttsReliability?: "high" | "medium" | "low"
}

interface SortConfig {
  key: string
  direction: "asc" | "desc" | ""
}

function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue)

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key)
      if (item) {
        setStoredValue(JSON.parse(item))
      }
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
    }
  }, [key])

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value
        setStoredValue(valueToStore)
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error)
      }
    },
    [key, storedValue],
  )

  return [storedValue, setValue] as const
}

export default function HomePage() {
  const { matches, filters, loading, error, fetchMatches, setFilters } = useWinMixStore()
  const { showSuccess, showError, showInfo } = useToast()

  const [teams, setTeams] = useState<string[]>([])
  const [showExtendedModal, setShowExtendedModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useLocalStorage("winmix_items_per_page", 50)
  const [sortConfig, setSortConfig] = useLocalStorage<SortConfig>("winmix_sort_config", { key: "", direction: "" })

  const debouncedSearchTerm = useDebounce(filters.searchTerm, 300)

  useEffect(() => {
    fetchMatches()
  }, [fetchMatches])

  useEffect(() => {
    if (error) {
      showError("Hiba történt az adatok betöltése közben", error)
    }
  }, [error, showError])

  useEffect(() => {
    if (typeof window !== "undefined" && window.lucide) {
      window.lucide.createIcons()
    }
  }, [])

  useEffect(() => {
    const uniqueTeams = new Set<string>()
    matches.forEach((match) => {
      uniqueTeams.add(match.home)
      uniqueTeams.add(match.away)
    })
    setTeams(Array.from(uniqueTeams).sort())
  }, [matches])

  const sortMatches = useCallback((matchesToSort: Match[], config: SortConfig): Match[] => {
    if (!config.key || !config.direction) return matchesToSort
    return [...matchesToSort].sort((a, b) => {
      let result = 0
      switch (config.key) {
        case "home":
        case "away":
          result = a[config.key as keyof Match].toString().localeCompare(b[config.key as keyof Match].toString(), "hu")
          break
        case "ht":
        case "ft":
          const [aHome, aAway] = a[config.key].split("-").map(Number)
          const [bHome, bAway] = b[config.key].split("-").map(Number)
          result = aHome + aAway - (bHome + bAway)
          if (result === 0) result = aHome - bHome
          break
        case "btts":
        case "comeback":
          result = (a[config.key] === "yes" ? 1 : 0) - (b[config.key] === "yes" ? 1 : 0)
          break
        case "result":
          const resultOrder = { H: 0, D: 1, A: 2 }
          result = (resultOrder[a.result as keyof typeof resultOrder] || 3) - (resultOrder[b.result as keyof typeof resultOrder] || 3)
          break
      }
      return config.direction === "asc" ? result : -result
    })
  }, [])

  const filteredMatches = useMemo(() => {
    let filtered = [...matches]
    if (debouncedSearchTerm.trim()) {
      const searchLower = debouncedSearchTerm.toLowerCase().trim()
      filtered = filtered.filter(
        (m) =>
          m.home.toLowerCase().includes(searchLower) ||
          m.away.toLowerCase().includes(searchLower) ||
          m.league.toLowerCase().includes(searchLower) ||
          m.season.toLowerCase().includes(searchLower),
      )
    }
    // Note: Other filters like homeTeam, awayTeam, btts, comeback will be applied here in the future
    return sortMatches(filtered, sortConfig)
  }, [matches, debouncedSearchTerm, sortConfig, sortMatches])

  const stats: Stats = useMemo(() => {
    const matchData = filteredMatches
    const total = matchData.length
    if (total === 0)
      return { total: 0, home: 0, draw: 0, away: 0, bttsYes: 0, bttsNo: 0, comebacks: 0 }

    const home = matchData.filter((m) => m.result === "H").length
    const draw = matchData.filter((m) => m.result === "D").length
    const away = matchData.filter((m) => m.result === "A").length
    const bttsYes = matchData.filter((m) => m.btts === "yes").length
    const bttsNo = total - bttsYes
    const comebacks = matchData.filter((m) => m.comeback === "yes").length
    const bttsPercentage = total > 0 ? (bttsYes / total) * 100 : 0

    const confidenceInterval =
      total >= 10
        ? {
            lower: Math.max(0, bttsPercentage - 1.96 * Math.sqrt((bttsPercentage * (100 - bttsPercentage)) / total)),
            upper: Math.min(100, bttsPercentage + 1.96 * Math.sqrt((bttsPercentage * (100 - bttsPercentage)) / total)),
          }
        : undefined

    let trend: "up" | "down" | "stable" = "stable"
    if (matchData.length >= 20) {
      const sortedMatches = [...matchData].sort((a, b) => new Date(b.match_time).getTime() - new Date(a.match_time).getTime())
      const recentMatches = sortedMatches.slice(0, Math.floor(sortedMatches.length / 2))
      const olderMatches = sortedMatches.slice(Math.floor(sortedMatches.length / 2))
      const recentBttsRate = recentMatches.filter((m) => m.btts === "yes").length / recentMatches.length
      const olderBttsRate = olderMatches.filter((m) => m.btts === "yes").length / olderMatches.length
      if (Math.abs(recentBttsRate - olderBttsRate) > 0.1) {
        trend = recentBttsRate > olderBttsRate ? "up" : "down"
      }
    }

    let reliability: "high" | "medium" | "low" = "low"
    if (total >= 50) reliability = "high"
    else if (total >= 20) reliability = "medium"

    return { total, home, draw, away, bttsYes, bttsNo, comebacks, bttsConfidenceInterval: confidenceInterval, bttsTrend: trend, bttsReliability: reliability }
  }, [filteredMatches])

  const exportToCSV = () => {
    if (filteredMatches.length === 0) {
      showError("Nincs exportálható adat")
      return
    }
    const headers = ["Hazai csapat", "Vendég csapat", "Félidő", "Végeredmény", "Eredmény", "BTTS", "Fordítás", "Dátum", "Liga", "Szezon"]
    const csvContent = [
      headers.join(","),
      ...filteredMatches.map((match) =>
        [match.home, match.away, match.ht, match.ft, match.result, match.btts, match.comeback, match.date, match.league, match.season]
          .map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`)
          .join(","),
      ),
    ].join("\n")
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `winmix-export-${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(link.href)
    showSuccess("CSV export sikeres")
  }

  const handleReset = () => {
    setFilters({ searchTerm: "" })
    setSortConfig({ key: "", direction: "" })
    setCurrentPage(1)
    showInfo("Szűrők visszaállítva")
  }

  return (
    <div className="min-h-screen">
      <GlobalScriptLoader />
      <SplineBackground />
      <LoadingOverlay isVisible={loading} />
      <ToastContainer />

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1100px] h-[1100px] rounded-full blur-3xl opacity-35 bg-[radial-gradient(closest-side,rgba(138,92,246,0.5),rgba(10,10,18,0))]"></div>
        <div className="absolute -bottom-20 -right-20 w-[800px] h-[800px] rounded-full blur-3xl opacity-30 bg-[radial-gradient(closest-side,rgba(99,102,241,0.4),rgba(10,10,18,0))]"></div>
      </div>

      <Header onSearch={fetchMatches} onExtendedStats={() => setShowExtendedModal(true)} />

      <main className="relative z-10">
        <section className="bg-black/20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
            <div className="text-center space-y-3">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-white text-balance">
                Mérkőzés szűrő és statisztikák
              </h1>
              <p className="max-w-2xl mx-auto text-sm sm:text-base text-zinc-300 text-pretty">
                Szűrd a meccseket csapatokra és eseményekre, elemezd a kimeneteleket, és exportáld CSV-be.
              </p>
            </div>

            <FilterSection
              filters={filters}
              onFiltersChange={setFilters}
              onApply={fetchMatches}
              onReset={handleReset}
              onExport={exportToCSV}
              teams={teams}
              autoApply={true}
            />

            <BTTSHighlight stats={stats} />

            <StatsSection stats={stats} matches={filteredMatches} onExtendedStats={() => setShowExtendedModal(true)} />

            <ResultsSection
              matches={filteredMatches}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              sortConfig={sortConfig}
              totalCount={filteredMatches.length}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={setItemsPerPage}
              onSort={setSortConfig}
            />
          </div>
        </section>
      </main>

      <Footer />

      <ExtendedStatsModal isOpen={showExtendedModal} onClose={() => setShowExtendedModal(false)} matches={filteredMatches} filters={filters} />

      <KeyboardShortcuts onApplyFilters={fetchMatches} onResetFilters={handleReset} onExportCSV={exportToCSV} onExtendedStats={() => setShowExtendedModal(true)} />
    </div>
  )
          }
