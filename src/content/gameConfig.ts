// Editable content for Schnauzer Con. Lovable.dev and contributors should
// modify this file (not the engine) to tweak copy, characters, and level goals.

import type { SchnauzerGameConfig, SpriteSheetManifest } from './types';

// ---------------------------------------------------------------------------
// Sprite manifests
//
// All three source sheets are 1980x1080 with three labeled rows. The art is
// not arranged on a tight uniform grid -- each row has labels, blank cells,
// and slightly different column counts -- so we encode frames as explicit
// (x, y, w, h) rectangles instead of relying on Phaser's spritesheet
// (frameWidth/frameHeight) loader.
//
// These coordinates are FIRST-PASS ESTIMATES picked by eye from the source
// sheets. Public/sprites/README.md documents the layout so an artist or a
// future maintainer can refine the numbers without touching the engine.
//
// To tune a frame: open the sheet in any image editor, read the bounding
// box of the desired sprite cell, and update the matching entry below.
// ---------------------------------------------------------------------------

// Approximate row Y centers in the schnauzer sheet.
const HERO_ROW_Y = { idle: 100, walk: 360, dash: 620 };
const MINION_ROW_Y = { run: 110, stash: 380, boop: 650 };
const MCNUTT_ROW_Y = { glide: 110, cackle: 380, swipe: 650 };

const HERO_FRAME = { w: 110, h: 130 };
const MINION_FRAME = { w: 110, h: 130 };
const MCNUTT_FRAME = { w: 110, h: 130 };

const schnauzerHeroSheet: SpriteSheetManifest = {
  key: 'schnauzer-hero',
  url: 'sprites/schnauzer-hero.png',
  renderSize: { width: 36, height: 42 },
  renderOffsetY: -4,
  frames: {
    // Row 1: idle poses (front / back / side).
    idle_down_a: { x: 90, y: HERO_ROW_Y.idle, ...HERO_FRAME },
    idle_down_b: { x: 220, y: HERO_ROW_Y.idle, ...HERO_FRAME },
    idle_down_c: { x: 350, y: HERO_ROW_Y.idle, ...HERO_FRAME },
    idle_up_a: { x: 760, y: HERO_ROW_Y.idle, ...HERO_FRAME },
    idle_up_b: { x: 890, y: HERO_ROW_Y.idle, ...HERO_FRAME },
    idle_up_c: { x: 1020, y: HERO_ROW_Y.idle, ...HERO_FRAME },
    idle_side_a: { x: 1430, y: HERO_ROW_Y.idle, ...HERO_FRAME },
    idle_side_b: { x: 1560, y: HERO_ROW_Y.idle, ...HERO_FRAME },
    idle_side_c: { x: 1690, y: HERO_ROW_Y.idle, ...HERO_FRAME },

    // Row 2: walk cycles.
    walk_down_a: { x: 90, y: HERO_ROW_Y.walk, ...HERO_FRAME },
    walk_down_b: { x: 220, y: HERO_ROW_Y.walk, ...HERO_FRAME },
    walk_down_c: { x: 350, y: HERO_ROW_Y.walk, ...HERO_FRAME },
    walk_down_d: { x: 480, y: HERO_ROW_Y.walk, ...HERO_FRAME },
    walk_up_a: { x: 760, y: HERO_ROW_Y.walk, ...HERO_FRAME },
    walk_up_b: { x: 890, y: HERO_ROW_Y.walk, ...HERO_FRAME },
    walk_up_c: { x: 1020, y: HERO_ROW_Y.walk, ...HERO_FRAME },
    walk_up_d: { x: 1150, y: HERO_ROW_Y.walk, ...HERO_FRAME },
    walk_side_a: { x: 1430, y: HERO_ROW_Y.walk, ...HERO_FRAME },
    walk_side_b: { x: 1560, y: HERO_ROW_Y.walk, ...HERO_FRAME },
    walk_side_c: { x: 1690, y: HERO_ROW_Y.walk, ...HERO_FRAME },

    // Row 3: flash dash.
    dash_a: { x: 90, y: HERO_ROW_Y.dash, ...HERO_FRAME },
  },
  animations: {
    idle_down: { frames: ['idle_down_a'], frameRate: 1, repeat: -1 },
    idle_up: { frames: ['idle_up_a'], frameRate: 1, repeat: -1 },
    idle_side: { frames: ['idle_side_a'], frameRate: 1, repeat: -1 },
    walk_down: {
      frames: ['walk_down_a', 'walk_down_b', 'walk_down_c', 'walk_down_d'],
      frameRate: 8,
      repeat: -1,
    },
    walk_up: {
      frames: ['walk_up_a', 'walk_up_b', 'walk_up_c', 'walk_up_d'],
      frameRate: 8,
      repeat: -1,
    },
    walk_side: {
      frames: ['walk_side_a', 'walk_side_b', 'walk_side_c'],
      frameRate: 8,
      repeat: -1,
    },
    dash: { frames: ['dash_a'], frameRate: 1, repeat: 0 },
  },
};

