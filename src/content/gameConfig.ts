// Editable content for Schnauzer Con. Lovable.dev and contributors should
// modify this file (not the engine) to tweak copy, characters, and level goals.

import type { SchnauzerGameConfig, SpriteSheetManifest } from './types';

// ---------------------------------------------------------------------------
// Sprite manifests
//
// The runtime art is preprocessed into tight 48x48 cell strips by
// `scripts/extract_sprite_strips.py` -- one strip per animation, frames
// laid out horizontally with no gaps. Each strip is loaded as its own
// `SpriteSheetManifest` whose `frames` map is just `frame_0..frame_N-1`
// covering the strip end-to-end. This keeps the engine's runtime model
// (named frames + named animations) unchanged while letting us author
// animations as flat horizontal strips.
//
// To add or replace art:
//   * Drop a new strip into `public/sprites/` (or regenerate from the
//     design sheets with `python3 scripts/extract_sprite_strips.py`).
//   * Update the matching strip(s) below to match the new frame count.
// ---------------------------------------------------------------------------

const STRIP_CELL = 48;

/** Build a `SpriteSheetManifest` for a horizontal strip of `frameCount` cells. */
function strip(
  key: string,
  url: string,
  frameCount: number,
  animationName: string,
  frameRate: number,
  repeat: number
): SpriteSheetManifest {
  const frames: SpriteSheetManifest['frames'] = {};
  const frameKeys: string[] = [];
  for (let i = 0; i < frameCount; i++) {
    const name = `frame_${i}`;
    frames[name] = { x: i * STRIP_CELL, y: 0, w: STRIP_CELL, h: STRIP_CELL };
    frameKeys.push(name);
  }
  return {
    key,
    url,
    frames,
    animations: {
      [animationName]: { frames: frameKeys, frameRate, repeat },
    },
    renderSize: { width: 32, height: 32 },
    renderOffsetY: -4,
  };
}

const heroIdleDown = strip('hero_idle_down', 'sprites/hero_idle_down.png', 1, 'idle_down', 1, -1);
const heroIdleUp = strip('hero_idle_up', 'sprites/hero_idle_up.png', 1, 'idle_up', 1, -1);
const heroIdleSide = strip('hero_idle_side', 'sprites/hero_idle_side.png', 1, 'idle_side', 1, -1);
const heroWalkDown = strip('hero_walk_down', 'sprites/hero_walk_down.png', 4, 'walk_down', 8, -1);
const heroWalkUp = strip('hero_walk_up', 'sprites/hero_walk_up.png', 4, 'walk_up', 8, -1);
const heroWalkSide = strip('hero_walk_side', 'sprites/hero_walk_side.png', 3, 'walk_side', 8, -1);
const heroDash = strip('hero_dash', 'sprites/hero_dash.png', 1, 'dash', 1, 0);

const minionWalkUp = strip('minion_walk_up', 'sprites/minion_walk_up.png', 3, 'walk_up', 8, -1);
const minionWalkDown = strip('minion_walk_down', 'sprites/minion_walk_down.png', 3, 'walk_down', 8, -1);
const minionWalkSide = strip('minion_walk_side', 'sprites/minion_walk_side.png', 3, 'walk_side', 8, -1);
const minionStashUp = strip('minion_stash_up', 'sprites/minion_stash_up.png', 4, 'stash_up', 6, -1);
const minionStashDown = strip('minion_stash_down', 'sprites/minion_stash_down.png', 4, 'stash_down', 6, -1);
const minionStashSide = strip('minion_stash_side', 'sprites/minion_stash_side.png', 3, 'stash_side', 6, -1);
const minionBoop = strip('minion_boop', 'sprites/minion_boop.png', 4, 'boop', 10, 0);

