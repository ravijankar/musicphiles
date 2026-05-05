# phil9

## North Star
A way to sit down at a console and listen to music with no distractions.

The enemy is the attention economy wrapped around music. Spotify, Apple Music, Amazon —
every pixel is working against the listener. phil9 is the antidote: a quiet room where
the music is the only thing. We sell the interface, not the music.

---

## What this is
A customizable web frontend for self-hosted audio. The user points it at their existing
infrastructure and gets a beautiful, distraction-free listening console. No ads. No
algorithmic billboards. No mood playlists designed to keep you scrolling. Just music,
fully under your control.

phil9 never hosts, stores, or distributes audio. Clean copyright position by design.

---

## Architecture
Frontend only. No phil9 backend in MVP. The app connects directly to two services
the user already runs:

| Service | Purpose | API |
|---|---|---|
| **Navidrome** | Music library, metadata, playback | Subsonic API |
| **AzuraCast** | Live radio streams | AzuraCast REST API |

If those two are running, phil9 plugs right in. Configuration is two URLs.

---

## Tech stack
- **Framework:** React + Vite
- **Styling:** TBD (Tailwind likely)
- **Audio:** HTML5 Audio API + Subsonic API client
- **Auth:** None for MVP (local use), subscription layer in later phases

---

## Business model
- **Free tier** — 2-3 base themes, basic config, curated public radio streams
- **Pro subscription** — all themes, full customization, streaming service widgets (Spotify etc.)
- Themes are the product. The subscription unlocks the creative layer.
- Legal position: we sell the interface, never the music

---

## Themes
Themes are the core differentiator. Not just colors — full personas with their own
layout, typography, iconography, and copy ("Transmissions" instead of "Albums").

**Flagship theme: PHIL 9000**
Retro AI console aesthetic. This is the demo that makes people say "I want that."
Reference assets are in `assets/widgets/` — hal9000.widget files and hal-radio.widget.

---

## MVP scope (Phase 1)
Get to a working end-to-end demo. Nothing else.

- [ ] Browse Navidrome library
- [ ] Play a track
- [ ] Tune to one free radio stream
- [ ] One theme (PHIL 9000 style)
- [ ] Runs locally, no login required

Everything else is Phase 2.

---

## Project management
Managed in ClickUp. Workspace: `14286037` | Space: Personal (`90144723323`)

| Folder | ID | Purpose |
|---|---|---|
| phil9 — Product | `90149126800` | Vision, user stories, roadmap |
| phil9 — Engineering | `90149126803` | Sprint backlog, integrations, bugs |
| phil9 — Design & Themes | `90149126808` | Theme work, UX research |
| phil9 — Business | `90149126812` | Subscription model, go-to-market |

Sprint Backlog list: `901416112513`

---

## Dev commands
```bash
npm run dev      # start dev server (Vite, localhost:5173)
npm run build    # production build
npm test         # run tests
```

---

## Decisions log
- Frontend-only MVP — no phil9 backend, connects directly to user's Navidrome + AzuraCast
- PHIL 9000 is the launch theme and the primary demo hook
- Target audience: self-hosters who already run Navidrome and/or AzuraCast
- Free tier uses publicly available radio streams — no licensing issues
- Subscription unlocks themes and customization, not access to music
- Git repo lives at `~/Developer/phil9` — do not use `~/discovery-radio`

Git repo lives at ~/Developer/phil9 — do not use ~/discovery-radio 