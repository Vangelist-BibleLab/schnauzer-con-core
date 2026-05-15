// SchnauzerEngine.ts
// Modular Phaser engine for Schnauzer Con: Volume 1 - The Nut-Job Ruse.
// The engine knows nothing about specific copy or character names -- those
// come from `gameConfig` so Lovable.dev can tweak content without touching
// the game loop.

import Phaser from 'phaser';
import type {
  GameStateName,
  RuntimeGameState,
  SchnauzerGameConfig,
} from '@/content/types';

export type EngineEvent =
  | { type: 'STATE_CHANGE'; payload: GameStateName }
  | { type: 'ACORN'; payload: number }
  | { type: 'FLASH_READY'; payload: boolean }
  | { type: 'TIME'; payload: number }
  | { type: 'DIALOGUE'; payload: number }
  | { type: 'MESSAGE'; payload: string };

export type EngineListener = (event: EngineEvent) => void;

// --------------------------------------------------------------------------
// Game Boy palette (kept here as numeric ints for Phaser graphics calls).
// The CSS layer mirrors these as hex strings in tailwind.config.js.
// --------------------------------------------------------------------------
const PALETTE = {
  darkest: 0x0f380f,
  dark: 0x306230,
  light: 0x8bac0f,
  lightest: 0x9bbc0f,
};

// --------------------------------------------------------------------------
// Internal entity shapes -- intentionally small (no Phaser sprites required).
// Simple AABB collision against circle hitboxes keeps the engine snappy.
// --------------------------------------------------------------------------
interface PlayerEntity {
  x: number;
  y: number;
  vx: number;
  vy: number;
  facing: { x: number; y: number };
  flashing: boolean;
  flashUntil: number;
  flashCooldownUntil: number;
  radius: number;
}

interface SquirrelEntity {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  nextTurnAt: number;
  radius: number;
  alive: boolean;
}

// --------------------------------------------------------------------------
// The single Phaser Scene driving the whole game.
// --------------------------------------------------------------------------
class SchnauzerScene extends Phaser.Scene {
  private config!: SchnauzerGameConfig;
  private emit!: (event: EngineEvent) => void;
  private getStatus!: () => GameStateName;

  private player!: PlayerEntity;
  private squirrels: SquirrelEntity[] = [];
  private squirrelIdCounter = 0;

  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keys!: {
    W: Phaser.Input.Keyboard.Key;
    A: Phaser.Input.Keyboard.Key;
    S: Phaser.Input.Keyboard.Key;
    D: Phaser.Input.Keyboard.Key;
    SPACE: Phaser.Input.Keyboard.Key;
    ESC: Phaser.Input.Keyboard.Key;
  };

  private gfx!: Phaser.GameObjects.Graphics;

  private acorns = 0;
  private goal = 25;
  private timeRemainingMs = 120_000;
  private nextSpawnAt = 0;

  init(data: {
    config: SchnauzerGameConfig;
    emit: (event: EngineEvent) => void;
    getStatus: () => GameStateName;
  }) {
    this.config = data.config;
    this.emit = data.emit;
    this.getStatus = data.getStatus;
    this.goal = this.config.level.acornGoal;
    this.timeRemainingMs = this.config.level.durationSeconds * 1000;
  }

  create() {
    const { arenaWidth, arenaHeight } = this.config.level;

    this.cameras.main.setBackgroundColor(PALETTE.lightest);
    this.cameras.main.setBounds(0, 0, arenaWidth, arenaHeight);

    this.gfx = this.add.graphics();

    // Keyboard input -- D-pad maps to arrows + WASD; A button maps to SPACE.
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.keys = {
      W: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      A: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      S: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      D: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      SPACE: this.input.keyboard!.addKey(
        Phaser.Input.Keyboard.KeyCodes.SPACE
      ),
      ESC: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ESC),
    };

    this.player = {
      x: arenaWidth / 2,
      y: arenaHeight / 2,
      vx: 0,
      vy: 0,
      facing: { x: 0, y: 1 },
      flashing: false,
      flashUntil: 0,
      flashCooldownUntil: 0,
      radius: this.config.player.hitboxRadius,
    };

