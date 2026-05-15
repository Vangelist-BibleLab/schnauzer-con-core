import type { DialogueLine } from '@/content/types';

interface DialogueOverlayProps {
  line: DialogueLine;
  index: number;
  total: number;
  onAdvance: () => void;
  cta?: string;
}

export function DialogueOverlay({
  line,
  index,
  total,
  onAdvance,
  cta = 'Next ▶',
}: DialogueOverlayProps) {
  return (
    <div
      className="absolute inset-0 flex items-end justify-center bg-gb-darkest/70"
      data-testid="dialogue-overlay"
    >
      <div className="w-[92%] m-3 border-2 border-gb-darkest bg-gb-lightest p-3 text-gb-darkest">
        <p className="text-[10px] text-gb-dark">
          {line.speaker.toUpperCase()} · {index + 1}/{total}
        </p>
        <p className="text-[11px] leading-relaxed mt-1">{line.text}</p>
        <button
          type="button"
          onClick={onAdvance}
          className="mt-3 text-[10px] tracking-widest bg-gb-darkest text-gb-lightest px-2 py-1 hover:bg-gb-dark"
          data-testid="button-advance-dialogue"
        >
          {cta}
        </button>
      </div>
    </div>
  );
}
