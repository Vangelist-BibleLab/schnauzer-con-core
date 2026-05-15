# Schnauzer Con Sprites

This folder holds the runtime sprite strips the Phaser engine loads at
boot. Each strip is a tight horizontal `48 x 48` per-cell PNG containing
the frames of a single animation, with transparent background. The
runtime manifest in `src/content/gameConfig.ts` references them through
the same named-frame + named-animation API the engine has always used.

## Strips

| File | Frames | Use |
| --- | --- | --- |
| `hero_idle_down.png` / `_up.png` / `_side.png` | 1 each | Player resting pose per facing |
| `hero_walk_down.png` / `_up.png` | 4 each | Player walk cycle, facing camera / away |
| `hero_walk_side.png` | 3 | Player walk cycle, side-on (auto-flipped left) |
| `hero_dash.png` | 1 | Flash Dash pose |
| `minion_walk_up.png` / `_down.png` / `_side.png` | 3 each | Squirrel run cycle |
| `minion_stash_up.png` / `_down.png` | 4 each | Squirrel carrying an acorn |
| `minion_stash_side.png` | 3 | Squirrel carrying an acorn, side-on |
| `minion_boop.png` | 4 | Knockout reaction (plays once, sprite fades) |
| `mcnutt_glide_*.png` / `_cackle.png` / `_walk_*.png` / `_swipe.png` | 1-4 | Loaded for future cutscenes; not rendered in the main loop yet |

Every strip is `48 px tall` and `48 * frameCount px wide`. Frames are
laid out left-to-right with no gutter -- this is exactly what Phaser's
`load.spritesheet` expects, so the engine doesn't need per-frame
bookkeeping at runtime.

## Where the strips come from

The original design sheets at
`/home/user/workspace/{Schnauzer_Hero,Minion,Professor_McNutt}_Sprite_Sheet.jpg`
are 1980 x 1080 labeled JPGs with row headers (`ROW 1: IDLE`, etc.),
guide-box outlines, and irregular cell spacing. They are great for art
review but terrible to feed straight to Phaser -- exactly what shipped
the first time, when garbled label fragments like `"ONT"` appeared in
the playfield.

`scripts/extract_sprite_strips.py` solves that by preprocessing each
design sheet into the strips listed above:

1. **Crop** to a known row band and a known per-direction x range
   (`HERO_LAYOUT`, `MINION_LAYOUT`, `MCNUTT_LAYOUT` in the script).
2. **Detect** each character's bounding box by thresholding saturated-
   color pixels and dilating to merge body / ears / tail / held acorn
   into a single connected component.
3. **Alpha-key** the checker background, white margins, and outline
   guides so only the colored character pixels survive.
4. **Scale-fit** each frame into a `48 x 48` cell (nearest-neighbour to
   preserve the pixel-art look) and bottom-align so feet sit on the
   cell baseline.
5. **Pad** short strips by repeating the last detected frame, so the
   engine never has to handle a 0-frame animation.

Strips are committed to the repo, so this script does not run in
production -- it is only re-run when an artist refreshes a source
sheet.

## Regenerating after an art update

```bash
python3 scripts/extract_sprite_strips.py
```

Requires `Pillow`, `numpy`, and `scipy`. The script writes only the PNG
files in this folder. If the new sheet has a different row layout, edit
the per-row `(y0, y1, (x0, x1), max_frames, dilation, min_h)` tuples in
the script's `*_LAYOUT` dicts -- nothing in `src/game/` needs to change.

## Swapping art for a new volume

1. Drop a new strip into this folder (e.g. `vol2_hero_walk_down.png`)
   matching the `48 x 48 x N` layout.
2. Reference it from a `SpriteSheetManifest` in that volume's
   `gameConfig` (use the existing `strip()` helper as a template).
3. Wire the manifest into `sprites.player.walk.down` / etc. The engine
   reads everything from the manifest, so no engine edits are needed.

## Caveats

- The first-pass strips were generated programmatically from labeled
  design sheets, not hand-cropped by an artist. A pixel artist re-cut
  for tighter alpha trimming or per-direction shading would slot in
  here without engine changes.
- Side animations use a single right-facing strip and `setFlipX(true)`
  for left-facing. If an artist later draws an explicit left strip, add
  a `walk_left` entry to the manifest and the engine will use it
  automatically (the directional resolver only flips when the requested
  direction is missing).
- The vibrant 8-bit palette in `tailwind.config.js` and the engine's
  background/overlay layers is untouched. Sprite art carries its own
  source colors (cyan-pink schnauzer, brown squirrels, orange McNutt),
  which sit cleanly on top of the sunny-yellow grass.
