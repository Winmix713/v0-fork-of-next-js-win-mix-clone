"use client"

import { useEffect } from "react"
import type { WinMixFilters } from "@/stores/winmix-store"
import { FilterDropdown } from "./filter-dropdown"
import { SearchInput } from "./search-input"
import { useToast } from "./toast-container"
import { GlassmorphicButton } from "./glassmorphic-button"

interface FilterSectionProps {
  filters: WinMixFilters
  onFiltersChange: (value: WinMixFilters | ((prev: WinMixFilters) => WinMixFilters)) => void
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

  const updateFilter = <K extends keyof WinMixFilters>(key: K, value: WinMixFilters[K]) => {
    onFiltersChange((prev) => ({ ...prev, [key]: value }))
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
    <div className="mt-8 bg-white/8 backdrop-blur-xl border border-white/15 rounded-3xl shadow-2xl">
      <div className="px-6 py-5 border-b border-white/8 flex items-center justify-between bg-black">
        <div className="flex items-center gap-3">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2 border border-white/20">
            <i
              data-lucide="filter"
              className="text-white/90"
              style={{ width: "16px", height: "16px", strokeWidth: "1.5" }}
            ></i>
          </div>
          <div>
            <span className="text-base font-medium text-white/95">Szűrők</span>
            {hasActiveFilters && (
              <div className="flex items-center gap-2 mt-1">
                <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1 text-xs text-white/70 border border-white/20">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div>
                  Aktív szűrők
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-3">
          {!autoApply && (
            <button
              onClick={handleApply}
              className="flex items-center gap-2 text-sm bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-sm border border-blue-400/30 rounded-xl px-4 py-2 text-white/95 hover:from-blue-500/30 hover:to-cyan-500/30 transition-all duration-300"
            >
              <i data-lucide="sliders-horizontal" style={{ width: "16px", height: "16px", strokeWidth: "1.5" }}></i>
              Szűrés
            </button>
          )}
          <GlassmorphicButton onClick={handleReset} icon="rotate-ccw">
            Visszaállítás
          </GlassmorphicButton>
          <GlassmorphicButton onClick={handleExport} icon="download" variant="export">
            CSV Export
          </GlassmorphicButton>
        </div>
      </div>

      <div className="px-6 py-6 space-y-8 bg-black">
        <SearchInput
          value={filters.searchTerm}
          onChange={(value) => updateFilter("searchTerm", value)}
          placeholder="Keresés csapatnevek, ligák alapján..."
          className="w-full"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <FilterDropdown
            label="Hazai csapat"
            icon="home"
            iconBg="from-orange-500/20 to-red-500/20"
            options={homeTeamOptions}
            value={filters.homeTeam ?? ""}
            onChange={(value) => updateFilter("homeTeam", (value || undefined) as WinMixFilters["homeTeam"])}
          />

          <FilterDropdown
            label="Vendég csapat"
            icon="flag"
            iconBg="from-blue-500/20 to-cyan-500/20"
            options={awayTeamOptions}
            value={filters.awayTeam ?? ""}
            onChange={(value) => updateFilter("awayTeam", (value || undefined) as WinMixFilters["awayTeam"])}
          />

          <FilterDropdown
            label="Mindkét csapat gólt szerzett"
            icon="target"
            iconBg="bg-white/10"
            options={bttsOptions}
            value={filters.btts ?? ""}
            onChange={(value) => updateFilter("btts", value as WinMixFilters["btts"])}
          />

          <FilterDropdown
            label="Fordítás történt"
            icon="shuffle"
            iconBg="bg-white/10"
            options={comebackOptions}
            value={filters.comeback ?? ""}
            onChange={(value) => updateFilter("comeback", value as WinMixFilters["comeback"])}
          />
        </div>

        <div className="flex sm:hidden items-center gap-4 flex-wrap pt-6 border-t border-white/8">
          {!autoApply && (
            <button
              onClick={handleApply}
              className="flex items-center gap-2 text-sm bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-sm border border-blue-400/30 rounded-xl px-4 py-2 text-white/95 hover:from-blue-500/30 hover:to-cyan-500/30 transition-all duration-300 flex-1"
            >
              <i data-lucide="sliders-horizontal" style={{ width: "16px", height: "16px", strokeWidth: "1.5" }}></i>
              Szűrés
            </button>
          )}
          <div className="flex gap-3 flex-1">
            <GlassmorphicButton onClick={handleReset} icon="rotate-ccw" className="text-sm flex-1">
              Visszaállítás
            </GlassmorphicButton>
            <GlassmorphicButton onClick={handleExport} icon="download" variant="export" className="text-sm flex-1">
              CSV Export
            </GlassmorphicButton>
          </div>
        </div>
      </div>
    </div>
  )
}
