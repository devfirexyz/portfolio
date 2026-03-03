import { HERO_BACKGROUND_DOTS } from "@/lib/data/home-content";

export function HeroBackdrop() {
  return (
    <div className="absolute inset-0 overflow-hidden neo-grid-bg">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,var(--nb-hero-glow-primary),transparent_38%),radial-gradient(circle_at_80%_24%,var(--nb-hero-glow-secondary),transparent_36%)]" />

      {HERO_BACKGROUND_DOTS.map((dot, index) => (
        <span
          key={`hero-dot-${index}`}
          className={`absolute rounded-full bg-[var(--nb-foreground)] ${
            index % 2 === 0 ? "md:animate-twinkle" : ""
          }`}
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
