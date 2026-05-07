# musicphiles
## Your music. Your way.

## North Star
A way to sit down at a console and listen to music with no distractions.

The enemy is the attention economy wrapped around music. Spotify, Apple Music, Amazon —
every pixel is working against you. musicphiles is the antidote: a quiet room where the
music is the only thing.

---

## What this is
A customizable web frontend for self-hosted audio. You point it at your existing
infrastructure and it gives you a beautiful, distraction-free listening console.
We sell the interface, not the music. We never host, store, or distribute audio.

---

## Architecture
Frontend only. No musicphiles backend in MVP. The app connects directly to two services
the user already runs:

| Service | Purpose | API |
|---|---|---|
| **Navidrome** | Music library, metadata, playback | Subsonic API |
| **AzuraCast** | Live radio streams | AzuraCast REST API |

---

## Tech stack
- **Frontend:** React + Vite (TypeScript)
- **Styling:** Plain CSS custom properties (no Tailwind)
- **Audio:** HTML5 Audio API + Subsonic API client
- **DnD:** @dnd-kit/core + @dnd-kit/utilities
- **Auth:** None for MVP

---

## Business model
- **Free tier** — 2-3 base themes, basic config, public radio streams
- **Pro subscription** — all themes, full customization, Spotify widget integration
- Themes are the product. Subscriptions unlock the creative layer.
- First flagship theme: **PHIL 9000** — retro AI console aesthetic

---

## Project management
Managed in ClickUp. Workspace: `14286037` | Space: MUSICPHILES (`90145472081`)

| Folder | ID | Purpose |
|---|---|---|
| musicphiles — Product | `90149147774` | Vision, user stories, roadmap |
| musicphiles — Engineering | `90149147775` | Sprint backlog, integrations, bugs |
| musicphiles — Design & Themes | `90149147778` | Theme work, UX research |
| musicphiles — Business | `90149147785` | Subscription model, go-to-market |

Sprint Backlog list: `901416138026`

---

## Dev commands
```bash
npm run dev      # start dev server (Vite, localhost:5173)
npm run build    # production build
npm test         # run tests
```

---

## Phase 1 MVP scope
Get to a working end-to-end demo.

- [x] Browse Navidrome library
- [x] Play a track
- [x] Tune to a free radio stream
- [x] Theme system with switcher (PHIL 9000, Terminal Green)
- [x] Widget builder — drag-and-drop canvas (96 cols / 8px rows, iPad Pro 11" dimensions)
- [ ] PHIL 9000 theme fully realized (widget builder wired to actual components)
- [ ] Runs locally, no login required (config UI for Navidrome + AzuraCast URLs)

---

## Source map

```
src/
  App.tsx                         # root — tab routing (Library / Radio / Builder)
  App.css                         # all styles via CSS custom properties

  lib/
    subsonic.ts                   # Subsonic API client (Navidrome)
    stations.ts                   # radio station presets + localStorage
    layout.ts                     # widget layout persistence (per theme, localStorage)
    id.ts                         # shared makeId() utility

  contexts/
    ThemeContext.tsx               # theme state, CSS token injection, widget registration

  themes/
    types.ts                      # ThemeTokens, ThemeCopy, Theme interfaces
    registry.ts                   # theme registry + loadThemeId/saveThemeId
    phil9000.ts                   # PHIL 9000 theme definition
    terminal-green.ts             # Terminal Green theme definition

  widgets/
    types.ts                      # WidgetDef, WidgetProps, LayoutItem, DragData interfaces
    registry.ts                   # widget registry with theme-override merging + cache
    base/                         # 8 base widget shells (placeholder content)
      AlbumBrowserWidget.tsx
      TrackListWidget.tsx
      PlayerWidget.tsx
      RadioWidget.tsx
      KnobWidget.tsx
      DialWidget.tsx
      ButtonWidget.tsx
      VuMeterWidget.tsx

  components/
    Canvas.tsx                    # widget builder — DnD canvas (96-col/8px grid, 1194×834px)
    WidgetPalette.tsx             # widget palette sidebar
    AlbumList.tsx                 # album browser sidebar
    TrackList.tsx                 # track list + album header
    Player.tsx                    # fixed bottom player bar
    StationList.tsx               # radio station list
    ManageStations.tsx            # add/edit/delete stations
    ThemeSwitcher.tsx             # theme selector dropdown
    GridPreview.tsx               # dev tool — visual grid reference (not wired to nav)
```

---

## Widget builder — key facts
- Canvas: **96 columns**, **8px row height**, fixed at **1194×834px** (iPad Pro 11" landscape)
- Layout saved per theme in localStorage: key `mph-layout-{themeId}`
- No default layout — blank canvas, user builds from scratch
- Base widgets always available; themes can register additional unique widgets that override by type
- `DragData` interface enforces type safety across palette → canvas drag events

---

## Decisions log
- Frontend-only MVP — no musicphiles backend, connects directly to user's Navidrome + AzuraCast
- PHIL 9000 is the launch theme and the primary demo hook
- Tagline: "Your music. Your way."
- Target audience: self-hosters who already run Navidrome and/or AzuraCast
- Free tier uses publicly available radio streams — no licensing issues
- Subscription unlocks themes and customization, not access to music
- Styling is plain CSS with custom properties — Tailwind was considered but not adopted
- Widget builder is Phase 1 scope, not Phase 2 — it is the core differentiator
- Git repo lives at `~/Developer/MusicPhiles`
