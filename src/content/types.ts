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
  /**
   * How long a booped minion stays visible (frozen in its boop pose) before
   * it despawns and frees up a respawn slot. The engine uses the longer of
   * this duration and the boop animation's natural length, so visual feedback
   * is preserved even if art is replaced later. ~150-300ms feels right.
   */
  boopVisibleMs: number;
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

// --------------------------------------------------------------------------
// Sprite + animation metadata (engine-agnostic).
//
// The engine consumes a manifest of named frames (explicit x/y/w/h in the
// source sheet) and a set of named animations that reference those frames.
// This works robustly for "labeled" sheets that have row headers, blank
// cells, and irregular spacing -- no need to assume uniform grid sizing.
//
// Authors / Lovable.dev contributors can refine first-pass coords without
// touching the engine. Future volumes can swap the manifest entirely.
// --------------------------------------------------------------------------

export interface SpriteFrame {
  /** Pixel X coordinate of the frame's top-left in the source sheet. */
  x: number;
  /** Pixel Y coordinate of the frame's top-left in the source sheet. */
  y: number;
  /** Width of the frame in pixels. */
  w: number;
  /** Height of the frame in pixels. */
  h: number;
}

export interface SpriteAnimation {
  /** Ordered list of named frames (keys in `SpriteSheetManifest.frames`). */
  frames: string[];
  /** Frames per second. Defaults to 6 if omitted. */
  frameRate?: number;
  /** Phaser repeat: -1 loops forever, 0 plays once. Defaults to -1. */
  repeat?: number;
}

export interface SpriteSheetManifest {
  /** Phaser texture key the engine will register this sheet under. */
  key: string;
  /** Path to the PNG under /public (e.g. "/sprites/schnauzer-hero.png"). */
  url: string;
  /** Map of frame name -> source rectangle. */
  frames: Record<string, SpriteFrame>;
  /** Map of animation name -> animation definition. */
  animations: Record<string, SpriteAnimation>;
  /**
   * Displayed render size in pixels. Sprites are scaled to roughly match the
   * hitbox while leaving gameplay collision/movement code untouched.
   */
  renderSize: { width: number; height: number };
  /**
   * Optional Y-pixel offset applied when drawing so the sprite "stands" on
   * the hitbox center instead of being vertically centered on it. Useful
   * when art has feet at the bottom.
   */
  renderOffsetY?: number;
}

/**
 * Per-direction animation lookup. Keys are the eight compass directions
 * plus 'idle' for the resting pose. Engine picks the closest direction
 * from the player/minion's facing vector.
 */
export type DirectionalAnimationMap = Partial<
  Record<
    'up' | 'down' | 'left' | 'right' | 'idle',
    string
  >
>;

export interface PlayerSpriteConfig {
  /** Manifest key (must exist in `sprites.sheets`). */
  sheet: string;
  /** Animation name -> direction -> animation key in the manifest. */
  walk: DirectionalAnimationMap;
  idle: DirectionalAnimationMap;
  /** Dash animation per direction. Falls back to walk if missing. */
  dash: DirectionalAnimationMap;
}

export interface MinionSpriteConfig {
  sheet: string;
  walk: DirectionalAnimationMap;
  /** Carrying-the-acorn animation. */
  stash: DirectionalAnimationMap;
  /** Boop reaction. Played once when the minion is knocked out. */
  boop: string;
}

export interface AntagonistSpriteConfig {
  sheet: string;
  /** Used in future cutscenes. Engine does not render the antagonist yet. */
  cackle?: string;
  glide?: DirectionalAnimationMap;
  walk?: DirectionalAnimationMap;
}

export interface SpritesConfig {
  /** All sprite sheets loaded by the engine, keyed by manifest key. */
  sheets: Record<string, SpriteSheetManifest>;
  player: PlayerSpriteConfig;
  minion: MinionSpriteConfig;
  antagonist?: AntagonistSpriteConfig;
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
  sprites: SpritesConfig;
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
