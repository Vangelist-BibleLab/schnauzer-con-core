# Schnauzer Con Core Engine

This repository is the **shared engine** for all Schnauzer Con games. It is a
reusable React + Vite + TypeScript + Phaser browser game runtime: an 8-bit
top-down arcade engine, a React shell that wraps the canvas, a typed
content contract, and a sprite manifest system. The engine ships with no
story of its own.

Each **Volume** of Schnauzer Con (Volume 1, Volume 2, ...) is built on top
of this engine by editing the **content layer** at
`src/content/gameConfig.ts`. The content layer supplies the Volume's
title, story, dialogue, characters, antagonist, level goal, sprite art,
and palette labels. The engine reads that config and runs the game.

The current `src/content/gameConfig.ts` in this repo ships an example
content layer (Volume 1: *The Nut-Job Ruse*). Treat it as a working
reference, not as the engine's identity — replacing it with another
Volume's content should never require engine changes.

## Engine layer vs. content layer

**Engine layer (do not edit per-Volume):**

- `src/game/SchnauzerEngine.ts` — Phaser scene, player movement, minion
  AI, collisions, scoring, state machine. Engine code reads everything
  Volume-specific from config.
- `src/components/*.tsx` — React shell (cabinet chrome, status bar,
  dialogue overlay, character select, controls guide). Generic UI driven
  by props.
- `src/content/types.ts` — the typed contract between engine and
  content. Volumes must conform to these types.
- `tailwind.config.js`, `src/styles/index.css` — the 4-token vibrant
  8-bit palette tokens (`gb-darkest`, `gb-dark`, `gb-light`,
  `gb-lightest`). Volumes can re-label these via
  `gameConfig.paletteLabels` but should keep the 4-token structure.

**Content layer (each Volume edits this):**

- `src/content/gameConfig.ts` — title, volume, subtitle, players,
  antagonist, dialogue, level (acorn goal, duration, arena size),
  controls copy, palette labels, and the sprite manifest.
- `public/sprites/` — the sprite strips referenced by the manifest in
  `gameConfig.ts`. Replace these (or add Volume-specific strips alongside)
  when a Volume swaps art.

A Volume is fully defined by what lives in `src/content/gameConfig.ts`
plus the assets under `public/sprites/`. The engine should never need to
change to ship a new Volume.

## Quick start

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production bundle into dist/
npm run preview    # serve the built bundle locally
npm run typecheck  # tsc --noEmit
npm run lint       # eslint .
```

## Project layout

```
src/
  game/
    SchnauzerEngine.ts     # Phaser scene + state machine. Engine layer.
  content/
    gameConfig.ts          # Volume content: copy, characters, goals, sprites.
    types.ts               # Typed config + runtime state contracts.
  components/
    PhaserGame.tsx         # React wrapper that mounts the engine.
    GameBoyShell.tsx       # 8-bit arcade-cabinet chrome around the canvas.
    DialogueOverlay.tsx    # INTRO_DIALOGUE / CUTSCENE overlay.
    StatusBar.tsx          # Acorns, time, flash dash readiness.
    CharacterSelect.tsx    # Player picker.
    ControlsGuide.tsx      # Controls cheat sheet.
  styles/index.css         # Tailwind + vibrant 8-bit palette tokens.
  App.tsx                  # Composes the shell, engine, and overlays.
  main.tsx                 # React entry point.
public/
  schnauzer.svg            # Pixel-art favicon in the vibrant 8-bit palette.
  sprites/                 # Sprite strips + manifest docs (see sprites/README.md).
