import { config } from "../../config"
import type { BasicStats } from "../../providers/types"
import type { CardTheme } from "../types"
import { formatNumber } from "../utils"

type StatsSectionProps = {
  stats: BasicStats
  x: number
  y: number
  theme: CardTheme
  compact?: boolean
}

type TileProps = {
  x: number
  y: number
  label: string
  value: string
  theme: CardTheme
  compact?: boolean
}

function StatTile({ x, y, label, value, theme, compact = false }: TileProps) {
  const width = compact ? 250 : 180
  const height = compact ? 116 : 88
  const labelY = compact ? 42 : 34
  const valueY = compact ? 84 : 66
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="0" y="0" width={width} height={height} rx="14" fill={theme.panelMuted} />
      <text x="16" y={labelY} font-family={config.card.fontFamily} font-size={compact ? "19" : "15"} fill={theme.textMuted}>
        {label}
      </text>
      <text x="16" y={valueY} font-family={config.card.titleFontFamily} font-size={compact ? "40" : "30"} fill={theme.text} font-weight="700">
        {value}
      </text>
    </g>
  )
}

export function StatsSection({ stats, x, y, theme, compact = false }: StatsSectionProps) {
  const tileSpacing = compact ? 270 : 194
  return (
    <g transform={`translate(${x} ${y})`}>
      <StatTile x={0} y={0} label="Public Repos" value={formatNumber(stats.publicRepos)} theme={theme} compact={compact} />
      <StatTile x={tileSpacing} y={0} label="Followers" value={formatNumber(stats.followers)} theme={theme} compact={compact} />
      <StatTile
        x={tileSpacing * 2}
        y={0}
        label="Total Stars"
        value={formatNumber(stats.totalStars)}
        theme={theme}
        compact={compact}
      />
    </g>
  )
}
