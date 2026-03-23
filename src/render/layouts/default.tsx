import type { CardData } from "../../providers/types"
import { HeatmapSection } from "../sections/HeatmapSection"
import { HourlyCommitsSection } from "../sections/HourlyCommitsSection"
import { LanguagesSection } from "../sections/LanguagesSection"
import { ProfileSection } from "../sections/ProfileSection"
import { StatsSection } from "../sections/StatsSection"
import type { CardTheme } from "../types"

type DefaultLayoutProps = {
  data: CardData
  theme: CardTheme
}

export function DefaultLayout({ data, theme }: DefaultLayoutProps) {
  return (
    <g>
      <rect x="24" y="24" width="1152" height="672" rx="28" fill={theme.panel} stroke={theme.frame} stroke-width="1.4" />
      <g transform="translate(52 52)">
        <ProfileSection profile={data.profile} theme={theme} avatarClipId="avatarClipDefault" />
        <StatsSection stats={data.stats} x={500} y={20} theme={theme} />
        <HeatmapSection days={data.contributionHeatmap} x={0} y={176} width={740} theme={theme} title={data.contributionWindowLabel} />
        <LanguagesSection languages={data.languages} x={770} y={176} width={330} theme={theme} />
        <HourlyCommitsSection
          buckets={data.hourlyCommits}
          x={0}
          y={370}
          width={1100}
          height={220}
          title={data.windowLabel}
          theme={theme}
        />
      </g>
    </g>
  )
}
