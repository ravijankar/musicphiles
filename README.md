# musicphiles

**Your music. Your way.**

A distraction-free listening console for self-hosted audio. Point it at your Navidrome server and build a custom interface from live widgets — no ads, no algorithm, no noise.

---

## What it is

musicphiles is a customizable web frontend that connects directly to your existing Navidrome instance. You drag live widgets onto a canvas and arrange them however you want. The result is a personal listening console that looks and feels like yours.

The flagship theme, **PHIL 9000**, ships with a pre-built layout and a retro AI console aesthetic. It loads ready to use.

---

## Requirements

- [Navidrome](https://www.navidrome.org/) — self-hosted music server (Subsonic API)
- A modern browser

No backend. No account. No tracking.

---

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). On first launch you'll be prompted for your Navidrome URL and credentials. These are saved to `localStorage` — nothing leaves your browser.

---

## Features

- **Widget builder** — drag-and-drop canvas (96 cols / 8px rows, iPad Pro 11" dimensions)
- **Live widgets** — album browser, track list, player controls, VU meter, assignable knobs
- **Theme system** — PHIL 9000 (retro AI console) and Terminal Green included
- **Default layout** — PHIL 9000 loads with a pre-built console so the canvas isn't blank
- **Radio** — tune to hardcoded station presets (AzuraCast integration coming later)
- **No backend** — frontend-only, connects directly to Navidrome via Subsonic API

---

## Project structure

```
src/
  App.tsx                   root — tab routing + settings gate
  lib/
    subsonic.ts             Subsonic API client
    config.ts               Navidrome credentials (localStorage)
    layout.ts               widget layout persistence (per theme)
    knobs.ts                assignable knob settings
  contexts/
    AppContext.tsx           single audio element, all playback/library state
    ThemeContext.tsx         theme tokens, CSS injection, widget registration
  themes/
    phil9000.ts             PHIL 9000 theme + default layout
    terminal-green.ts       Terminal Green theme
  widgets/
    base/                   8 live widget components
  components/
    Canvas.tsx              DnD widget builder
    Settings.tsx            Navidrome config UI
```

---

## License

MIT
