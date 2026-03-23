export type HeatmapDay = {
  date: string
  count: number
  level: 0 | 1 | 2 | 3 | 4
}

export type HourlyBucket = {
  hour: number
  count: number
}

export type LanguageStat = {
  name: string
  color: string
  size: number
}

export type BasicStats = {
  publicRepos: number
  followers: number
  totalStars: number
}

export type ProfileData = {
  login: string
  name: string
  bio: string
  avatarDataUrl: string
  url: string
}

export type CardData = {
  profile: ProfileData
  stats: BasicStats
  languages: LanguageStat[]
  contributionHeatmap: HeatmapDay[]
  hourlyCommits: HourlyBucket[]
  contributionWindowLabel: string
  windowLabel: string
}
