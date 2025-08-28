"use client"

import { useState, useEffect } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Target, TrendingUp } from "lucide-react"

interface TeamStats {
  team_name: string
  matches_played: number
  wins: number
  draws: number
  losses: number
  points: number
  goals_for: number
  goals_against: number
  goal_difference: number
  btts_home: number
  btts_away: number
  btts_total: number
  comeback_home: number
  comeback_away: number
  comeback_total: number
}

export default function StatsPage() {
  const [teamStats, setTeamStats] = useState<TeamStats[]>([])
  const [loading, setLoading] = useState(true)
  const [totalMatches, setTotalMatches] = useState(0)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const { data: matches, error } = await supabase.from("matches").select("*")

      if (error) throw error

      setTotalMatches(matches.length)

      // Calculate team statistics
      const teamStatsMap = new Map<string, TeamStats>()

      matches.forEach((match) => {
        const homeTeam = match.home_team
        const awayTeam = match.away_team
        const homeGoals = match.full_time_home_goals
        const awayGoals = match.full_time_away_goals
        const htHomeGoals = match.half_time_home_goals
        const htAwayGoals = match.half_time_away_goals

        // Initialize team stats if not exists
        if (!teamStatsMap.has(homeTeam)) {
          teamStatsMap.set(homeTeam, {
            team_name: homeTeam,
            matches_played: 0,
            wins: 0,
            draws: 0,
            losses: 0,
            points: 0,
            goals_for: 0,
            goals_against: 0,
            goal_difference: 0,
            btts_home: 0,
            btts_away: 0,
            btts_total: 0,
            comeback_home: 0,
            comeback_away: 0,
            comeback_total: 0,
          })
        }

        if (!teamStatsMap.has(awayTeam)) {
          teamStatsMap.set(awayTeam, {
            team_name: awayTeam,
            matches_played: 0,
            wins: 0,
            draws: 0,
            losses: 0,
            points: 0,
            goals_for: 0,
            goals_against: 0,
            goal_difference: 0,
            btts_home: 0,
            btts_away: 0,
            btts_total: 0,
            comeback_home: 0,
            comeback_away: 0,
            comeback_total: 0,
          })
        }

        const homeStats = teamStatsMap.get(homeTeam)!
        const awayStats = teamStatsMap.get(awayTeam)!

        // Update matches played
        homeStats.matches_played++
        awayStats.matches_played++

        // Update goals
        homeStats.goals_for += homeGoals
        homeStats.goals_against += awayGoals
        awayStats.goals_for += awayGoals
        awayStats.goals_against += homeGoals

        // Update results and points
        if (homeGoals > awayGoals) {
          homeStats.wins++
          homeStats.points += 3
          awayStats.losses++
        } else if (homeGoals < awayGoals) {
          awayStats.wins++
          awayStats.points += 3
          homeStats.losses++
        } else {
          homeStats.draws++
          homeStats.points += 1
          awayStats.draws++
          awayStats.points += 1
        }

        // BTTS calculation
        const btts = homeGoals > 0 && awayGoals > 0
        if (btts) {
          homeStats.btts_home++
          homeStats.btts_total++
          awayStats.btts_away++
          awayStats.btts_total++
        }

        // Comeback calculation
        const homeComeback = htHomeGoals < htAwayGoals && homeGoals > awayGoals
        const awayComeback = htHomeGoals > htAwayGoals && homeGoals < awayGoals

        if (homeComeback) {
          homeStats.comeback_home++
          homeStats.comeback_total++
        }
        if (awayComeback) {
          awayStats.comeback_away++
          awayStats.comeback_total++
        }

        // Update goal difference
        homeStats.goal_difference = homeStats.goals_for - homeStats.goals_against
        awayStats.goal_difference = awayStats.goals_for - awayStats.goals_against
      })

      const statsArray = Array.from(teamStatsMap.values()).sort(
        (a, b) => b.points - a.points || b.goal_difference - a.goal_difference,
      )

      setTeamStats(statsArray)
    } catch (error) {
      console.error("Error fetching stats:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-white">Loading statistics...</div>
        </div>
      </div>
    )
  }

  // BTTS rankings
  const bttsHomeRanking = [...teamStats].sort(
    (a, b) => b.btts_home / Math.max(b.matches_played / 2, 1) - a.btts_home / Math.max(a.matches_played / 2, 1),
  )

  const bttsAwayRanking = [...teamStats].sort(
    (a, b) => b.btts_away / Math.max(b.matches_played / 2, 1) - a.btts_away / Math.max(a.matches_played / 2, 1),
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">League Statistics</h1>
          <p className="text-slate-300">Comprehensive analysis of all {totalMatches} matches</p>
        </div>

        {/* Overall League Table */}
        <Card className="mb-8 bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              League Table
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-white">
                <thead>
                  <tr className="border-b border-slate-600">
                    <th className="text-left p-2">Pos</th>
                    <th className="text-left p-2">Team</th>
                    <th className="text-center p-2">MP</th>
                    <th className="text-center p-2">W</th>
                    <th className="text-center p-2">D</th>
                    <th className="text-center p-2">L</th>
                    <th className="text-center p-2">GF</th>
                    <th className="text-center p-2">GA</th>
                    <th className="text-center p-2">GD</th>
                    <th className="text-center p-2">Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {teamStats.map((team, index) => (
                    <tr key={team.team_name} className="border-b border-slate-700 hover:bg-slate-700/30">
                      <td className="p-2 font-bold">{index + 1}</td>
                      <td className="p-2">{team.team_name}</td>
                      <td className="p-2 text-center">{team.matches_played}</td>
                      <td className="p-2 text-center text-green-400">{team.wins}</td>
                      <td className="p-2 text-center text-yellow-400">{team.draws}</td>
                      <td className="p-2 text-center text-red-400">{team.losses}</td>
                      <td className="p-2 text-center">{team.goals_for}</td>
                      <td className="p-2 text-center">{team.goals_against}</td>
                      <td
                        className={`p-2 text-center ${team.goal_difference >= 0 ? "text-green-400" : "text-red-400"}`}
                      >
                        {team.goal_difference >= 0 ? "+" : ""}
                        {team.goal_difference}
                      </td>
                      <td className="p-2 text-center font-bold">{team.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* BTTS Statistics */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Target className="w-5 h-5" />
                BTTS - Home Matches
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {bttsHomeRanking.slice(0, 10).map((team, index) => {
                  const homeMatches = Math.max(Math.floor(team.matches_played / 2), 1)
                  const percentage = ((team.btts_home / homeMatches) * 100).toFixed(1)
                  return (
                    <div key={team.team_name} className="flex justify-between items-center">
                      <span className="text-white">
                        {index + 1}. {team.team_name}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-300 text-sm">
                          {team.btts_home}/{homeMatches}
                        </span>
                        <Badge variant="secondary" className="bg-green-600">
                          {percentage}%
                        </Badge>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Target className="w-5 h-5" />
                BTTS - Away Matches
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {bttsAwayRanking.slice(0, 10).map((team, index) => {
                  const awayMatches = Math.max(Math.floor(team.matches_played / 2), 1)
                  const percentage = ((team.btts_away / awayMatches) * 100).toFixed(1)
                  return (
                    <div key={team.team_name} className="flex justify-between items-center">
                      <span className="text-white">
                        {index + 1}. {team.team_name}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-300 text-sm">
                          {team.btts_away}/{awayMatches}
                        </span>
                        <Badge variant="secondary" className="bg-blue-600">
                          {percentage}%
                        </Badge>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Comeback Statistics */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Comeback Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-white">
                <thead>
                  <tr className="border-b border-slate-600">
                    <th className="text-left p-2">Team</th>
                    <th className="text-center p-2">Home Comebacks</th>
                    <th className="text-center p-2">Away Comebacks</th>
                    <th className="text-center p-2">Total Comebacks</th>
                    <th className="text-center p-2">Comeback %</th>
                  </tr>
                </thead>
                <tbody>
                  {teamStats
                    .sort((a, b) => b.comeback_total - a.comeback_total)
                    .slice(0, 15)
                    .map((team) => {
                      const comebackPercentage = ((team.comeback_total / team.matches_played) * 100).toFixed(1)
                      return (
                        <tr key={team.team_name} className="border-b border-slate-700 hover:bg-slate-700/30">
                          <td className="p-2">{team.team_name}</td>
                          <td className="p-2 text-center">{team.comeback_home}</td>
                          <td className="p-2 text-center">{team.comeback_away}</td>
                          <td className="p-2 text-center font-bold">{team.comeback_total}</td>
                          <td className="p-2 text-center">
                            <Badge variant="secondary" className="bg-orange-600">
                              {comebackPercentage}%
                            </Badge>
                          </td>
                        </tr>
                      )
                    })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  )
}
