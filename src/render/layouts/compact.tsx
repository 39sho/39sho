import type { CardData } from "../../providers/types"
import { HeatmapSection } from "../sections/HeatmapSection"
import { HourlyCommitsSection } from "../sections/HourlyCommitsSection"
import { LanguagesSection } from "../sections/LanguagesSection"
import { ProfileSection } from "../sections/ProfileSection"
import { StatsSection } from "../sections/StatsSection"
import type { CardTheme } from "../types"

type CompactLayoutProps = {
  data: CardData
  theme: CardTheme
}

export function CompactLayout({ data, theme }: CompactLayoutProps) {
  return (
    <g>
      <rect x="24" y="24" width="852" height="1152" rx="28" fill={theme.panel} stroke={theme.frame} stroke-width="1.4" />
      <g transform="translate(50 46)">
        <ProfileSection profile={data.profile} theme={theme} compact avatarClipId="avatarClipCompact" />
        <StatsSection stats={data.stats} x={0} y={190} theme={theme} compact />
        <HeatmapSection days={data.contributionHeatmap} x={0} y={340} width={800} title={data.contributionWindowLabel} theme={theme} />
        <LanguagesSection languages={data.languages} x={0} y={560} width={800} theme={theme} compact />
        <HourlyCommitsSection
          buckets={data.hourlyCommits}
          x={0}
          y={830}
          width={800}
          height={230}
          title={data.windowLabel}
          theme={theme}
          compact
        />
      </g>
    </g>
  )
}
