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

export interface Theme {
  id: string
  name: string
  tokens: ThemeTokens
  copy: ThemeCopy
  widgets?: import('../widgets/types').WidgetDef[]
  defaultLayout?: import('../widgets/types').LayoutItem[]
}
