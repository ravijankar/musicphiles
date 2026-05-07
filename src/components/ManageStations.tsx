import { useState } from 'react'
import type { RadioStation } from '../lib/stations'
import { makeId } from '../lib/stations'
import { useTheme } from '../contexts/ThemeContext'

interface Props {
  stations: RadioStation[]
  onChange: (stations: RadioStation[]) => void
  onClose: () => void
}

const EMPTY = { name: '', url: '' }

export default function ManageStations({ stations, onChange, onClose }: Props) {
  const { theme } = useTheme()
  const { copy } = theme
  const [editId, setEditId] = useState<string | null>(null)
  const [editFields, setEditFields] = useState(EMPTY)
  const [addFields, setAddFields] = useState(EMPTY)

  function startEdit(s: RadioStation) {
    setEditId(s.id)
    setEditFields({ name: s.name, url: s.url })
  }

  function saveEdit() {
    if (!editFields.name.trim() || !editFields.url.trim()) return
    onChange(stations.map(s => s.id === editId ? { ...s, ...editFields } : s))
    setEditId(null)
    setEditFields(EMPTY)
  }

  function cancelEdit() {
    setEditId(null)
    setEditFields(EMPTY)
  }

  function deleteStation(id: string) {
    onChange(stations.filter(s => s.id !== id))
  }

  function addStation() {
    if (!addFields.name.trim() || !addFields.url.trim()) return
    onChange([...stations, { id: makeId(), name: addFields.name.trim(), url: addFields.url.trim() }])
    setAddFields(EMPTY)
  }

  return (
    <div className="manage-stations">
      <div className="manage-header">
        <span className="manage-title">{copy.manageStations}</span>
        <button className="text-btn" onClick={onClose}>{copy.back}</button>
      </div>

      <div className="manage-list">
        {stations.map(s => (
          <div key={s.id} className="manage-row">
            {editId === s.id ? (
              <div className="edit-form">
                <input
                  className="field"
                  placeholder="Station name"
                  value={editFields.name}
                  onChange={e => setEditFields(f => ({ ...f, name: e.target.value }))}
                />
                <input
                  className="field"
                  placeholder="Stream URL"
                  value={editFields.url}
                  onChange={e => setEditFields(f => ({ ...f, url: e.target.value }))}
                />
                <div className="edit-actions">
                  <button className="action-btn save-btn" onClick={saveEdit}>save</button>
                  <button className="text-btn" onClick={cancelEdit}>cancel</button>
                </div>
              </div>
            ) : (
              <>
                <div className="manage-station-info">
                  <span className="manage-station-name">{s.name}</span>
                  <span className="manage-station-url">{s.url}</span>
                </div>
                <div className="manage-actions">
                  <button className="text-btn" onClick={() => startEdit(s)}>edit</button>
                  <button className="text-btn danger" onClick={() => deleteStation(s.id)}>delete</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <div className="add-station">
        <span className="manage-title">{copy.addStation}</span>
        <input
          className="field"
          placeholder="Station name"
          value={addFields.name}
          onChange={e => setAddFields(f => ({ ...f, name: e.target.value }))}
        />
        <input
          className="field"
          placeholder="Stream URL (https://...)"
          value={addFields.url}
          onChange={e => setAddFields(f => ({ ...f, url: e.target.value }))}
        />
        <button
          className="action-btn"
          onClick={addStation}
          disabled={!addFields.name.trim() || !addFields.url.trim()}
        >
          add station
        </button>
      </div>
    </div>
  )
}
