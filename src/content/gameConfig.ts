// Editable content for Schnauzer Con. Lovable.dev and contributors should
// modify this file (not the engine) to tweak copy, characters, and level goals.

import type { SchnauzerGameConfig } from './types';

export const gameConfig: SchnauzerGameConfig = {
  title: 'Schnauzer Con',
  volume: 'Volume 1',
  subtitle: 'The Nut-Job Ruse',

  paletteLabels: {
    darkest: 'Walnut Shell',
    dark: 'Mossy Bark',
    light: 'Lawn Sprig',
    lightest: 'Sunlit Hedge',
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
};

export default gameConfig;
