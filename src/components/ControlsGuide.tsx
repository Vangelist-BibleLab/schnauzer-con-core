import type { ControlsConfig } from '@/content/types';

export function ControlsGuide({ controls }: { controls: ControlsConfig }) {
  return (
    <ul
      className="space-y-1 border-2 border-gb-darkest bg-gb-lightest p-2 text-[10px] text-gb-darkest"
      data-testid="controls-guide"
    >
      <li>▶ {controls.movement}</li>
      <li>▶ {controls.flashDash}</li>
      <li>▶ {controls.pause}</li>
    </ul>
  );
}
