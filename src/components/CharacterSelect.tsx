import type { PlayerCharacter } from '@/content/types';

interface CharacterSelectProps {
  players: PlayerCharacter[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export function CharacterSelect({
  players,
  selectedId,
  onSelect,
}: CharacterSelectProps) {
  return (
    <div
      className="grid grid-cols-1 gap-2 p-2 border-2 border-gb-darkest bg-gb-lightest"
      data-testid="character-select"
    >
      {players.map((p) => {
        const active = p.id === selectedId;
        return (
          <button
            key={p.id}
            type="button"
            onClick={() => onSelect(p.id)}
            className={`min-w-0 text-left text-[10px] p-2 border-2 transition-colors ${
              active
                ? 'border-gb-darkest bg-gb-darkest text-gb-lightest'
                : 'border-gb-dark bg-gb-light text-gb-darkest hover:bg-gb-lightest'
            }`}
            data-testid={`button-pick-${p.id}`}
          >
            <div className="flex items-baseline justify-between gap-2">
              <p className="tracking-widest">{p.shortName}</p>
              <p className="truncate text-[11px]">{p.name}</p>
            </div>
            <p className="mt-1 leading-snug line-clamp-2">{p.description}</p>
          </button>
        );
      })}
    </div>
  );
}
