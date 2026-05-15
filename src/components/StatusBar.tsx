interface StatusBarProps {
  acorns: number;
  goal: number;
  timeRemaining: number;
  flashReady: boolean;
  playerName: string;
}

export function StatusBar({
  acorns,
  goal,
  timeRemaining,
  flashReady,
  playerName,
}: StatusBarProps) {
  return (
    <div
      className="flex items-center justify-between gap-3 border-2 border-gb-darkest bg-gb-light px-3 py-1 text-[10px] text-gb-darkest"
      data-testid="status-bar"
    >
      <span data-testid="text-player">{playerName.toUpperCase()}</span>
      <span data-testid="text-acorns">
        ACORNS {acorns.toString().padStart(2, '0')}/{goal}
      </span>
      <span data-testid="text-time">
        TIME {timeRemaining.toString().padStart(3, '0')}
      </span>
      <span
        data-testid="text-flash"
        className={flashReady ? 'text-gb-darkest' : 'text-gb-darkest/50'}
      >
        FLASH {flashReady ? 'READY' : '...'}
      </span>
    </div>
  );
}
