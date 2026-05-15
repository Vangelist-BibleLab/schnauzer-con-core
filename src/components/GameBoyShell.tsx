// Game Boy-flavored UI shell. Lovable.dev can restyle this freely.

import type { ReactNode } from 'react';

interface GameBoyShellProps {
  title: string;
  volume: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function GameBoyShell({
  title,
  volume,
  subtitle,
  children,
  footer,
}: GameBoyShellProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gb-darkest p-4 font-pixel">
      <div className="w-full max-w-3xl rounded-[18px] bg-gb-dark p-6 shadow-[0_0_0_4px_#0f380f] flex flex-col gap-4">
        <header className="flex items-baseline justify-between text-gb-lightest">
          <div>
            <p className="text-[10px] tracking-widest text-gb-light">
              {volume.toUpperCase()}
            </p>
            <h1 className="text-base sm:text-lg leading-tight">{title}</h1>
            <p className="text-[10px] text-gb-light">{subtitle}</p>
          </div>
          <span
            className="text-[10px] text-gb-light"
            aria-label="Power indicator"
          >
            ● POWER
          </span>
        </header>

        <div className="rounded-md bg-gb-lightest p-2 shadow-inner shadow-gb-darkest">
          <div className="rounded-sm border-2 border-gb-darkest bg-gb-lightest overflow-hidden pixelated">
            {children}
          </div>
        </div>

        {footer ? (
          <footer className="text-[10px] text-gb-lightest leading-relaxed">
            {footer}
          </footer>
        ) : null}
      </div>
    </div>
  );
}
