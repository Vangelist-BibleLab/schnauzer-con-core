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
      className="flex gap-2 p-2 border-2 border-gb-darkest bg-gb-lightest"
      data-testid="character-select"
    >
      {players.map((p) => {
        const active = p.id === selectedId;
        return (
          <button
            key={p.id}
            type="button"
            onClick={() => onSelect(p.id)}
            className={`flex-1 text-left text-[10px] p-2 border-2 transition-colors ${
              active
                ? 'border-gb-darkest bg-gb-darkest text-gb-lightest'
                : 'border-gb-dark bg-gb-light text-gb-darkest hover:bg-gb-lightest'
            }`}
            data-testid={`button-pick-${p.id}`}
          >
            <p className="tracking-widest">{p.shortName}</p>
            <p className="mt-1 text-[11px]">{p.name}</p>
            <p className="mt-1 leading-snug">{p.description}</p>
          </button>
        );
      })}
    </div>
  );
}
