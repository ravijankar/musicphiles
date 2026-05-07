const KEY = 'mph-config'

export interface AppConfig {
  navidromeUrl: string
  navidromeUser: string
  navidromePass: string
}

export function loadConfig(): AppConfig | null {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return null
}

export function saveConfig(cfg: AppConfig): void {
  localStorage.setItem(KEY, JSON.stringify(cfg))
}

export function clearConfig(): void {
  localStorage.removeItem(KEY)
}
