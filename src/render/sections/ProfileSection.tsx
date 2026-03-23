import { config } from "../../config"
import type { ProfileData } from "../../providers/types"
import type { CardTheme } from "../types"
import { truncate } from "../utils"

type ProfileSectionProps = {
  profile: ProfileData
  theme: CardTheme
  compact?: boolean
  avatarClipId?: string
}

export function ProfileSection({ profile, theme, compact = false, avatarClipId = "avatarClip" }: ProfileSectionProps) {
  const avatarCx = compact ? 96 : 80
  const avatarCy = compact ? 96 : 80
  const avatarR = compact ? 60 : 52
  const imageSize = compact ? 120 : 104
  const imageOffset = compact ? 36 : 28
  const nameX = compact ? 190 : 160
  const nameY = compact ? 72 : 64
  const handleY = compact ? 110 : 96
  const bioY = compact ? 156 : 132
  const maxName = compact ? 24 : 26
  const maxBio = compact ? 58 : 64

  return (
    <g>
      <circle cx={avatarCx} cy={avatarCy} r={avatarR} fill={theme.panelMuted} />
      <image
        href={profile.avatarUrl}
        x={imageOffset}
        y={imageOffset}
        width={imageSize}
        height={imageSize}
        clip-path={`url(#${avatarClipId})`}
      />
      <text x={nameX} y={nameY} font-size={compact ? "38" : "34"} font-family={config.card.titleFontFamily} fill={theme.text} font-weight="700">
        {truncate(profile.name, maxName)}
      </text>
      <text x={nameX} y={handleY} font-size={compact ? "22" : "20"} font-family={config.card.fontFamily} fill={theme.textMuted}>
        @{profile.login}
      </text>
      <text x={nameX} y={bioY} font-size={compact ? "21" : "18"} font-family={config.card.fontFamily} fill={theme.text}>
        {truncate(profile.bio, maxBio)}
      </text>
    </g>
  )
}
