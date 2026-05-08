import type { WidgetDef, LayoutItem } from '../widgets/types'

export interface ThemeTokens {
  bg: string
  surface: string
  surface2: string
  border: string
  text: string
  muted: string
  accent: string
  fontFamily: string
  fontSize: string
}

export interface ThemeCopy {
  library: string
  radio: string
  selectAlbum: string
  manage: string
  live: string
  nothingPlaying: string
  manageStations: string
  addStation: string
  back: string
  noStations: string
}

export interface Variant {
  id: string
  name: string
  tokens: ThemeTokens
}

// Kept so any residual import of Palette still compiles
export type Palette = Variant

export interface Skin {
  id: string
  name: string
  copy: ThemeCopy
  variants: Variant[]
  widgets?: WidgetDef[]
  defaultLayout?: LayoutItem[]
}

// Resolved combination — what the rest of the app consumes via useTheme()
export interface Theme {
  id: string        // skin.id
  name: string      // skin.name
  tokens: ThemeTokens
  copy: ThemeCopy
  widgets?: WidgetDef[]
  defaultLayout?: LayoutItem[]
  variantId: string
  skinId: string
}
