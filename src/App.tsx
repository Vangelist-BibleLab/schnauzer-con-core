import { useCallback, useEffect, useState } from 'react';
import { GameBoyShell } from '@/components/GameBoyShell';
import { PhaserGame } from '@/components/PhaserGame';
import { DialogueOverlay } from '@/components/DialogueOverlay';
import { StatusBar } from '@/components/StatusBar';
import { CharacterSelect } from '@/components/CharacterSelect';
import { ControlsGuide } from '@/components/ControlsGuide';
import { PlayerNameInput } from '@/components/PlayerNameInput';
import { gameConfig } from '@/content/gameConfig';
import { interpolateDialogue } from '@/content/dialogue';
import type { SchnauzerEngine } from '@/game/SchnauzerEngine';
import type { RuntimeGameState } from '@/content/types';

const identity = gameConfig.playerIdentity;
const initialPlayerId =
  identity?.defaultPlayerCharacterId ??
  gameConfig.defaultPlayerId ??
  gameConfig.players[0]?.id ??
  '';
const initialCharacter = gameConfig.players.find(
  (p) => p.id === initialPlayerId
);
const initialPlayerName =
  identity?.defaultPlayerName ??
  initialCharacter?.name ??
  initialPlayerId;

export default function App() {
  const [engine, setEngine] = useState<SchnauzerEngine | null>(null);
  const [state, setState] = useState<RuntimeGameState>(() => ({
    status: 'INTRO_DIALOGUE',
    acorns: 0,
    goal: gameConfig.level.acornGoal,
    selectedPlayerId: initialPlayerId,
    playerName: initialPlayerName,
    dialogueIndex: 0,
    flashDashReady: true,
    timeRemaining: gameConfig.level.durationSeconds,
    message: '',
  }));

  // Whenever the engine fires an event, mirror its updated state in React so
  // the surrounding UI re-renders.
  const handleEvent = useCallback(() => {
    if (!engine) return;
    setState(engine.getState());
  }, [engine]);

  // Re-attach the listener once the engine instance is ready.
  useEffect(() => {
    if (!engine) return;
    const unsub = engine.subscribe(() => setState(engine.getState()));
    setState(engine.getState());
    return unsub;
  }, [engine]);

  const selectedPlayer =
    gameConfig.players.find((p) => p.id === state.selectedPlayerId) ??
    gameConfig.players[0];
  const defaultNameForSelected =
    identity?.defaultPlayerName ?? selectedPlayer.name;

  const dialogueLines =
    state.status === 'CUTSCENE' ? gameConfig.victory : gameConfig.intro;
  const showDialogue =
    state.status === 'INTRO_DIALOGUE' || state.status === 'CUTSCENE';
  const rawLine =
    dialogueLines[Math.min(state.dialogueIndex, dialogueLines.length - 1)];
  const dialogueLine = rawLine
    ? interpolateDialogue(rawLine, state.playerName)
    : rawLine;

  return (
    <GameBoyShell
      title={`${gameConfig.title}: ${gameConfig.volume}`}
      volume={`${gameConfig.title} · ${gameConfig.volume}`}
      subtitle={gameConfig.subtitle}
      footer={
        <div className="grid gap-2 sm:grid-cols-2">
          <ControlsGuide controls={gameConfig.controls} />
          <CharacterSelect
            players={gameConfig.players}
            selectedId={state.selectedPlayerId}
            onSelect={(id) => engine?.selectPlayer(id)}
          />
          {identity?.allowPlayerRename ? (
            <div className="sm:col-span-2">
              <PlayerNameInput
                value={state.playerName}
                defaultName={defaultNameForSelected}
                label={identity.renamePromptLabel ?? 'Player name'}
                help={identity.renamePromptHelp}
                resetLabel={identity.renameResetLabel ?? 'Use default'}
                onCommit={(name) => engine?.renamePlayer(name)}
                onReset={() => engine?.resetPlayerName()}
              />
            </div>
          ) : null}
        </div>
      }
    >
      <div className="flex flex-col">
        <StatusBar
          acorns={state.acorns}
          goal={state.goal}
          timeRemaining={state.timeRemaining}
          flashReady={state.flashDashReady}
          playerName={state.playerName}
        />

        <div className="relative">
          <PhaserGame
            config={gameConfig}
            onEngineReady={setEngine}
            onEvent={handleEvent}
          />

          {showDialogue && dialogueLine ? (
            <DialogueOverlay
              line={dialogueLine}
              index={state.dialogueIndex}
              total={dialogueLines.length}
              onAdvance={() => engine?.advanceDialogue()}
              cta={
                state.status === 'CUTSCENE'
                  ? 'Replay ▶'
                  : state.dialogueIndex >= dialogueLines.length - 1
                    ? 'Start ▶'
                    : 'Next ▶'
              }
            />
          ) : null}
        </div>

        {state.message ? (
          <p
            className="border-t-2 border-gb-darkest bg-gb-light px-3 py-1 text-center text-[10px] text-gb-darkest"
            data-testid="text-message"
          >
            {state.message}
          </p>
        ) : null}
      </div>
    </GameBoyShell>
  );
}
