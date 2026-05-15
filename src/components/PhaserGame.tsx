// React wrapper around the SchnauzerEngine / Phaser instance.
// Lovable.dev can wrap, style, or layout this component freely; the engine
// owns the game canvas and runtime state.

import { useEffect, useRef } from 'react';
import { SchnauzerEngine, type EngineListener } from '@/game/SchnauzerEngine';
import type { SchnauzerGameConfig } from '@/content/types';

interface PhaserGameProps {
  config: SchnauzerGameConfig;
  onEngineReady: (engine: SchnauzerEngine) => void;
  onEvent?: EngineListener;
}

export function PhaserGame({ config, onEngineReady, onEvent }: PhaserGameProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<SchnauzerEngine | null>(null);

  useEffect(() => {
    if (!hostRef.current) return;
    const engine = new SchnauzerEngine(hostRef.current, config);
    engineRef.current = engine;
    const unsubscribe = onEvent ? engine.subscribe(onEvent) : undefined;
    engine.start();
    onEngineReady(engine);
    return () => {
      unsubscribe?.();
      engine.destroy();
      engineRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={hostRef}
      className="phaser-host aspect-[3/2] w-full bg-gb-lightest"
      data-testid="phaser-host"
    />
  );
}