    this.squirrels = [];
    this.spawnSquirrels(this.config.squirrels.maxAlive);
    this.nextSpawnAt = this.time.now + 2500;
  }

  update(time: number, delta: number) {
    // Phaser may tick update() once before init/create finish wiring config.
    if (!this.config || !this.player) return;

    // Only run gameplay logic while the state machine is in GAMEPLAY.
    if (this.getStatus() !== 'GAMEPLAY') {
      this.render();
      return;
    }

    this.updatePlayer(time, delta);
    this.updateSquirrels(time, delta);
    this.handleCollisions();
    this.updateTimer(delta);
    this.maybeRespawn(time);
    this.render();

    if (this.acorns >= this.goal) {
      this.emit({ type: 'MESSAGE', payload: 'Stash recovered!' });
      this.emit({ type: 'STATE_CHANGE', payload: 'CUTSCENE' });
    } else if (this.timeRemainingMs <= 0) {
      this.emit({
        type: 'MESSAGE',
        payload: 'McNutt got away. Try again, schnauzer.',
      });
      this.emit({ type: 'STATE_CHANGE', payload: 'CUTSCENE' });
    }
  }

  // ----------------------------------------------------------------------
  // Player movement: 8-way D-pad style with normalized diagonals and a
  // Flash Dash burst on Space / A.
  // ----------------------------------------------------------------------
  private updatePlayer(time: number, deltaMs: number) {
    const dt = deltaMs / 1000;
    const cfg = this.config.player;

    let dx = 0;
    let dy = 0;
    if (this.cursors.left.isDown || this.keys.A.isDown) dx -= 1;
    if (this.cursors.right.isDown || this.keys.D.isDown) dx += 1;
    if (this.cursors.up.isDown || this.keys.W.isDown) dy -= 1;
    if (this.cursors.down.isDown || this.keys.S.isDown) dy += 1;

    if (dx !== 0 || dy !== 0) {
      const len = Math.hypot(dx, dy);
      const nx = dx / len;
      const ny = dy / len;
      this.player.facing = { x: nx, y: ny };

      const flashing = this.player.flashing && time < this.player.flashUntil;
      const speed = flashing ? cfg.flashDashSpeed : cfg.baseSpeed;
      this.player.vx = nx * speed;
      this.player.vy = ny * speed;
    } else {
      this.player.vx = 0;
      this.player.vy = 0;
    }

    // Trigger Flash Dash
    if (
      Phaser.Input.Keyboard.JustDown(this.keys.SPACE) &&
      time >= this.player.flashCooldownUntil
    ) {
      this.player.flashing = true;
      this.player.flashUntil = time + cfg.flashDashDurationMs;
      this.player.flashCooldownUntil = time + cfg.flashDashCooldownMs;
      this.emit({ type: 'FLASH_READY', payload: false });
    }

    if (this.player.flashing && time >= this.player.flashUntil) {
      this.player.flashing = false;
    }

    if (
      !this.player.flashing &&
      time >= this.player.flashCooldownUntil &&
      this.player.flashCooldownUntil !== 0
    ) {
      // Emit a single FLASH_READY=true edge when cooldown elapses.
      // Setting cooldownUntil back to 0 keeps this from re-firing every frame.
      this.player.flashCooldownUntil = 0;
      this.emit({ type: 'FLASH_READY', payload: true });
    }

    this.player.x += this.player.vx * dt;
    this.player.y += this.player.vy * dt;

    // Clamp to arena.
    const { arenaWidth, arenaHeight } = this.config.level;
    this.player.x = Phaser.Math.Clamp(
      this.player.x,
      this.player.radius,
      arenaWidth - this.player.radius
    );
    this.player.y = Phaser.Math.Clamp(
      this.player.y,
      this.player.radius,
      arenaHeight - this.player.radius
    );
  }

  // ----------------------------------------------------------------------
  // Squirrel wander AI: pick a random direction, hold it for `wanderInterval`
  // seconds, bounce off arena walls.
  // ----------------------------------------------------------------------
  private updateSquirrels(time: number, deltaMs: number) {
    const dt = deltaMs / 1000;
    const { speed, wanderInterval } = this.config.squirrels;
    const { arenaWidth, arenaHeight } = this.config.level;

    for (const s of this.squirrels) {
      if (!s.alive) continue;

      if (time >= s.nextTurnAt) {
        const angle = Math.random() * Math.PI * 2;
        s.vx = Math.cos(angle) * speed;
        s.vy = Math.sin(angle) * speed;
        s.nextTurnAt = time + wanderInterval * 1000;
      }

      s.x += s.vx * dt;
      s.y += s.vy * dt;

      if (s.x < s.radius) {
        s.x = s.radius;
        s.vx = Math.abs(s.vx);
      } else if (s.x > arenaWidth - s.radius) {
        s.x = arenaWidth - s.radius;
        s.vx = -Math.abs(s.vx);
      }
      if (s.y < s.radius) {
        s.y = s.radius;
        s.vy = Math.abs(s.vy);
      } else if (s.y > arenaHeight - s.radius) {
        s.y = arenaHeight - s.radius;
        s.vy = -Math.abs(s.vy);
      }
    }
  }

  // ----------------------------------------------------------------------
  // Simple AABB / circle overlap. While Flash Dashing the player "boops"
  // squirrels: they vanish and drop acorns from the stolen stash.
  // ----------------------------------------------------------------------
  private handleCollisions() {
    if (!this.player.flashing) return;

    for (const s of this.squirrels) {
      if (!s.alive) continue;
      const dx = s.x - this.player.x;
      const dy = s.y - this.player.y;
      const r = s.radius + this.player.radius;
      if (dx * dx + dy * dy <= r * r) {
        s.alive = false;
        this.acorns += this.config.squirrels.acornsPerBoop;
        this.emit({ type: 'ACORN', payload: this.acorns });
      }
    }
  }

  private updateTimer(deltaMs: number) {
    this.timeRemainingMs = Math.max(0, this.timeRemainingMs - deltaMs);
    this.emit({
      type: 'TIME',
      payload: Math.ceil(this.timeRemainingMs / 1000),
    });
  }

  private maybeRespawn(time: number) {
    const alive = this.squirrels.filter((s) => s.alive).length;
    if (alive < this.config.squirrels.maxAlive && time >= this.nextSpawnAt) {
      this.spawnSquirrels(1);
      this.nextSpawnAt = time + 1800;
    }
  }

  private spawnSquirrels(count: number) {
    const { arenaWidth, arenaHeight } = this.config.level;
    for (let i = 0; i < count; i++) {
      this.squirrels.push({
        id: this.squirrelIdCounter++,
        x: Phaser.Math.Between(20, arenaWidth - 20),
        y: Phaser.Math.Between(20, arenaHeight - 20),
        vx: 0,
        vy: 0,
        nextTurnAt: 0,
        radius: 7,
        alive: true,
      });
    }
  }

  // ----------------------------------------------------------------------
  // Rendering: pure Graphics primitives keep the game asset-free and
  // guarantee the 4-color palette.
  // ----------------------------------------------------------------------
  private render() {
    const g = this.gfx;
    g.clear();

    const { arenaWidth, arenaHeight, tileSize } = this.config.level;

    // Grass background pattern using only the two lightest greens.
    g.fillStyle(PALETTE.lightest, 1);
    g.fillRect(0, 0, arenaWidth, arenaHeight);
    g.fillStyle(PALETTE.light, 1);
    for (let y = 0; y < arenaHeight; y += tileSize) {
      for (let x = 0; x < arenaWidth; x += tileSize) {
        if ((x / tileSize + y / tileSize) % 2 === 0) {
          g.fillRect(x + 4, y + 4, 4, 4);
        }
      }
    }

    // Arena border.
    g.lineStyle(2, PALETTE.darkest, 1);
    g.strokeRect(1, 1, arenaWidth - 2, arenaHeight - 2);

    // Squirrels (mossy bark color so they pop against the lawn).
    for (const s of this.squirrels) {
      if (!s.alive) continue;
      g.fillStyle(PALETTE.dark, 1);
      g.fillRect(s.x - s.radius, s.y - s.radius, s.radius * 2, s.radius * 2);
      // Tail tuft
      g.fillStyle(PALETTE.darkest, 1);
      g.fillRect(s.x + s.radius - 2, s.y - s.radius - 3, 3, 4);
    }

    // Player schnauzer. Flash Dash shimmer alternates the body color.
    const flashOn =
      this.player.flashing && Math.floor(this.time.now / 60) % 2 === 0;
    g.fillStyle(flashOn ? PALETTE.dark : PALETTE.darkest, 1);
    g.fillRect(
      this.player.x - this.player.radius,
      this.player.y - this.player.radius,
      this.player.radius * 2,
      this.player.radius * 2
    );
    // Beard / muzzle pointing toward facing direction.
    g.fillStyle(PALETTE.lightest, 1);
    g.fillRect(
      this.player.x + this.player.facing.x * 5 - 2,
      this.player.y + this.player.facing.y * 5 - 2,
      4,
      4
    );
  }
}

