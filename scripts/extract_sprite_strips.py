"""Extract clean horizontal sprite strips from the labeled design sheets.

The source sheets under /home/user/workspace/*_Sprite_Sheet.jpg are
"design" sheets with row labels, guide boxes, and irregular spacing. The
Phaser engine consumes a named-frame manifest at runtime; this script
preprocesses each source sheet into tight uniform-grid PNG strips so the
manifest can load each strip as a simple ``CELL_W x CELL_H`` Phaser
spritesheet -- no per-frame x/y bookkeeping at runtime.

Pipeline per (sheet, row band, x-range):
  1. Crop the source sheet to the row band y-range and the per-direction
     x-range (these ranges are layout constants, taken directly from the
     design sheets and listed in ``CHARACTER_LAYOUTS`` below).
  2. Within that crop, threshold to "saturated color" pixels, dilate to
     merge each sprite's parts (body, ears, tail, held acorn) into a
     single connected component, and find each component's bounding box.
  3. For each frame: drop the checker / text / outline background by
     alpha-keying low-saturation light pixels, tighten the alpha bbox,
     scale-to-fit into ``CELL_W x CELL_H`` (nearest-neighbour to keep the
     pixel-art look), and paste bottom-centered into the output strip.

Strips are written under ``public/sprites/`` and committed to the repo
so the engine never runs this preprocessing in production. The runtime
manifest in ``src/content/gameConfig.ts`` loads each strip as a uniform
sprite sheet.

Run: ``python3 scripts/extract_sprite_strips.py``.
"""
from __future__ import annotations
import os
from typing import Iterable, Sequence
from PIL import Image
import numpy as np
from scipy.ndimage import label, find_objects, binary_dilation

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC_DIR = "/home/user/workspace"
OUT_DIR = os.path.join(ROOT, "public", "sprites")
os.makedirs(OUT_DIR, exist_ok=True)

CELL_W = 48
CELL_H = 48

# Layout constants -- (y0, y1, [(x0, x1)...], max_frames, dilation, min_h)
# y/x ranges are measured directly off the source design sheets.
HERO_LAYOUT = {
    "idle_down":  (160, 335, ( 55,  450), 1, 4, 100),
    "idle_up":    (160, 335, (720, 1080), 1, 4, 100),
    "idle_side":  (160, 335, (1340, 1940), 1, 4, 100),
    "walk_down":  (530, 730, ( 55,  640), 4, 2, 120),
    "walk_up":    (530, 730, (710, 1290), 4, 2, 120),
    "walk_side":  (530, 730, (1330, 1950), 3, 2, 120),
    "dash":       (850, 1080, ( 40,  240), 1, 4, 100),
}

MINION_LAYOUT = {
    "walk_up":    (170, 320, (  45,  485), 3, 4, 50),
    "walk_down":  (170, 320, ( 680, 1130), 3, 4, 50),
    "walk_side":  (170, 320, (1330, 1940), 3, 4, 50),
    "stash_up":   (510, 720, (  45,  640), 4, 8, 80),
    "stash_down": (510, 720, ( 680, 1290), 4, 8, 80),
    "stash_side": (510, 720, (1330, 1940), 3, 6, 60),
    "boop":       (870, 1080, ( 580, 1320), 4, 6, 80),
}

MCNUTT_LAYOUT = {
    "glide_down": (180, 350, (  40,  640), 1, 4, 50),
    "glide_up":   (180, 350, ( 710, 1290), 3, 4, 50),
    "glide_side": (180, 350, (1330, 1940), 3, 4, 50),
    "cackle":     (550, 720, (  40,  640), 4, 4, 80),
    "walk_up":    (550, 720, ( 710, 1290), 3, 4, 80),
    "walk_side":  (550, 720, (1330, 1940), 3, 4, 80),
    "swipe":      (890, 1080, (  40,  300), 1, 6, 80),
}


def find_sprite_cells(
    arr: np.ndarray, y0: int, y1: int, x0: int, x1: int, min_h: int, dilation: int
) -> list[tuple[int, int, int, int]]:
    """Return cleanly cropped sprite rectangles inside a sub-region."""
    sub = arr[y0:y1, x0:x1]
    mx = sub.max(axis=2).astype(int)
    mn = sub.min(axis=2).astype(int)
    sat = mx - mn
    is_colored = sat > 40
    dilated = binary_dilation(is_colored, iterations=dilation)
    labels, _ = label(dilated)
    boxes = []
    for sl in find_objects(labels):
        if sl is None:
            continue
        sy0, sy1 = sl[0].start, sl[0].stop
        sx0, sx1 = sl[1].start, sl[1].stop
        if (sy1 - sy0) < min_h:
            continue
        if (sx1 - sx0) < 25:
            continue
        if (sx1 - sx0) > 220 or (sy1 - sy0) > 220:
            continue
        sub_color = is_colored[sy0:sy1, sx0:sx1]
        ys, xs = np.where(sub_color)
        if len(ys) == 0:
            continue
        ty0, ty1 = ys.min(), ys.max() + 1
        tx0, tx1 = xs.min(), xs.max() + 1
        boxes.append(
            (x0 + sx0 + tx0, y0 + sy0 + ty0, x0 + sx0 + tx1, y0 + sy0 + ty1)
        )
    boxes.sort(key=lambda b: b[0])
    return boxes


