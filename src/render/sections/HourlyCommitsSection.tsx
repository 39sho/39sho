import { config } from "../../config"
import type { HourlyBucket } from "../../providers/types"
import type { CardTheme } from "../types"
import { maxOrOne } from "../utils"

type HourlyCommitsSectionProps = {
  buckets: HourlyBucket[]
  x: number
  y: number
  width: number
  height: number
  title: string
  theme: CardTheme
  compact?: boolean
}

export function HourlyCommitsSection({ buckets, x, y, width, height, title, theme, compact = false }: HourlyCommitsSectionProps) {
  const labelSpace = compact ? 34 : 26
  const chartHeight = height - labelSpace
  const barGap = compact ? 3 : 4
  const barWidth = (width - barGap * (buckets.length - 1)) / buckets.length
  const max = maxOrOne(buckets.map((bucket) => bucket.count))

  return (
    <g transform={`translate(${x} ${y})`}>
      <text x="0" y="20" font-size={compact ? "22" : "18"} font-family={config.card.fontFamily} fill={theme.text} font-weight="600">
        Commits by Hour
      </text>
      <text x={width} y="20" text-anchor="end" font-size={compact ? "16" : "14"} font-family={config.card.fontFamily} fill={theme.textMuted}>
        {title}
      </text>
      <g transform="translate(0 32)">
        {buckets.map((bucket, index) => {
          const ratio = bucket.count / max
          const barHeight = Math.max(2, ratio * chartHeight)
          const barX = index * (barWidth + barGap)
          const barY = chartHeight - barHeight
          const showTick = compact ? bucket.hour % 2 === 0 : bucket.hour % 3 === 0
          return (
            <g key={`hour-${bucket.hour}`}>
              <rect x={barX} y={barY} width={barWidth} height={barHeight} rx="2" fill={theme.accent} />
              {showTick ? (
                <text
                  x={barX + barWidth / 2}
                  y={chartHeight + (compact ? 20 : 16)}
                  text-anchor="middle"
                  font-size={compact ? "12" : "11"}
                  font-family={config.card.fontFamily}
                  fill={theme.textMuted}
                >
                  {bucket.hour}
                </text>
              ) : null}
            </g>
          )
        })}
      </g>
    </g>
  )
}
