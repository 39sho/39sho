import { config } from "../config"

export type CardLayout = keyof typeof config.card.sizes
export type CardThemeName = keyof typeof config.themes
export type CardTheme = (typeof config.themes)[CardThemeName]