// --------------------------------------------------------------------------
// Public engine wrapper. The React component talks only to this class.
// --------------------------------------------------------------------------
export class SchnauzerEngine {
  private game: Phaser.Game | null = null;
  private scene: SchnauzerScene | null = null;
  private listeners = new Set<EngineListener>();
  private state: RuntimeGameState;

  constructor(private parent: HTMLElement, private config: SchnauzerGameConfig) {
    this.state = {
      status: 'INTRO_DIALOGUE',
      acorns: 0,
      goal: config.level.acornGoal,
      selectedPlayerId: config.defaultPlayerId,
      dialogueIndex: 0,
      flashDashReady: true,
      timeRemaining: config.level.durationSeconds,
      message: '',
    };
  }

  start() {
    if (this.game) return;

    const sceneData = {
      config: this.config,
      emit: (event: EngineEvent) => this.dispatch(event),
      getStatus: () => this.state.status,
    };

    this.game = new Phaser.Game({
      type: Phaser.AUTO,
      parent: this.parent,
      width: this.config.level.arenaWidth,
      height: this.config.level.arenaHeight,
      pixelArt: true,
      backgroundColor: '#9bbc0f',
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      callbacks: {
        postBoot: (game) => {
          // Add and start the scene *after* the Game is fully booted so
          // init() receives our data on the very first call.
          game.scene.add('schnauzer', SchnauzerScene, true, sceneData);
          this.scene = game.scene.getScene('schnauzer') as SchnauzerScene;
        },
      },
    });
  }

