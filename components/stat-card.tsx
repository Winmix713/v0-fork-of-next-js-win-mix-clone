import { Card, CardContent } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: number
  color?: string
  icon?: LucideIcon
  subtitle?: string
}

export function StatCard({ title, value, color = "text-white", icon: Icon, subtitle }: StatCardProps) {
  return (
    <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
      <CardContent className="p-4 text-center">
        {Icon && (
          <div className="flex justify-center mb-2">
            <Icon className={`w-5 h-5 ${color}`} />
          </div>
        )}
        <div className={`text-2xl font-bold ${color}`}>{value.toLocaleString()}</div>
        <div className="text-sm text-slate-400">{title}</div>
        {subtitle && <div className="text-xs text-slate-500 mt-1">{subtitle}</div>}
      </CardContent>
    </Card>
  )
}
