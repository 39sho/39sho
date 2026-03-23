export const config = {
  github: {
    username: "39sho",
    excludeLanguages: [] as string[],
    excludeForksFromLanguages: true
  },
  card: {
    sizes: {
      default: {
        width: 1200,
        height: 720
      },
      compact: {
        width: 900,
        height: 1200
      }
    },
    timezone: "Asia/Tokyo",
    fontFamily: "'Trebuchet MS', 'Segoe UI', sans-serif",
    titleFontFamily: "'Avenir Next', 'Helvetica Neue', sans-serif",
    layoutParam: "layout",
    themeParam: "theme"
  },
  themes: {
    light: {
      panel: "rgba(255, 255, 255, 0.58)",
      panelMuted: "rgba(232, 240, 252, 0.78)",
      frame: "rgba(133, 154, 186, 0.42)",
      text: "#132540",
      textMuted: "#556786",
      accent: "#ff8a00",
      accentSoft: "#ffd8a8",
      good: "#2f9e44",
      heatmapLevels: ["#ecf1f8", "#d4f4dd", "#a7e8bc", "#65cd84", "#2f9e44"] as const
    },
    dark: {
      panel: "rgba(13, 17, 23, 0.42)",
      panelMuted: "rgba(33, 46, 68, 0.72)",
      frame: "rgba(111, 133, 165, 0.45)",
      text: "#e9efff",
      textMuted: "#9eb0cc",
      accent: "#ffb454",
      accentSoft: "#59452a",
      good: "#52c26d",
      heatmapLevels: ["#1b2638", "#21472d", "#2f7645", "#35a75f", "#52c26d"] as const
    }
  },
  limits: {
    maxReposForStars: 120,
    maxReposForCommitHistogram: 30,
    maxCommitPagesPerRepo: 3,
    contributionsDays: 365,
    commitHistogramDays: 90
  },
  cache: {
    ttlSeconds: 1800
  }
} as const

export type AppConfig = typeof config