  destroy() {
    this.game?.destroy(true);
    this.game = null;
    this.scene = null;
    this.listeners.clear();
  }

  subscribe(listener: EngineListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  getState(): RuntimeGameState {
    return { ...this.state };
  }

  // ----------------------------------------------------------------------
  // State machine -- INTRO_DIALOGUE -> GAMEPLAY -> CUTSCENE.
  // Centralized here so the UI shell and Phaser scene stay in sync.
  // ----------------------------------------------------------------------
  setState(next: GameStateName) {
    this.state.status = next;
    if (next === 'GAMEPLAY') {
      this.state.message = '';
    }
    this.dispatch({ type: 'STATE_CHANGE', payload: next });
  }

  advanceDialogue() {
    const total =
      this.state.status === 'CUTSCENE'
        ? this.config.victory.length
        : this.config.intro.length;
    const next = this.state.dialogueIndex + 1;
    if (next >= total) {
      if (this.state.status === 'INTRO_DIALOGUE') {
        this.state.dialogueIndex = 0;
        this.setState('GAMEPLAY');
      } else {
        this.state.dialogueIndex = 0;
        // Restart loop after the victory/defeat cutscene.
        this.resetRun();
        this.setState('INTRO_DIALOGUE');
      }
    } else {
      this.state.dialogueIndex = next;
      this.dispatch({ type: 'DIALOGUE', payload: next });
    }
  }

  selectPlayer(id: string) {
    if (this.config.players.some((p) => p.id === id)) {
      this.state.selectedPlayerId = id;
    }
  }

  private resetRun() {
    this.state.acorns = 0;
    this.state.timeRemaining = this.config.level.durationSeconds;
    this.state.flashDashReady = true;
    this.scene?.scene.restart({
      config: this.config,
      emit: (event: EngineEvent) => this.dispatch(event),
      getStatus: () => this.state.status,
    });
  }

  private dispatch(event: EngineEvent) {
    // Mirror engine events into the shared state object.
    switch (event.type) {
      case 'ACORN':
        this.state.acorns = event.payload;
        break;
      case 'FLASH_READY':
        this.state.flashDashReady = event.payload;
        break;
      case 'TIME':
        this.state.timeRemaining = event.payload;
        break;
      case 'STATE_CHANGE':
        this.state.status = event.payload;
        break;
      case 'DIALOGUE':
        this.state.dialogueIndex = event.payload;
        break;
      case 'MESSAGE':
        this.state.message = event.payload;
        break;
    }
    for (const l of this.listeners) l(event);
  }
}