```

## Sprites and animations

Sprite art lives under `public/sprites/` as one tight `48 x 48` strip per
animation, loaded by Phaser at boot via a **named-frame manifest**
declared in `src/content/gameConfig.ts` (`sprites.sheets`). Strips are
produced from labeled design sheets by `scripts/extract_sprite_strips.py`,
which alpha-keys the checker background, drops label text and guide
boxes, and bottom-aligns each character into a uniform cell. Strips are
committed to the repo so the script never runs in production.

The engine reads the manifest, registers frames + animations on scene
create, and picks `walk`/`idle`/`dash` (player) or `walk`/`stash`/`boop`
(minion) per facing direction. Hitboxes remain the source of collision
truth — sprites are a visual layer that follows the existing
position/radius math. See `public/sprites/README.md` for the strip
catalogue, the preprocessing pipeline, and how to swap art for a new
Volume.

## Architecture

- **Engine (`src/game/SchnauzerEngine.ts`)** owns the Phaser game
  instance, the player entity (8-way D-pad + Flash Dash), the minion
  wander AI, AABB collisions, score accounting, the timer, and the
  `INTRO_DIALOGUE → GAMEPLAY → CUTSCENE` state machine. It emits typed
  `EngineEvent`s for the React layer. The engine reads all Volume copy
  and tunables from the config it is handed at construction time — it
  has no story knowledge of its own.
- **Content (`src/content/gameConfig.ts`)** is the single source of
  truth for the current Volume: title, players, antagonist, dialogue,
  level goal and duration, controls copy, palette labels, and sprite
  manifest. This is the file each Volume's project edits.
- **React shell** wraps the canvas in an 8-bit arcade frame, status
  display, dialogue overlay, controls guide, and character selector.
  Generic and driven by props from `gameConfig`.
- **Palette** is defined both in Tailwind (`tailwind.config.js →
  colors.gb`) and in CSS variables (`src/styles/index.css`) so any
  stray color stands out.

### Vibrant 8-bit palette

| Token             | Hex       | Default label (configurable per Volume) |
| ----------------- | --------- | --------------------------------------- |
| `gb-darkest`      | `#1a1240` | Midnight Ink                            |
| `gb-dark`         | `#1fb8ff` | Bubble Cyan                             |
| `gb-light`        | `#ff4fa3` | Bubblegum Pink                          |
| `gb-lightest`     | `#ffe34a` | Sunshine Pop                            |

### Controls

- **Movement:** Arrow keys / WASD (8-way)
- **A button — Flash Dash:** Space (boops minions, drops their acorns)
- **B button — Pause:** Esc (reserved for future use)

## Working with the core engine

### For Perplexity Computer (core engine maintainer)

This repo is the engine. Treat changes here as changes that affect every
Volume that depends on it.

- Keep engine logic generic. No Volume's character names, story beats,
  or numeric tuning should appear in `src/game/` or `src/components/`.
  Drive those from `src/content/types.ts` and read them from the config
  the engine is handed.
- When extending the engine (new mechanic, new state, new sprite slot),
  add the corresponding field to `src/content/types.ts` and document it.
  Existing Volumes must still compile.
- Avoid breaking changes to the content contract in
  `src/content/types.ts`. When unavoidable, bump the version, document
  the migration, and update the example `gameConfig.ts` so Volumes can
  follow the diff.
- Always run `npm run typecheck` and `npm run build` before merging.
  Run `npm run lint` if it is fast.
- The example `gameConfig.ts` shipped here (Volume 1: *The Nut-Job
  Ruse*) is the reference content. Keep it working — it doubles as a
  smoke test for the engine.

### For Lovable projects (per-Volume game projects)

Each Volume of Schnauzer Con is its own Lovable project that uses this
repo as its engine foundation.

- Take this repo as your starting point. The engine, components, types,
  build setup, and styling are already done.
- Edit `src/content/gameConfig.ts` to define your Volume — title,
  characters, antagonist, dialogue, level goal, palette labels.
- Replace or add to the strips in `public/sprites/` for your Volume's
  art. Reference them from `sprites.sheets` in your `gameConfig.ts`.
- Do not edit files under `src/game/` or `src/components/` unless you
  are sending the change back to the core engine. If you find yourself
  needing to, the engine is missing a config knob — open an issue or PR
  against this repo instead of forking the engine.
- Keep the app frontend-only. No backend is currently required.
- Maintain the vibrant 4-token palette. Add new shades by extending
  `tailwind.config.js → theme.extend.colors.gb` rather than dropping hex
  values into components.
- Run `npm run typecheck` and `npm run build` before opening a PR.

## GitHub workflow

This repo lives at <https://github.com/Vangelist-BibleLab/schnauzer-con-core>
(private).

```bash
# first push (only if origin is not yet wired up)
git remote add origin git@github.com:Vangelist-BibleLab/schnauzer-con-core.git
git branch -M main
git push -u origin main

# day-to-day
git checkout -b feat/<topic>
git add -A
git commit -m "feat: <message>"
git push -u origin feat/<topic>
```
