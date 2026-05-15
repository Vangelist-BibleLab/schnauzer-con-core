# Schnauzer Con: Volume 1 — The Nut-Job Ruse

A vibrant 8-bit, top-down browser caper in which **Rover** or **Pickles Peppers**
chase down **Professor McNutt's** squirrel minions to recover a stolen stash of
25 acorns. Built with React + Vite + TypeScript + Tailwind, with the game loop
running in **Phaser.js** inside a React component so Lovable.dev can manage the
surrounding UI freely.

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
    SchnauzerEngine.ts     # Phaser scene + state machine. No content lives here.
  content/
    gameConfig.ts          # Editable: copy, characters, goals, palette labels.
    types.ts               # Typed config + runtime state contracts.
  components/
    PhaserGame.tsx         # React wrapper that mounts the engine.
    GameBoyShell.tsx       # 8-bit arcade-cabinet chrome around the canvas.
    DialogueOverlay.tsx    # INTRO_DIALOGUE / CUTSCENE overlay.
    StatusBar.tsx          # Acorns, time, flash dash readiness.
    CharacterSelect.tsx    # Rover vs Pickles Peppers picker.
    ControlsGuide.tsx      # Controls cheat sheet.
  styles/index.css         # Tailwind + vibrant 8-bit palette tokens.
  App.tsx                  # Composes the shell, engine, and overlays.
  main.tsx                 # React entry point.
public/
  schnauzer.svg            # Pixel-art favicon in the vibrant 8-bit palette.
  sprites/                 # Sprite sheets + manifest docs (see sprites/README.md).
```

## Sprites and animations

Sprite art lives under `public/sprites/` as one tight `48 x 48` strip per
animation, and is loaded by Phaser at boot via a **named-frame manifest**
declared in `src/content/gameConfig.ts` (`sprites.sheets`). The runtime
strips are produced from the labeled design sheets in
`/home/user/workspace/*_Sprite_Sheet.jpg` by
`scripts/extract_sprite_strips.py`, which alpha-keys the checker
background, drops the label text and guide boxes, and bottom-aligns each
character into a uniform cell. Strips are committed to the repo, so the
script never runs in production.

The engine itself reads the manifest, registers frames + animations on
scene create, and picks `walk`/`idle`/`dash` (player) or
`walk`/`stash`/`boop` (minion) per facing direction. Hitboxes remain the
source of collision truth -- sprites are a visual layer that follows the
existing position/radius math. See `public/sprites/README.md` for the
strip catalogue, the preprocessing pipeline, and how to swap art for a
future volume.

## Architecture

- **Engine (`src/game/SchnauzerEngine.ts`)** owns the Phaser game instance, the
  player entity (8-way D-pad + Flash Dash), the squirrel wander AI, AABB
  collisions, acorn accounting, and the `INTRO_DIALOGUE → GAMEPLAY → CUTSCENE`
  state machine. It emits typed `EngineEvent`s for the React layer.
- **Content (`src/content/gameConfig.ts`)** is the single source of truth for
  copy and tunables — player names, default character, level acorn goal (25 by
  default), dialogue beats, Professor McNutt taunts, squirrel minion settings,
  and palette labels. Lovable.dev edits should live here.
- **React shell** wraps the canvas in an 8-bit arcade frame, status display,
  dialogue overlay, controls guide, and character selector.
- **Palette** is defined both in Tailwind (`tailwind.config.js → colors.gb`)
  and in CSS variables (`src/styles/index.css`) so any stray color stands out.

### Vibrant 8-bit palette

| Token             | Hex       | Label (configurable)         |
| ----------------- | --------- | ---------------------------- |
| `gb-darkest`      | `#1a1240` | Midnight Ink                 |
| `gb-dark`         | `#1fb8ff` | Bubble Cyan                  |
| `gb-light`        | `#ff4fa3` | Bubblegum Pink               |
| `gb-lightest`     | `#ffe34a` | Sunshine Pop                 |

### Controls

- **Movement:** Arrow keys / WASD (8-way)
- **A button — Flash Dash:** Space (boops squirrels, drops their acorns)
- **B button — Pause:** Esc (reserved for future use)

## Lovable.dev sync notes

- Treat `src/content/gameConfig.ts` as the editable content manifest. Adding new
  characters, dialogue beats, or tuning the acorn goal should never require
  engine changes.
- React UI components (`src/components/*.tsx`) are intentionally thin — restyle
  or rearrange them as needed, but keep `PhaserGame.tsx` mounting the engine
  exactly once.
- Keep the app frontend-only. No backend is currently required.
- Maintain the vibrant 4-token palette. Add new shades by extending
  `tailwind.config.js → theme.extend.colors.gb` rather than dropping hex values
  into components.
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