const squirrelMinionSheet: SpriteSheetManifest = {
  key: 'squirrel-minion',
  url: 'sprites/squirrel-minion.png',
  renderSize: { width: 28, height: 34 },
  renderOffsetY: -2,
  frames: {
    // Row 1: run cycle (walk up / walk down / walk right).
    run_up_a: { x: 90, y: MINION_ROW_Y.run, ...MINION_FRAME },
    run_up_b: { x: 220, y: MINION_ROW_Y.run, ...MINION_FRAME },
    run_up_c: { x: 350, y: MINION_ROW_Y.run, ...MINION_FRAME },
    run_down_a: { x: 620, y: MINION_ROW_Y.run, ...MINION_FRAME },
    run_down_b: { x: 750, y: MINION_ROW_Y.run, ...MINION_FRAME },
    run_down_c: { x: 880, y: MINION_ROW_Y.run, ...MINION_FRAME },
    run_side_a: { x: 1280, y: MINION_ROW_Y.run, ...MINION_FRAME },
    run_side_b: { x: 1410, y: MINION_ROW_Y.run, ...MINION_FRAME },
    run_side_c: { x: 1540, y: MINION_ROW_Y.run, ...MINION_FRAME },

    // Row 2: stash carrying.
    stash_up_a: { x: 90, y: MINION_ROW_Y.stash, ...MINION_FRAME },
    stash_up_b: { x: 220, y: MINION_ROW_Y.stash, ...MINION_FRAME },
    stash_up_c: { x: 350, y: MINION_ROW_Y.stash, ...MINION_FRAME },
    stash_up_d: { x: 480, y: MINION_ROW_Y.stash, ...MINION_FRAME },
    stash_down_a: { x: 620, y: MINION_ROW_Y.stash, ...MINION_FRAME },
    stash_down_b: { x: 750, y: MINION_ROW_Y.stash, ...MINION_FRAME },
    stash_down_c: { x: 880, y: MINION_ROW_Y.stash, ...MINION_FRAME },
    stash_down_d: { x: 1010, y: MINION_ROW_Y.stash, ...MINION_FRAME },
    stash_side_a: { x: 1280, y: MINION_ROW_Y.stash, ...MINION_FRAME },
    stash_side_b: { x: 1410, y: MINION_ROW_Y.stash, ...MINION_FRAME },
    stash_side_c: { x: 1540, y: MINION_ROW_Y.stash, ...MINION_FRAME },

    // Row 3: boop reaction.
    boop_a: { x: 90, y: MINION_ROW_Y.boop, ...MINION_FRAME },
    boop_b: { x: 350, y: MINION_ROW_Y.boop, ...MINION_FRAME },
    boop_c: { x: 480, y: MINION_ROW_Y.boop, ...MINION_FRAME },
  },
  animations: {
    walk_up: {
      frames: ['run_up_a', 'run_up_b', 'run_up_c'],
      frameRate: 8,
      repeat: -1,
    },
    walk_down: {
      frames: ['run_down_a', 'run_down_b', 'run_down_c'],
      frameRate: 8,
      repeat: -1,
    },
    walk_side: {
      frames: ['run_side_a', 'run_side_b', 'run_side_c'],
      frameRate: 8,
      repeat: -1,
    },
    stash_up: {
      frames: ['stash_up_a', 'stash_up_b', 'stash_up_c', 'stash_up_d'],
      frameRate: 6,
      repeat: -1,
    },
    stash_down: {
      frames: ['stash_down_a', 'stash_down_b', 'stash_down_c', 'stash_down_d'],
      frameRate: 6,
      repeat: -1,
    },
    stash_side: {
      frames: ['stash_side_a', 'stash_side_b', 'stash_side_c'],
      frameRate: 6,
      repeat: -1,
    },
    boop: {
      frames: ['boop_a', 'boop_b', 'boop_c'],
      frameRate: 10,
      repeat: 0,
    },
  },
};