def split_merged_horizontally(
    box: tuple[int, int, int, int], n_pieces: int
) -> list[tuple[int, int, int, int]]:
    x0, y0, x1, y1 = box
    width = x1 - x0
    step = width // n_pieces
    return [(x0 + i * step, y0, x0 + (i + 1) * step, y1) for i in range(n_pieces)]


def render_strip(
    arr: np.ndarray, boxes: Iterable[tuple[int, int, int, int]], out_path: str
) -> int:
    """Render boxes as a horizontal strip of uniform CELL_W x CELL_H cells.

    Background (checker + text + guide-box lines) is alpha-keyed so the
    in-game sprite only shows the character pixels.
    """
    boxes = list(boxes)
    n = max(1, len(boxes))
    strip = Image.new("RGBA", (CELL_W * n, CELL_H), (0, 0, 0, 0))
    placed = 0
    for i, (x0, y0, x1, y1) in enumerate(boxes):
        crop = arr[y0:y1, x0:x1]
        mx = crop.max(axis=2).astype(int)
        mn = crop.min(axis=2).astype(int)
        sat = mx - mn
        mean = crop.mean(axis=2)
        # Background = low-saturation light pixels (checker + white outlines).
        # Outline / sprite-edge pixels are dark, so we keep them.
        is_bg = (sat < 30) & (mean > 140)
        alpha = np.where(is_bg, 0, 255).astype(np.uint8)
        rgba = np.dstack([crop, alpha])
        ys, xs = np.where(alpha > 0)
        if len(ys) == 0:
            continue
        ay0, ay1 = ys.min(), ys.max() + 1
        ax0, ax1 = xs.min(), xs.max() + 1
        tight = rgba[ay0:ay1, ax0:ax1]
        sprite = Image.fromarray(tight, "RGBA")
        max_w = CELL_W - 4
        max_h = CELL_H - 4
        scale = min(max_w / sprite.width, max_h / sprite.height)
        new_w = max(1, int(round(sprite.width * scale)))
        new_h = max(1, int(round(sprite.height * scale)))
        sprite = sprite.resize((new_w, new_h), Image.NEAREST)
        dx = i * CELL_W + (CELL_W - new_w) // 2
        dy = CELL_H - new_h - 2  # bottom-aligned so feet sit on the cell baseline
        strip.paste(sprite, (dx, dy), sprite)
        placed += 1
    strip.save(out_path)
    return placed


def extract_animation(
    arr: np.ndarray,
    layout: tuple[int, int, tuple[int, int], int, int, int],
    out_name: str,
) -> int:
    y0, y1, (x0, x1), max_frames, dilation, min_h = layout
    boxes = find_sprite_cells(arr, y0, y1, x0, x1, min_h, dilation)

    # If we found too few boxes but one is suspiciously wide, split it
    # (handles the "side" frames where adjacent character outlines touch).
    expanded: list[tuple[int, int, int, int]] = []
    for b in boxes:
        if (b[2] - b[0]) > 180 and max_frames > 1:
            expanded.extend(
                split_merged_horizontally(
                    b, min(max_frames - len(expanded), max(2, (b[2] - b[0]) // 130))
                )
            )
        else:
            expanded.append(b)

    # If we still have only one box and need more, split that single
    # box into max_frames equal pieces -- the source row really only
    # has uniformly spaced characters.
    if len(expanded) == 1 and max_frames > 1:
        expanded = split_merged_horizontally(expanded[0], max_frames)

    expanded = expanded[:max_frames]
    # Pad short strips by repeating the last available frame so a missing
    # detection never produces a 0-frame strip (the engine treats every
    # strip as a uniform spritesheet).
    if expanded:
        while len(expanded) < max_frames:
            expanded.append(expanded[-1])
    return render_strip(arr, expanded, os.path.join(OUT_DIR, out_name + ".png"))


def main() -> None:
    print("Hero sheet ->")
    arr = np.array(
        Image.open(os.path.join(SRC_DIR, "Schnauzer_Hero_Sprite_Sheet.jpg")).convert("RGB")
    )
    for anim, layout in HERO_LAYOUT.items():
        n = extract_animation(arr, layout, f"hero_{anim}")
        print(f"  hero_{anim}: {n} frames")

    print("Minion sheet ->")
    arr = np.array(
        Image.open(os.path.join(SRC_DIR, "Minion_Sprite_Sheet.jpg")).convert("RGB")
    )
    for anim, layout in MINION_LAYOUT.items():
        n = extract_animation(arr, layout, f"minion_{anim}")
        print(f"  minion_{anim}: {n} frames")

    print("McNutt sheet ->")
    arr = np.array(
        Image.open(os.path.join(SRC_DIR, "Professor_McNutt_Sprite_Sheet.jpg")).convert("RGB")
    )
    for anim, layout in MCNUTT_LAYOUT.items():
        n = extract_animation(arr, layout, f"mcnutt_{anim}")
        print(f"  mcnutt_{anim}: {n} frames")


if __name__ == "__main__":
    main()
