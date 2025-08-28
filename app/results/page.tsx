"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FilterSection } from "@/components/filter-section"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Download, FileText } from "lucide-react"
import { exportToCSV } from "@/utils/csv-export"
import { StatsCardGroup } from "@/components/stats-card-group"

interface Match {
  id: number
  match_time: string
  home_team: string
  away_team: string
  half_time_home_goals: number
  half_time_away_goals: number
  full_time_home_goals: number
  full_time_away_goals: number
  btts: boolean
  comeback: boolean
  result: string
}

export default function ResultsPage() {
  const [matches, setMatches] = useState<Match[]>([])
  const [filteredMatches, setFilteredMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<string>("")
  const [teams, setTeams] = useState<string[]>([])

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 100

  const [filters, setFilters] = useState({
    homeTeam: "",
    awayTeam: "",
    btts: "",
    comeback: "",
    searchTerm: "",
  })

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  const transformSupabaseMatch = (match: any): Match => ({
    ...match,
    btts: match.full_time_home_goals > 0 && match.full_time_away_goals > 0,
    comeback:
      (match.half_time_home_goals < match.half_time_away_goals &&
        match.full_time_home_goals > match.full_time_away_goals) ||
      (match.half_time_home_goals > match.half_time_away_goals &&
        match.full_time_home_goals < match.full_time_away_goals),
    result:
      match.full_time_home_goals > match.full_time_away_goals
        ? "home"
        : match.full_time_home_goals < match.full_time_away_goals
          ? "away"
          : "draw",
  })

  useEffect(() => {
    fetchMatches()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [filters, matches])

  const fetchMatches = async () => {
    try {
      const { data, error } = await supabase.from("matches").select("*").order("id", { ascending: false })

      if (error) throw error

      const transformedMatches = data.map(transformSupabaseMatch)
      setMatches(transformedMatches)

      const uniqueTeams = Array.from(
        new Set([...transformedMatches.map((m) => m.home_team), ...transformedMatches.map((m) => m.away_team)]),
      ).sort()
      setTeams(uniqueTeams)
    } catch (error) {
      console.error("Error fetching matches:", error)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = matches

    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase()
      filtered = filtered.filter(
        (match) =>
          match.home_team.toLowerCase().includes(searchLower) || match.away_team.toLowerCase().includes(searchLower),
      )
    }

    if (filters.homeTeam) {
      filtered = filtered.filter((match) => match.home_team === filters.homeTeam)
    }

    if (filters.awayTeam) {
      filtered = filtered.filter((match) => match.away_team === filters.awayTeam)
    }

    if (filters.btts) {
      const bttsValue = filters.btts === "yes"
      filtered = filtered.filter((match) => match.btts === bttsValue)
    }

    if (filters.comeback) {
      const comebackValue = filters.comeback === "yes"
      filtered = filtered.filter((match) => match.comeback === comebackValue)
    }

    setFilteredMatches(filtered)
    setCurrentPage(1)
  }

  const handleFiltersChange = (newFilters: typeof filters) => {
    setFilters(newFilters)
  }

  const handleApply = () => {
    applyFilters()
  }

  const handleReset = () => {
    setFilters({
      homeTeam: "",
      awayTeam: "",
      btts: "",
      comeback: "",
      searchTerm: "",
    })
  }

  const handleExport = () => {
    exportToCSV(filteredMatches, "winmix-results")
  }

  const handleCSVUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    setUploadStatus("Uploading...")

    try {
      const text = await file.text()
      const lines = text.split("\n").filter((line) => line.trim())
      const headers = lines[0].split(",").map((h) => h.trim())

      const matches = lines
        .slice(1)
        .map((line) => {
          const values = line.split(",").map((v) => v.trim())
          return {
            match_time: values[0] || "",
            home_team: values[1] || "",
            away_team: values[2] || "",
            half_time_home_goals: Number.parseInt(values[3]) || 0,
            half_time_away_goals: Number.parseInt(values[4]) || 0,
            full_time_home_goals: Number.parseInt(values[5]) || 0,
            full_time_away_goals: Number.parseInt(values[6]) || 0,
          }
        })
        .filter((match) => match.home_team && match.away_team)

      const { error } = await supabase.from("matches").insert(matches)

      if (error) throw error

      setUploadStatus(`Successfully uploaded ${matches.length} matches!`)
      fetchMatches()
    } catch (error) {
      console.error("Upload error:", error)
      setUploadStatus("Upload failed. Please check your CSV format.")
    } finally {
      setUploading(false)
      setTimeout(() => setUploadStatus(""), 3000)
    }
  }

  const totalPages = Math.ceil(filteredMatches.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentMatches = filteredMatches.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }
    return pages
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-white">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">Match Results</h1>

          {/* CSV Upload Section */}
          <Card className="mb-6 bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload CSV Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Input
                  type="file"
                  accept=".csv"
                  onChange={handleCSVUpload}
                  disabled={uploading}
                  className="bg-slate-700 border-slate-600 text-white"
                />
                <Button
                  onClick={handleExport}
                  variant="outline"
                  className="border-slate-600 text-white hover:bg-slate-700 bg-transparent"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
              </div>
              {uploadStatus && (
                <p className={`mt-2 text-sm ${uploadStatus.includes("Success") ? "text-green-400" : "text-red-400"}`}>
                  {uploadStatus}
                </p>
              )}
            </CardContent>
          </Card>

          <FilterSection
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onApply={handleApply}
            onReset={handleReset}
            onExport={handleExport}
            teams={teams}
            autoApply={true}
          />
        </div>

        <div className="mb-6">
          <StatsCardGroup matches={matches} filteredMatches={filteredMatches} title="Match Statistics" />
        </div>

        {/* Results Table */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Match Results ({filteredMatches.length} matches)
              {totalPages > 1 && (
                <span className="text-sm text-slate-400 ml-2">
                  Page {currentPage} of {totalPages}
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-white">
                <thead>
                  <tr className="border-b border-slate-600">
                    <th className="text-left p-2">Time</th>
                    <th className="text-left p-2">Home Team</th>
                    <th className="text-left p-2">Away Team</th>
                    <th className="text-center p-2">HT</th>
                    <th className="text-center p-2">FT</th>
                    <th className="text-center p-2">BTTS</th>
                    <th className="text-center p-2">Comeback</th>
                  </tr>
                </thead>
                <tbody>
                  {currentMatches.map((match) => (
                    <tr key={match.id} className="border-b border-slate-700 hover:bg-slate-700/30">
                      <td className="p-2">{match.match_time}</td>
                      <td className="p-2">{match.home_team}</td>
                      <td className="p-2">{match.away_team}</td>
                      <td className="p-2 text-center">
                        {match.half_time_home_goals}-{match.half_time_away_goals}
                      </td>
                      <td className="p-2 text-center">
                        {match.full_time_home_goals}-{match.full_time_away_goals}
                      </td>
                      <td className="p-2 text-center">
                        <span className={`px-2 py-1 rounded text-xs ${match.btts ? "bg-green-600" : "bg-red-600"}`}>
                          {match.btts ? "Yes" : "No"}
                        </span>
                      </td>
                      <td className="p-2 text-center">
                        <span
                          className={`px-2 py-1 rounded text-xs ${match.comeback ? "bg-orange-600" : "bg-slate-600"}`}
                        >
                          {match.comeback ? "Yes" : "No"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-600">
                <div className="text-sm text-slate-400">
                  Showing {startIndex + 1} to {Math.min(endIndex, filteredMatches.length)} of {filteredMatches.length}{" "}
                  matches
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    variant="outline"
                    size="sm"
                    className="border-slate-600 text-white hover:bg-slate-700 bg-transparent disabled:opacity-50"
                  >
                    Previous
                  </Button>

                  {getPageNumbers().map((page) => (
                    <Button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      className={
                        currentPage === page
                          ? "bg-purple-600 hover:bg-purple-700 text-white"
                          : "border-slate-600 text-white hover:bg-slate-700 bg-transparent"
                      }
                    >
                      {page}
                    </Button>
                  ))}

                  <Button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    variant="outline"
                    size="sm"
                    className="border-slate-600 text-white hover:bg-slate-700 bg-transparent disabled:opacity-50"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  )
}
