import { LazyFooterLottie } from "./LazyFooterLottie";

interface HomeFooterProps {
  onOpenResume: () => void;
  onOpenContact: () => void;
}

export function HomeFooter({ onOpenResume, onOpenContact }: HomeFooterProps) {
  return (
    <footer className="relative border-t-2 border-[var(--nb-border)] bg-[var(--nb-surface-strong)] text-[var(--nb-foreground-inverse)]">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-14 sm:px-8 lg:grid-cols-2 lg:items-end lg:py-20">
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-[var(--nb-accent-light)]">
            End Node
          </p>
          <h2 className="text-4xl font-black uppercase leading-[0.9] tracking-[-0.05em] sm:text-6xl">
            Build Something
            <br />
            Useful.
          </h2>
          <p className="mt-4 max-w-md text-sm text-[var(--nb-foreground-inverse)] opacity-80 sm:text-base">
            If the project needs clear architecture and production momentum, I
            can help.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onOpenResume}
              className="border-2 border-[var(--nb-border)] bg-[var(--nb-accent)] px-6 py-3 text-xs font-bold uppercase tracking-[0.16em] text-white shadow-[6px_6px_0px_0px_var(--nb-shadow-accent)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_var(--nb-shadow-accent)]"
            >
              Open Resume
            </button>
            <button
              type="button"
              onClick={onOpenContact}
              className="border-2 border-[var(--nb-border)] bg-[var(--nb-surface)] px-6 py-3 text-xs font-bold uppercase tracking-[0.16em] text-[var(--nb-foreground)] shadow-[6px_6px_0px_0px_var(--nb-shadow-color)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_var(--nb-shadow-color)]"
            >
              Contact Me
            </button>
          </div>
        </div>

        <div className="relative border-2 border-[var(--nb-border)] bg-[var(--nb-surface)] p-4 shadow-[8px_8px_0px_0px_var(--nb-shadow-color)]">
          <LazyFooterLottie />
          <div className="border-t-2 border-[var(--nb-border)] pt-4 text-xs font-bold uppercase tracking-[0.14em] text-[var(--nb-foreground-muted)]">
            piyushraj.sys :: ready for mission briefs
          </div>
        </div>
      </div>
    </footer>
  );
}
