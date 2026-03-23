import { config } from "../../config"
import type { LanguageStat } from "../../providers/types"
import type { CardTheme } from "../types"
import { formatNumber, maxOrOne } from "../utils"

type LanguagesSectionProps = {
  languages: LanguageStat[]
  x: number
  y: number
  width: number
  theme: CardTheme
  compact?: boolean
}

export function LanguagesSection({ languages, x, y, width, theme, compact = false }: LanguagesSectionProps) {
  const maxSize = maxOrOne(languages.map((language) => language.size))
  const rowHeight = compact ? 42 : 28
  const labelFontSize = compact ? 18 : 14
  const valueFontSize = compact ? 14 : 12
  const trackHeight = compact ? 14 : 12

  return (
    <g transform={`translate(${x} ${y})`}>
      <text x="0" y="20" font-size={compact ? "22" : "18"} font-family={config.card.fontFamily} fill={theme.text} font-weight="600">
        Top Languages
      </text>
      <g transform="translate(0 34)">
        {languages.map((language, index) => {
          const top = index * rowHeight
          const trackWidth = width - 180
          const fillWidth = Math.max(10, (language.size / maxSize) * trackWidth)
          return (
            <g key={language.name} transform={`translate(0 ${top})`}>
              <text x="0" y="14" font-family={config.card.fontFamily} font-size={String(labelFontSize)} fill={theme.text}>
                {language.name}
              </text>
              <rect x="110" y="3" width={trackWidth} height={String(trackHeight)} rx="6" fill={theme.panelMuted} />
              <rect x="110" y="3" width={fillWidth} height={String(trackHeight)} rx="6" fill={language.color || theme.accent} />
              <text
                x={width}
                y="14"
                text-anchor="end"
                font-family={config.card.fontFamily}
                font-size={String(valueFontSize)}
                fill={theme.textMuted}
              >
                {formatNumber(language.size)}
              </text>
            </g>
          )
        })}
      </g>
    </g>
  )
}
