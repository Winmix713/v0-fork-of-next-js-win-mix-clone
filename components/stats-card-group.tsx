import { StatCard } from "./stat-card"
import { Trophy, Users, Target, TrendingUp, Home, Minus, Plane } from "lucide-react"

interface Match {
  btts: boolean
  comeback: boolean
  result: string
}

interface StatsCardGroupProps {
  matches: Match[]
  filteredMatches: Match[]
  title?: string
}

export function StatsCardGroup({ matches, filteredMatches, title }: StatsCardGroupProps) {
  const totalMatches = matches.length
  const filteredCount = filteredMatches.length
  const bttsYes = filteredMatches.filter((m) => m.btts).length
  const bttsNo = filteredMatches.filter((m) => !m.btts).length
  const comebacks = filteredMatches.filter((m) => m.comeback).length
  const homeWins = filteredMatches.filter((m) => m.result === "home").length
  const draws = filteredMatches.filter((m) => m.result === "draw").length
  const awayWins = filteredMatches.filter((m) => m.result === "away").length

  return (
    <div className="space-y-4">
      {title && <h3 className="text-lg font-semibold text-white">{title}</h3>}

      {/* General Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Matches" value={totalMatches} color="text-white" icon={Users} />
        <StatCard title="Filtered" value={filteredCount} color="text-purple-400" icon={Target} />
        <StatCard
          title="BTTS Yes"
          value={bttsYes}
          color="text-green-400"
          icon={Trophy}
          subtitle={`${((bttsYes / filteredCount) * 100 || 0).toFixed(1)}%`}
        />
        <StatCard
          title="Comebacks"
          value={comebacks}
          color="text-orange-400"
          icon={TrendingUp}
          subtitle={`${((comebacks / filteredCount) * 100 || 0).toFixed(1)}%`}
        />
      </div>

      {/* Match Results */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard
          title="Home Wins"
          value={homeWins}
          color="text-blue-400"
          icon={Home}
          subtitle={`${((homeWins / filteredCount) * 100 || 0).toFixed(1)}%`}
        />
        <StatCard
          title="Draws"
          value={draws}
          color="text-yellow-400"
          icon={Minus}
          subtitle={`${((draws / filteredCount) * 100 || 0).toFixed(1)}%`}
        />
        <StatCard
          title="Away Wins"
          value={awayWins}
          color="text-red-400"
          icon={Plane}
          subtitle={`${((awayWins / filteredCount) * 100 || 0).toFixed(1)}%`}
        />
      </div>

      {/* BTTS Breakdown */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          title="BTTS No"
          value={bttsNo}
          color="text-red-400"
          subtitle={`${((bttsNo / filteredCount) * 100 || 0).toFixed(1)}%`}
        />
        <StatCard
          title="BTTS Yes"
          value={bttsYes}
          color="text-green-400"
          subtitle={`${((bttsYes / filteredCount) * 100 || 0).toFixed(1)}%`}
        />
      </div>
    </div>
  )
}
