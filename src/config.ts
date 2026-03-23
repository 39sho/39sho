export const config = {
  github: {
    username: "39sho"
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
      backgroundTop: "#f2f6ff",
      backgroundBottom: "#c7d8f8",
      panel: "#fdfefe",
      panelMuted: "#ebf1fc",
      text: "#132540",
      textMuted: "#556786",
      accent: "#ff8a00",
      accentSoft: "#ffd8a8",
      good: "#2f9e44",
      heatmapLevels: ["#ecf1f8", "#d4f4dd", "#a7e8bc", "#65cd84", "#2f9e44"] as const
    },
    dark: {
      backgroundTop: "#0d1321",
      backgroundBottom: "#1b263b",
      panel: "#101a2b",
      panelMuted: "#1b2a43",
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
    contributionsDays: 365
  },
  cache: {
    ttlSeconds: 1800
  }
} as const

export type AppConfig = typeof config
