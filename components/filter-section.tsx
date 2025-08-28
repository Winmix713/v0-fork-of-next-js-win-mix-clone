"use client"

import { useEffect } from "react"
import { FilterDropdown } from "./filter-dropdown"
import { SearchInput } from "./search-input"
import { useToast } from "./toast-container"

interface FilterSectionProps {
  filters: {
    homeTeam: string
    awayTeam: string
    btts: string
    comeback: string
    searchTerm: string
  }
  onFiltersChange: (filters: FilterSectionProps["filters"]) => void
  onApply: () => void
  onReset: () => void
  onExport: () => void
  teams?: string[]
  autoApply?: boolean
}

export function FilterSection({
  filters,
  onFiltersChange,
  onApply,
  onReset,
  onExport,
  teams = [],
  autoApply = false,
}: FilterSectionProps) {
  const { showSuccess, showInfo } = useToast()

  useEffect(() => {
    if (typeof window !== "undefined" && window.lucide) {
      window.lucide.createIcons()
    }
  }, [])

  const updateFilter = (key: string, value: string | number) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const handleApply = () => {
    onApply()
    if (!autoApply) {
      showInfo("Szűrők alkalmazva", "Az eredmények frissítve lettek")
    }
  }

  const handleReset = () => {
    onReset()
    showInfo("Szűrők visszaállítva", "Minden szűrő törölve lett")
  }

  const handleExport = () => {
    onExport()
    showSuccess("CSV export", "A fájl letöltése megkezdődött")
  }

  const homeTeamOptions = [
    { value: "", label: "Válassz hazai csapatot" },
    ...teams.sort().map((team) => ({ value: team, label: team })),
  ]

  const awayTeamOptions = [
    { value: "", label: "Válassz vendég csapatot" },
    ...teams.sort().map((team) => ({ value: team, label: team })),
  ]

  const bttsOptions = [
    { value: "", label: "Válassz: Igen / Nem" },
    { value: "yes", label: "Igen" },
    { value: "no", label: "Nem" },
  ]

  const comebackOptions = [
    { value: "", label: "Válassz: Igen / Nem" },
    { value: "yes", label: "Igen" },
    { value: "no", label: "Nem" },
  ]

  const hasActiveFilters =
    filters.searchTerm || filters.homeTeam || filters.awayTeam || filters.btts || filters.comeback

  return (
    <div className="mt-8 ring-1 ring-white/10 bg-white/5 rounded-2xl backdrop-blur">
      <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2 text-zinc-300">
          <i data-lucide="filter" style={{ width: "18px", height: "18px", strokeWidth: "1.5" }}></i>
          <span className="text-sm font-medium">Szűrők</span>
          {hasActiveFilters && (
            <span className="inline-flex items-center gap-1 rounded-full bg-violet-500/10 text-violet-300 ring-1 ring-violet-400/30 px-2 py-0.5 text-xs">
              <i data-lucide="zap" style={{ width: "12px", height: "12px", strokeWidth: "1.5" }}></i>
              Aktív
            </span>
          )}
        </div>
        <div className="hidden sm:flex items-center gap-3">
          {!autoApply && (
            <button
              onClick={handleApply}
              className="inline-flex items-center gap-2 text-sm font-semibold tracking-tight text-white bg-gradient-to-br from-violet-500 to-indigo-600 rounded-full px-4 py-2.5 shadow-lg hover:shadow-[0_12px_24px_-6px_rgba(139,92,246,0.4)] hover:-translate-y-0.5 transform-gpu transition-all duration-200 btn-primary"
            >
              <i data-lucide="sliders-horizontal" style={{ width: "18px", height: "18px", strokeWidth: "1.5" }}></i>
              Szűrés
            </button>
          )}
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-200 border border-white/10 rounded-full px-4 py-2.5 hover:bg-white/5 transition-colors duration-200"
          >
            <i data-lucide="rotate-ccw" style={{ width: "18px", height: "18px", strokeWidth: "1.5" }}></i>
            Visszaállítás
          </button>
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-200 border border-white/10 rounded-full px-4 py-2.5 hover:bg-white/5 transition-colors duration-200"
          >
            <i data-lucide="download" style={{ width: "18px", height: "18px", strokeWidth: "1.5" }}></i>
            CSV Export
          </button>
        </div>
      </div>
      <div className="px-4 sm:px-6 py-5 space-y-6">
        <SearchInput
          value={filters.searchTerm}
          onChange={(value) => updateFilter("searchTerm", value)}
          placeholder="Keresés csapatnevek, ligák alapján..."
          className="w-full"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <FilterDropdown
            label="Hazai csapat"
            icon="home"
            iconBg="from-violet-500 to-indigo-600"
            options={homeTeamOptions}
            value={filters.homeTeam}
            onChange={(value) => updateFilter("homeTeam", value)}
          />

          <FilterDropdown
            label="Vendég csapat"
            icon="flag"
            iconBg="from-fuchsia-500 to-violet-600"
            options={awayTeamOptions}
            value={filters.awayTeam}
            onChange={(value) => updateFilter("awayTeam", value)}
          />

          <FilterDropdown
            label="Mindkét csapat gólt szerzett"
            icon="target"
            iconBg="bg-white/5 ring-1 ring-white/10"
            options={bttsOptions}
            value={filters.btts}
            onChange={(value) => updateFilter("btts", value)}
          />

          <FilterDropdown
            label="Fordítás történt"
            icon="shuffle"
            iconBg="bg-white/5 ring-1 ring-white/10"
            options={comebackOptions}
            value={filters.comeback}
            onChange={(value) => updateFilter("comeback", value)}
          />
        </div>

        {/* Mobile buttons */}
        <div className="flex sm:hidden items-center gap-3 flex-wrap pt-4 border-t border-white/10">
          {!autoApply && (
            <button
              onClick={handleApply}
              className="inline-flex items-center gap-2 text-sm font-semibold tracking-tight text-white bg-gradient-to-br from-violet-500 to-indigo-600 rounded-full px-4 py-2.5 shadow-lg transition-all duration-200 btn-primary"
            >
              <i data-lucide="sliders-horizontal" style={{ width: "18px", height: "18px", strokeWidth: "1.5" }}></i>
              Szűrés
            </button>
          )}
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-200 border border-white/10 rounded-full px-4 py-2.5 hover:bg-white/5 transition-colors duration-200"
          >
            <i data-lucide="rotate-ccw" style={{ width: "18px", height: "18px", strokeWidth: "1.5" }}></i>
            Visszaállítás
          </button>
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-200 border border-white/10 rounded-full px-4 py-2.5 hover:bg-white/5 transition-colors duration-200"
          >
            <i data-lucide="download" style={{ width: "18px", height: "18px", strokeWidth: "1.5" }}></i>
            CSV Export
          </button>
        </div>
      </div>
    </div>
  )
}
