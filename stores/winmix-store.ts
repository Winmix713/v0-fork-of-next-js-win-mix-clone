"use client"

import { useCallback, useState } from "react"
import { createBrowserClient } from "@supabase/ssr"

export interface StoreMatch {
  id: number
  home: string
  away: string
  ht: string
  ft: string
  btts: "yes" | "no"
  comeback: "yes" | "no"
  result: "H" | "D" | "A"
  date?: string
  match_time: string
  league: string
  season: string
}

export interface WinMixFilters {
  searchTerm: string
  homeTeam?: string
  awayTeam?: string
  btts?: "yes" | "no" | ""
  comeback?: "yes" | "no" | ""
}

interface SupabaseMatchRow {
  id: number
  match_time: string
  home_team: string
  away_team: string
  half_time_home_goals: number | null
  half_time_away_goals: number | null
  full_time_home_goals: number
  full_time_away_goals: number
  league: string
  season: string | null
}

function transformMatch(row: SupabaseMatchRow): StoreMatch {
  const htHome = row.half_time_home_goals ?? 0
  const htAway = row.half_time_away_goals ?? 0
  const ftHome = row.full_time_home_goals
  const ftAway = row.full_time_away_goals

  const btts: "yes" | "no" = ftHome > 0 && ftAway > 0 ? "yes" : "no"

  let result: "H" | "D" | "A" = "D"
  if (ftHome > ftAway) result = "H"
  else if (ftHome < ftAway) result = "A"

  const halftimeLeader = htHome === htAway ? "D" : htHome > htAway ? "H" : "A"
  const comeback: "yes" | "no" = halftimeLeader !== "D" && halftimeLeader !== result ? "yes" : "no"

  return {
    id: row.id,
    home: row.home_team,
    away: row.away_team,
    ht: `${htHome}-${htAway}`,
    ft: `${ftHome}-${ftAway}`,
    btts,
    comeback,
    result,
    match_time: row.match_time,
    league: row.league,
    season: row.season ?? "Unknown Season",
  }
}

export function useWinMixStore() {
  const [matches, setMatches] = useState<StoreMatch[]>([])
  const [filters, setFilters] = useState<WinMixFilters>({ searchTerm: "" })
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMatches = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      )

      const { data, error } = await supabase
        .from("matches")
        .select(
          [
            "id",
            "match_time",
            "home_team",
            "away_team",
            "half_time_home_goals",
            "half_time_away_goals",
            "full_time_home_goals",
            "full_time_away_goals",
            "league",
            "season",
          ].join(", "),
        )
        .order("id", { ascending: false })

      if (error) throw error

      const transformed = (data as SupabaseMatchRow[]).map(transformMatch)
      setMatches(transformed)
    } catch (e: any) {
      setError(e?.message ?? "Unknown error")
    } finally {
      setLoading(false)
    }
  }, [])

  return { matches, filters, loading, error, fetchMatches, setFilters }
}
