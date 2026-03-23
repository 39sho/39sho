import { config } from "../config"
import type { CardData } from "../providers/types"
import { CompactLayout } from "./layouts/compact"
import { DefaultLayout } from "./layouts/default"
import type { CardLayout, CardThemeName } from "./types"

type CardProps = {
  data: CardData
  layout: CardLayout
  themeName: CardThemeName
}

export function Card({ data, layout, themeName }: CardProps) {
  const size = config.card.sizes[layout]
  const theme = config.themes[themeName]
  const avatarClipId = layout === "compact" ? "avatarClipCompact" : "avatarClipDefault"
  const avatar = layout === "compact" ? { cx: 96, cy: 96, r: 60 } : { cx: 80, cy: 80, r: 52 }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={String(size.width)}
      height={String(size.height)}
      viewBox={`0 0 ${size.width} ${size.height}`}
      fill="none"
      role="img"
      aria-label="GitHub profile card"
    >
      <defs>
        <linearGradient id="bgGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color={theme.backgroundTop} />
          <stop offset="100%" stop-color={theme.backgroundBottom} />
        </linearGradient>
        <clipPath id={avatarClipId}>
          <circle cx={String(avatar.cx)} cy={String(avatar.cy)} r={String(avatar.r)} />
        </clipPath>
      </defs>

      <rect x="0" y="0" width={String(size.width)} height={String(size.height)} fill="url(#bgGradient)" />
      {layout === "compact" ? <CompactLayout data={data} theme={theme} /> : <DefaultLayout data={data} theme={theme} />}
    </svg>
  )
}