const mcnuttGlideDown = strip('mcnutt_glide_down', 'sprites/mcnutt_glide_down.png', 1, 'glide_down', 1, -1);
const mcnuttGlideUp = strip('mcnutt_glide_up', 'sprites/mcnutt_glide_up.png', 3, 'glide_up', 6, -1);
const mcnuttGlideSide = strip('mcnutt_glide_side', 'sprites/mcnutt_glide_side.png', 3, 'glide_side', 6, -1);
const mcnuttCackle = strip('mcnutt_cackle', 'sprites/mcnutt_cackle.png', 4, 'cackle', 6, -1);
const mcnuttWalkUp = strip('mcnutt_walk_up', 'sprites/mcnutt_walk_up.png', 3, 'walk_up', 8, -1);
const mcnuttWalkSide = strip('mcnutt_walk_side', 'sprites/mcnutt_walk_side.png', 3, 'walk_side', 8, -1);
const mcnuttSwipe = strip('mcnutt_swipe', 'sprites/mcnutt_swipe.png', 1, 'swipe', 1, 0);

export const gameConfig: SchnauzerGameConfig = {
  title: 'Schnauzer Con',
  volume: 'Volume 1',
  subtitle: 'The Nut-Job Ruse',

  paletteLabels: {
    darkest: 'Midnight Ink',
    dark: 'Bubble Cyan',
    light: 'Bubblegum Pink',
    lightest: 'Sunshine Pop',
  },

  playerIdentity: {
    defaultPlayerCharacterId: 'pickles',
    allowPlayerRename: true,
    renamePromptLabel: 'Player name',
    renamePromptHelp:
      'Keep the default or type your own name. The story will use whatever you choose.',
    renameResetLabel: 'Use default',
  },
  players: [
    {
      id: 'pickles',
      name: 'Pickles Peppers',
      shortName: 'PCK',
      description:
        'Spry mini schnauzer. Quicker turns, snappier Flash Dash. Hates losing acorns more than baths.',
      accent: 'dark',
    },
    {
      id: 'rover',
      name: 'Rover la Flash',
      shortName: 'RLF',
      description:
        'Senior schnauzer in a satin cape. Beard like a broom, nose like a bloodhound, dash like a thunderclap.',
      accent: 'darkest',
    },
    {
      id: 'hunter',
      name: 'Hunter S. Hound',
      shortName: 'HSH',
      description:
        'Wire-haired investigator. Files dispatches between boops. Refuses to chase a squirrel without a deadline.',
      accent: 'light',
    },
  ],

  antagonist: {
    id: 'mcnutt',
    name: 'Professor McNutt',
    alias: 'The Nut-Job',
    taunts: [
      'Nobody out-nuts the Professor!',
      'My minions will scatter your stash, schnauzer.',
      'Acorns are MINE. Always have been.',
    ],
  },

  squirrels: {
    label: 'McNutt Minion',
    maxAlive: 6,
    speed: 70,
    wanderInterval: 1.4,
    acornsPerBoop: 1,
    boopVisibleMs: 240,
  },

  level: {
    id: 'level-1-backyard',
    title: 'Backyard Caper',
    subtitle: 'Recover the stolen stash',
    acornGoal: 25,
    durationSeconds: 120,
    arenaWidth: 480,
    arenaHeight: 320,
    tileSize: 16,
  },

  player: {
    baseSpeed: 110,
    flashDashSpeed: 260,
    flashDashDurationMs: 180,
    flashDashCooldownMs: 900,
    hitboxRadius: 9,
  },

  // Dialogue may use `{player}` as a placeholder for the chosen player-facing
  // name. The engine substitutes it at render time so custom names read
  // naturally. Lines spoken BY the player use speaker `{player}`.
  intro: [
    {
      speaker: 'Professor McNutt',
      text: 'Ha! Twenty-five acorns vanish from your bowl and the schnauzer suspects... a SQUIRREL? How original.',
    },
    {
      speaker: '{player}',
      text: 'McNutt. I would know that smug tail-flick anywhere. Time to ready the Flash Dash.',
    },
    {
      speaker: '{player}',
      text: 'Boop first, bark later. Let us go round up these little nut-thieves.',
    },
  ],

  victory: [
    {
      speaker: '{player}',
      text: 'Stash recovered. McNutt scampered up the oak again.',
    },
    {
      speaker: 'Professor McNutt',
      text: 'This is not over, {player}! Volume Two will bury you in shells!',
    },
  ],

  controls: {
    movement: 'Arrow keys / WASD - 8-way D-pad movement',
    flashDash: 'A button / Space - Flash Dash to boop minions',
    pause: 'B button / Esc - Pause',
  },

  sprites: {
    sheets: {
      [heroIdleDown.key]: heroIdleDown,
      [heroIdleUp.key]: heroIdleUp,
      [heroIdleSide.key]: heroIdleSide,
      [heroWalkDown.key]: heroWalkDown,
      [heroWalkUp.key]: heroWalkUp,
      [heroWalkSide.key]: heroWalkSide,
      [heroDash.key]: heroDash,
      [minionWalkUp.key]: minionWalkUp,
      [minionWalkDown.key]: minionWalkDown,
      [minionWalkSide.key]: minionWalkSide,
      [minionStashUp.key]: minionStashUp,
      [minionStashDown.key]: minionStashDown,
      [minionStashSide.key]: minionStashSide,
      [minionBoop.key]: minionBoop,
      [mcnuttGlideDown.key]: mcnuttGlideDown,
      [mcnuttGlideUp.key]: mcnuttGlideUp,
      [mcnuttGlideSide.key]: mcnuttGlideSide,
      [mcnuttCackle.key]: mcnuttCackle,
      [mcnuttWalkUp.key]: mcnuttWalkUp,
      [mcnuttWalkSide.key]: mcnuttWalkSide,
      [mcnuttSwipe.key]: mcnuttSwipe,
    },
    // Player animations reference their per-strip sheet+animation pair.
    // The engine treats `sheet` as the sheet that owns the *idle_down*
    // animation (the player's first attached sprite); other animations
    // are resolved by their key on whichever sheet defines them.
    player: {
      sheet: heroIdleDown.key,
      idle: {
        down: `${heroIdleDown.key}:idle_down`,
        up: `${heroIdleUp.key}:idle_up`,
        left: `${heroIdleSide.key}:idle_side`,
        right: `${heroIdleSide.key}:idle_side`,
      },
      walk: {
        down: `${heroWalkDown.key}:walk_down`,
        up: `${heroWalkUp.key}:walk_up`,
        left: `${heroWalkSide.key}:walk_side`,
        right: `${heroWalkSide.key}:walk_side`,
      },
      dash: {
        down: `${heroDash.key}:dash`,
        up: `${heroDash.key}:dash`,
        left: `${heroDash.key}:dash`,
        right: `${heroDash.key}:dash`,
      },
    },
    minion: {
      sheet: minionWalkDown.key,
      walk: {
        down: `${minionWalkDown.key}:walk_down`,
        up: `${minionWalkUp.key}:walk_up`,
        left: `${minionWalkSide.key}:walk_side`,
        right: `${minionWalkSide.key}:walk_side`,
      },
      stash: {
        down: `${minionStashDown.key}:stash_down`,
        up: `${minionStashUp.key}:stash_up`,
        left: `${minionStashSide.key}:stash_side`,
        right: `${minionStashSide.key}:stash_side`,
      },
      boop: `${minionBoop.key}:boop`,
    },
    antagonist: {
      sheet: mcnuttCackle.key,
      cackle: `${mcnuttCackle.key}:cackle`,
      glide: {
        down: `${mcnuttGlideDown.key}:glide_down`,
        up: `${mcnuttGlideUp.key}:glide_up`,
        left: `${mcnuttGlideSide.key}:glide_side`,
        right: `${mcnuttGlideSide.key}:glide_side`,
      },
      walk: {
        up: `${mcnuttWalkUp.key}:walk_up`,
        left: `${mcnuttWalkSide.key}:walk_side`,
        right: `${mcnuttWalkSide.key}:walk_side`,
      },
    },
  },
};

export default gameConfig;