const professorMcnuttSheet: SpriteSheetManifest = {
  key: 'professor-mcnutt',
  url: 'sprites/professor-mcnutt.png',
  renderSize: { width: 36, height: 42 },
  renderOffsetY: -4,
  frames: {
    glide_down_a: { x: 90, y: MCNUTT_ROW_Y.glide, ...MCNUTT_FRAME },
    glide_up_a: { x: 480, y: MCNUTT_ROW_Y.glide, ...MCNUTT_FRAME },
    glide_up_b: { x: 610, y: MCNUTT_ROW_Y.glide, ...MCNUTT_FRAME },
    glide_up_c: { x: 740, y: MCNUTT_ROW_Y.glide, ...MCNUTT_FRAME },
    glide_side_a: { x: 1280, y: MCNUTT_ROW_Y.glide, ...MCNUTT_FRAME },
    glide_side_b: { x: 1410, y: MCNUTT_ROW_Y.glide, ...MCNUTT_FRAME },
    glide_side_c: { x: 1540, y: MCNUTT_ROW_Y.glide, ...MCNUTT_FRAME },

    cackle_a: { x: 90, y: MCNUTT_ROW_Y.cackle, ...MCNUTT_FRAME },
    cackle_b: { x: 220, y: MCNUTT_ROW_Y.cackle, ...MCNUTT_FRAME },
    cackle_c: { x: 350, y: MCNUTT_ROW_Y.cackle, ...MCNUTT_FRAME },
    cackle_d: { x: 480, y: MCNUTT_ROW_Y.cackle, ...MCNUTT_FRAME },
    walk_back_a: { x: 620, y: MCNUTT_ROW_Y.cackle, ...MCNUTT_FRAME },
    walk_back_b: { x: 750, y: MCNUTT_ROW_Y.cackle, ...MCNUTT_FRAME },
    walk_back_c: { x: 880, y: MCNUTT_ROW_Y.cackle, ...MCNUTT_FRAME },
    walk_side_a: { x: 1280, y: MCNUTT_ROW_Y.cackle, ...MCNUTT_FRAME },
    walk_side_b: { x: 1410, y: MCNUTT_ROW_Y.cackle, ...MCNUTT_FRAME },
    walk_side_c: { x: 1540, y: MCNUTT_ROW_Y.cackle, ...MCNUTT_FRAME },

    swipe_a: { x: 90, y: MCNUTT_ROW_Y.swipe, ...MCNUTT_FRAME },
  },
  animations: {
    cackle: {
      frames: ['cackle_a', 'cackle_b', 'cackle_c', 'cackle_d'],
      frameRate: 6,
      repeat: -1,
    },
    glide_down: { frames: ['glide_down_a'], frameRate: 1, repeat: -1 },
    glide_up: {
      frames: ['glide_up_a', 'glide_up_b', 'glide_up_c'],
      frameRate: 6,
      repeat: -1,
    },
    glide_side: {
      frames: ['glide_side_a', 'glide_side_b', 'glide_side_c'],
      frameRate: 6,
      repeat: -1,
    },
    walk_up: {
      frames: ['walk_back_a', 'walk_back_b', 'walk_back_c'],
      frameRate: 8,
      repeat: -1,
    },
    walk_side: {
      frames: ['walk_side_a', 'walk_side_b', 'walk_side_c'],
      frameRate: 8,
      repeat: -1,
    },
    swipe: { frames: ['swipe_a'], frameRate: 1, repeat: 0 },
  },
};

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

  defaultPlayerId: 'rover',
  players: [
    {
      id: 'rover',
      name: 'Rover',
      shortName: 'ROV',
      description:
        'Senior schnauzer. Beard like a broom, nose like a bloodhound. Has chased Professor McNutt across three backyards.',
      accent: 'darkest',
    },
    {
      id: 'pickles',
      name: 'Pickles Peppers',
      shortName: 'PCK',
      description:
        'Spry mini schnauzer. Quicker turns, snappier Flash Dash. Hates losing acorns more than baths.',
      accent: 'dark',
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

  intro: [
    {
      speaker: 'Professor McNutt',
      text: 'Ha! Twenty-five acorns vanish from your bowl and the schnauzer suspects... a SQUIRREL? How original.',
    },
    {
      speaker: 'Rover',
      text: 'McNutt. I would know that smug tail-flick anywhere. Pickles, ready the Flash Dash.',
    },
    {
      speaker: 'Pickles Peppers',
      text: 'Boop first, bark later. Let us go round up these little nut-thieves.',
    },
  ],

  victory: [
    {
      speaker: 'Rover',
      text: 'Stash recovered. McNutt scampered up the oak again.',
    },
    {
      speaker: 'Professor McNutt',
      text: 'This is not over, schnauzers! Volume Two will bury you in shells!',
    },
  ],

  controls: {
    movement: 'Arrow keys / WASD - 8-way D-pad movement',
    flashDash: 'A button / Space - Flash Dash to boop minions',
    pause: 'B button / Esc - Pause',
  },

  sprites: {
    sheets: {
      'schnauzer-hero': schnauzerHeroSheet,
      'squirrel-minion': squirrelMinionSheet,
      'professor-mcnutt': professorMcnuttSheet,
    },
    player: {
      sheet: 'schnauzer-hero',
      idle: {
        down: 'idle_down',
        up: 'idle_up',
        left: 'idle_side',
        right: 'idle_side',
      },
      walk: {
        down: 'walk_down',
        up: 'walk_up',
        left: 'walk_side',
        right: 'walk_side',
      },
      dash: {
        down: 'dash',
        up: 'dash',
        left: 'dash',
        right: 'dash',
      },
    },
    minion: {
      sheet: 'squirrel-minion',
      walk: {
        down: 'walk_down',
        up: 'walk_up',
        left: 'walk_side',
        right: 'walk_side',
      },
      stash: {
        down: 'stash_down',
        up: 'stash_up',
        left: 'stash_side',
        right: 'stash_side',
      },
      boop: 'boop',
    },
    antagonist: {
      sheet: 'professor-mcnutt',
      cackle: 'cackle',
      glide: {
        down: 'glide_down',
        up: 'glide_up',
        left: 'glide_side',
        right: 'glide_side',
      },
      walk: {
        up: 'walk_up',
        left: 'walk_side',
        right: 'walk_side',
      },
    },
  },
};

export default gameConfig;
