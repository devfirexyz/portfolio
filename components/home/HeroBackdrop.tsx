import { HERO_BACKGROUND_DOTS } from "@/lib/data/home-content";

export function HeroBackdrop() {
  return (
    <div className="absolute inset-0 overflow-hidden neo-grid-bg">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(88,101,242,0.15),transparent_38%),radial-gradient(circle_at_80%_24%,rgba(114,137,218,0.1),transparent_36%)]" />
      <div className="animate-soft-glow absolute -left-24 top-8 h-80 w-80 rounded-full bg-[var(--nb-accent)]/20 blur-3xl" />
      <div className="animate-soft-glow absolute bottom-0 right-0 h-96 w-96 rounded-full bg-[var(--nb-accent-light)]/20 blur-3xl [animation-delay:1.3s]" />

      {HERO_BACKGROUND_DOTS.map((dot, index) => (
        <span
          key={`hero-dot-${index}`}
          className={`absolute rounded-full bg-[var(--nb-foreground)] ${index % 2 === 0 ? "animate-twinkle" : ""}`}
          style={{
            top: dot.top,
            left: dot.left,
            width: `${dot.size}px`,
            height: `${dot.size}px`,
            opacity: dot.opacity,
          }}
        />
      ))}
    </div>
  );
}
