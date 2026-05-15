# Schnauzer Con Sprites

This folder holds the raster sprite sheets the Phaser engine loads at
runtime. The engine never assumes a uniform sprite grid -- every animation
frame is described by an explicit `(x, y, w, h)` rectangle in
`src/content/gameConfig.ts`.

## Files

| File | Used by | Source size |
| --- | --- | --- |
| `schnauzer-hero.png` | Player schnauzer (Rover / Pickles) | 1980 x 1080 |
| `squirrel-minion.png` | McNutt minion squirrels | 1980 x 1080 |
| `professor-mcnutt.png` | Professor McNutt (cutscenes / future volumes) | 1980 x 1080 |

The PNGs are direct conversions of the original `*.jpg` labeled design
sheets. Transparency comes from alpha-on-white retained during the JPG ->
PNG conversion; if you need a tighter alpha mask, re-export the sheet
from your image editor and drop it here under the same filename.

## Sheet layout (first-pass)

Each sheet has three labeled rows. The labels and blank cells from the
source sheets are still visible -- the engine simply ignores them and
draws only the frame rectangles declared in `gameConfig.ts`.

### `schnauzer-hero.png`

- **Row 1 (`y ~= 100`) -- Idle:** front (down), back (up), side.
- **Row 2 (`y ~= 360`) -- Walk cycle:** walk down, walk up, walk side.
- **Row 3 (`y ~= 620`) -- Flash Dash action.**

Default frame size is `110 x 130` px. Displayed in-game at `36 x 42` so
the sprite roughly matches the 9 px hitbox radius without ever changing
collision logic.

### `squirrel-minion.png`

- **Row 1 (`y ~= 110`) -- The Run:** walk up, walk down, walk right.
- **Row 2 (`y ~= 380`) -- The Stash:** carrying an acorn, three facings.
- **Row 3 (`y ~= 650`) -- The Boop:** knock-out reaction.

Default frame size is `110 x 130` px; rendered at `28 x 34`.

### `professor-mcnutt.png`

- **Row 1 (`y ~= 110`) -- The Glider:** front, back, side glides.
- **Row 2 (`y ~= 380`) -- The Cackle / walk variants.**
- **Row 3 (`y ~= 650`) -- The Swipe.**

McNutt is not rendered in the main gameplay loop yet; the manifest is
loaded so future cutscenes can play `cackle` / `glide_*` without engine
changes.

## How to refine frame coordinates

The first-pass `(x, y, w, h)` values in `gameConfig.ts` were eyeballed
from the design sheets. To tighten them:

1. Open the desired sheet in any pixel editor (Aseprite, GIMP, Photoshop).
2. Read the bounding box of the cell you want to fix.
3. Update the matching entry in `src/content/gameConfig.ts` under
   `sprites.sheets.<key>.frames.<frameName>`.
4. Optional: adjust `renderSize` / `renderOffsetY` to change how the
   sprite is drawn relative to the hitbox center.

No engine code needs to change. Animations are also defined in the same
manifest -- add a new entry under `animations` and reference it from
`sprites.player`, `sprites.minion`, or `sprites.antagonist`.

## Replacing the art

Drop a new PNG into this folder under the same filename and the engine
will pick it up on the next reload. If the new art uses a different cell
layout, update the frame rectangles in `gameConfig.ts` to match.

For an entirely new volume:

1. Add new files (e.g. `schnauzer-hero-vol2.png`) here.
2. Author a new `SpriteSheetManifest` in the volume's config that points
   at those files and declares the volume's animation set.
3. Wire `sprites.player`, `sprites.minion`, `sprites.antagonist` to the
   new sheet keys. The engine reads everything from the manifest, so
   nothing in `src/game/` needs to be edited.

## Caveats

- The source sheets are JPGs with a checker-pattern background baked in.
  When drawn full-frame they look correct (the checker reads as part of
  the design layout), but tight per-frame alpha trimming would need a
  re-export from the original art.
- Frame rectangles assume the sprite is roughly centered within each
  labeled cell. Some cells in the source sheets are slightly offset; if
  a particular frame looks misaligned in-game, nudge that frame's
  `(x, y)` in `gameConfig.ts`.
- Left-facing art reuses the right-facing frames with `setFlipX(true)`,
  so the side-walk animation does not need a mirrored copy in the sheet.
