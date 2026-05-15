import { useEffect, useState } from 'react';

interface PlayerNameInputProps {
  /** Current player-facing name shown in the input. */
  value: string;
  /** Default name for the currently selected character. */
  defaultName: string;
  /** Plain-language label above the input. */
  label: string;
  /** Helper text shown under the input. */
  help?: string;
  /** "Use default" button label. */
  resetLabel: string;
  onCommit: (next: string) => void;
  onReset: () => void;
}

/**
 * Mobile-friendly inline rename input. Local state mirrors what the user is
 * typing; we commit on blur / Enter so the engine state doesn't churn on
 * every keystroke.
 */
export function PlayerNameInput({
  value,
  defaultName,
  label,
  help,
  resetLabel,
  onCommit,
  onReset,
}: PlayerNameInputProps) {
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  const commit = () => {
    if (draft !== value) onCommit(draft);
  };

  const isCustom = value !== defaultName;

  return (
    <label
      className="flex flex-col gap-1 border-2 border-gb-darkest bg-gb-lightest p-2 text-[10px] text-gb-darkest"
      data-testid="player-name-input"
    >
      <span className="tracking-widest">{label.toUpperCase()}</span>
      <div className="flex gap-1">
        <input
          type="text"
          value={draft}
          maxLength={24}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              (e.target as HTMLInputElement).blur();
            }
          }}
          placeholder={defaultName}
          className="flex-1 min-w-0 border-2 border-gb-darkest bg-gb-lightest px-2 py-1 text-[11px] text-gb-darkest focus:outline-none focus:bg-white"
          data-testid="input-player-name"
        />
        {isCustom ? (
          <button
            type="button"
            onClick={onReset}
            className="border-2 border-gb-darkest bg-gb-light px-2 py-1 text-[10px] tracking-widest text-gb-darkest hover:bg-gb-lightest"
            data-testid="button-reset-player-name"
          >
            {resetLabel.toUpperCase()}
          </button>
        ) : null}
      </div>
      {help ? <p className="leading-snug">{help}</p> : null}
    </label>
  );
}
