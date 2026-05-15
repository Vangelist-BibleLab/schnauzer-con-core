// Shared TypeScript types for Schnauzer Con content and runtime state.

export type GameStateName = 'INTRO_DIALOGUE' | 'GAMEPLAY' | 'CUTSCENE';

export interface PaletteLabels {
  darkest: string;
  dark: string;
  light: string;
  lightest: string;
}

export interface PlayerCharacter {
  id: string;
  name: string;
  shortName: string;
  description: string;
  /** Tint or accent color label from the palette. */
  accent: keyof PaletteLabels;
}

export interface SquirrelMinionConfig {
  /** Maximum number of squirrels alive simultaneously. */
  maxAlive: number;
  /** Pixels per second wander speed. */
  speed: number;
  /** Time in seconds between direction changes. */
  wanderInterval: number;
  /** Acorns dropped per boop. */
  acornsPerBoop: number;
  /** Display name for the minions. */
  label: string;
}

export interface AntagonistConfig {
  id: string;
  name: string;
  alias: string;
  taunts: string[];
}

export interface LevelConfig {
  id: string;
  title: string;
  subtitle: string;
  acornGoal: number;
  durationSeconds: number;
  arenaWidth: number;
  arenaHeight: number;
  tileSize: number;
}

export interface DialogueLine {
  speaker: string;
  text: string;
}

export interface ControlsConfig {
  movement: string;
  flashDash: string;
  pause: string;
}

export interface PlayerMovementConfig {
  baseSpeed: number;
  flashDashSpeed: number;
  flashDashDurationMs: number;
  flashDashCooldownMs: number;
  hitboxRadius: number;
}

export interface SchnauzerGameConfig {
  title: string;
  volume: string;
  subtitle: string;
  paletteLabels: PaletteLabels;
  defaultPlayerId: string;
  players: PlayerCharacter[];
  antagonist: AntagonistConfig;
  squirrels: SquirrelMinionConfig;
  level: LevelConfig;
  player: PlayerMovementConfig;
  intro: DialogueLine[];
  victory: DialogueLine[];
  controls: ControlsConfig;
}

export interface RuntimeGameState {
  status: GameStateName;
  acorns: number;
  goal: number;
  selectedPlayerId: string;
  dialogueIndex: number;
  flashDashReady: boolean;
  timeRemaining: number;
  message: string;
}
