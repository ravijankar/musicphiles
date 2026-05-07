import { useState } from 'react'
import { loadConfig, saveConfig, type AppConfig } from '../lib/config'
import { testConnection } from '../lib/subsonic'
import { useApp } from '../contexts/AppContext'

function normaliseUrl(raw: string): string {
  const stripped = raw.replace(/\/$/, '')
  if (stripped && !/^https?:\/\//i.test(stripped)) return `http://${stripped}`
  return stripped
}

interface SettingsProps {
  onSave: () => void
}

type TestState = 'idle' | 'testing' | 'ok' | 'error'

export default function Settings({ onSave }: SettingsProps) {
  const { reloadLibrary } = useApp()
  const existing = loadConfig()
  const [url, setUrl] = useState(existing?.navidromeUrl ?? '')
  const [user, setUser] = useState(existing?.navidromeUser ?? '')
  const [pass, setPass] = useState(existing?.navidromePass ?? '')
  const [testState, setTestState] = useState<TestState>('idle')
  const [testError, setTestError] = useState('')

  const canSave = url.trim() && user.trim() && pass.trim()

  function buildConfig(): AppConfig {
    return {
      navidromeUrl: normaliseUrl(url.trim()),
      navidromeUser: user.trim(),
      navidromePass: pass,
    }
  }

  async function handleTest() {
    setTestState('testing')
    setTestError('')
    saveConfig(buildConfig())
    try {
      await testConnection()
      setTestState('ok')
    } catch (e) {
      setTestState('error')
      setTestError(String(e))
    }
  }

  function handleSave() {
    saveConfig(buildConfig())
    reloadLibrary()
    onSave()
  }

  return (
    <div className="settings">
      <div className="settings-inner">
        <h2>Connect your server</h2>
        <p className="hint" style={{ marginBottom: 28 }}>
          Point musicphiles at your Navidrome instance.
        </p>

        <div className="settings-form">
          <label className="settings-label">Navidrome URL</label>
          <input
            className="field"
            type="url"
            placeholder="http://192.168.1.x:4533"
            value={url}
            onChange={e => { setUrl(e.target.value); setTestState('idle') }}
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
          />

          <label className="settings-label">Username</label>
          <input
            className="field"
            type="text"
            placeholder="admin"
            value={user}
            onChange={e => { setUser(e.target.value); setTestState('idle') }}
            autoCapitalize="none"
            autoCorrect="off"
          />

          <label className="settings-label">Password</label>
          <input
            className="field"
            type="password"
            placeholder="••••••••"
            value={pass}
            onChange={e => { setPass(e.target.value); setTestState('idle') }}
          />

          <div className="settings-actions">
            <button
              className="text-btn"
              onClick={handleTest}
              disabled={!canSave || testState === 'testing'}
            >
              {testState === 'testing' ? 'Testing…' : 'Test connection'}
            </button>

            {testState === 'ok' && <span className="settings-status ok">✓ Connected</span>}
            {testState === 'error' && <span className="settings-status error">{testError}</span>}
          </div>

          <button className="action-btn" onClick={handleSave} disabled={!canSave} style={{ marginTop: 8 }}>
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
