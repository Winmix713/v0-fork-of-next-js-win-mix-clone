interface BTTSHighlightProps {
  stats: {
    total: number
    bttsYes: number
    confidenceInterval?: {
      lower: number
      upper: number
    }
    trend?: "up" | "down" | "stable"
    reliability?: "high" | "medium" | "low"
  }
}

export function BTTSHighlight({ stats }: BTTSHighlightProps) {
  const percentage = stats.total > 0 ? (stats.bttsYes / stats.total) * 100 : 0
  const formattedPercentage = percentage.toFixed(1)

  const confidenceRange = stats.confidenceInterval
    ? `±${((stats.confidenceInterval.upper - stats.confidenceInterval.lower) / 2).toFixed(1)}%`
    : null

  const reliabilityColor = {
    high: "text-green-400",
    medium: "text-yellow-400",
    low: "text-red-400",
  }[stats.reliability || "medium"]

  const reliabilityText = {
    high: "Magas megbízhatóság",
    medium: "Közepes megbízhatóság",
    low: "Alacsony megbízhatóság",
  }[stats.reliability || "medium"]

  const TrendIcon = () => {
    if (stats.trend === "up") {
      return (
        <svg
          className="text-green-400"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
          <polyline points="16 7 22 7 22 13"></polyline>
        </svg>
      )
    } else if (stats.trend === "down") {
      return (
        <svg
          className="text-red-400"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <polyline points="2 17 8.5 10.5 13.5 15.5 22 7"></polyline>
          <polyline points="16 17 22 17 22 11"></polyline>
        </svg>
      )
    } else {
      return (
        <svg
          className="text-indigo-300"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
          <polyline points="16 7 22 7 22 13"></polyline>
        </svg>
      )
    }
  }

  return (
    <div className="mt-8 mb-6">
      <div className="rounded-2xl ring-1 ring-indigo-400/30 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 ring-1 ring-white/20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <circle cx="12" cy="12" r="6"></circle>
                <circle cx="12" cy="12" r="2"></circle>
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">Mindkét csapat gólt szerzett</h3>
              <p className="text-sm text-zinc-300">A szűrt mérkőzések alapján</p>
              <div className="flex items-center gap-2 mt-1">
                <div
                  className={`w-2 h-2 rounded-full ${stats.reliability === "high" ? "bg-green-400" : stats.reliability === "low" ? "bg-red-400" : "bg-yellow-400"}`}
                ></div>
                <span className={`text-xs ${reliabilityColor}`}>{reliabilityText}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 mb-1">
              <TrendIcon />
              <span className="text-3xl font-bold text-indigo-300">{formattedPercentage}%</span>
            </div>
            {confidenceRange && <p className="text-xs text-indigo-400 mb-1">Konfidencia: {confidenceRange}</p>}
            <p className="text-sm text-zinc-400">
              {stats.bttsYes} / {stats.total} mérkőzés
            </p>
          </div>
        </div>

        <div className="mt-4">
          <div className="w-full bg-white/10 rounded-full h-2 relative">
            <div
              className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${percentage}%` }}
            ></div>
            {/* Confidence interval markers */}
            {stats.confidenceInterval && (
              <>
                <div
                  className="absolute top-0 w-0.5 h-2 bg-indigo-300/60"
                  style={{ left: `${Math.max(0, stats.confidenceInterval.lower)}%` }}
                ></div>
                <div
                  className="absolute top-0 w-0.5 h-2 bg-indigo-300/60"
                  style={{ left: `${Math.min(100, stats.confidenceInterval.upper)}%` }}
                ></div>
              </>
            )}
          </div>
          {stats.confidenceInterval && (
            <div className="flex justify-between text-xs text-zinc-500 mt-1">
              <span>{stats.confidenceInterval.lower.toFixed(1)}%</span>
              <span>{stats.confidenceInterval.upper.toFixed(1)}%</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
