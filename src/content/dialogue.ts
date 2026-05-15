// Tiny content-side helper: substitute the chosen player-facing name into a
// dialogue line. The engine has no opinion on placeholders; this util is
// what the React shell uses to render lines.
//
// Currently the only supported token is `{player}` (in both `speaker` and
// `text`). Keeping it dumb on purpose -- if a future Volume needs more
// variables, expand here, not in the engine.

import type { DialogueLine } from './types';

export function interpolateDialogue(
  line: DialogueLine,
  playerName: string
): DialogueLine {
  return {
    speaker: line.speaker.replace(/\{player\}/g, playerName),
    text: line.text.replace(/\{player\}/g, playerName),
  };
}
