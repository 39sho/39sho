import { config } from "../../config"
import type { HeatmapDay } from "../../providers/types"
import type { CardTheme } from "../types"

type HeatmapSectionProps = {
  days: HeatmapDay[]
  x: number
  y: number
  width: number
  title?: string
  theme: CardTheme
}

export function HeatmapSection({ days, x, y, width, title = "Contribution (1 year)", theme }: HeatmapSectionProps) {
  const columns = 53
  const rows = 7
  const gap = 2
  const cell = Math.floor((width - (columns - 1) * gap) / columns)

  const dayMap = new Map<string, HeatmapDay>()
  for (const day of days) {
    dayMap.set(day.date, day)
  }

  const today = new Date()
  const startDate = new Date(today)
  startDate.setUTCDate(startDate.getUTCDate() - (columns * rows - 1))

  const cells = [] as Array<{ x: number; y: number; level: number }>
  for (let index = 0; index < columns * rows; index += 1) {
    const date = new Date(startDate)
    date.setUTCDate(startDate.getUTCDate() + index)
    const iso = date.toISOString().slice(0, 10)
    const day = dayMap.get(iso)
    const column = Math.floor(index / rows)
    const row = index % rows
    cells.push({
      x: column * (cell + gap),
      y: row * (cell + gap),
      level: day?.level ?? 0
    })
  }

  return (
    <g transform={`translate(${x} ${y})`}>
      <text x="0" y="20" font-size="18" font-family={config.card.fontFamily} fill={theme.text} font-weight="600">
        {title}
      </text>
      <g transform="translate(0 34)">
        {cells.map((entry, index) => (
          <rect
            key={`cell-${index}`}
            x={entry.x}
            y={entry.y}
            width={cell}
            height={cell}
            rx="2"
            fill={theme.heatmapLevels[entry.level]}
          />
        ))}
      </g>
    </g>
  )
}
