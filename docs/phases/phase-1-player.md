# Phase 1 — MusicPhiles Player

## Goal
A working end-to-end demo. A user can browse their music library and tune to a radio stream. Nothing else.

---

## MVP scope

- [ ] Browse Navidrome library
- [ ] Play a track
- [ ] Tune to one free radio stream
- [ ] PHIL 9000 theme
- [ ] Runs locally, no login required

Everything else is Phase 2 or later.

---

## Architecture
Frontend only. Two connections:

| Service | Purpose | API |
|---|---|---|
| **Navidrome** | Music library, metadata, playback | Subsonic API |
| **AzuraCast** | Live radio streams | AzuraCast REST API |

Configuration is two URLs in `.env`.

---

## Definition of done
A user can sit down, browse their library, pick a track, and play it. Or tune to a radio stream. PHIL 9000 aesthetic is in place. Runs on localhost with no login.

---

## What this phase explicitly excludes
- Auth / login
- Multiple themes
- Personal radio station features (Phase 2)
- HelloTape / mixtape (Phase 3)
- Any backend
- Collaborative or social features
