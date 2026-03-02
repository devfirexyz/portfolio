import { Mail } from "lucide-react";

import { NeoButton } from "@/components/neo/NeoButton";
import { HERO_TITLE_LINES } from "@/lib/data/home-content";

interface HeroContentProps {
  showAboutMe: boolean;
  aboutMeDescription: string;
  onToggleAboutMe: () => void;
  onOpenResume: () => void;
  onOpenContact: () => void;
}

export function HeroContent({
  showAboutMe,
  aboutMeDescription,
  onToggleAboutMe,
  onOpenResume,
  onOpenContact,
}: HeroContentProps) {
  return (
    <div className="w-full max-w-none text-left xl:col-span-2">
      <div className="mb-8 animate-fade-slide-up">
        <p className="mb-4 inline-flex border-2 border-[var(--nb-border)] bg-[var(--nb-surface)] px-3 py-1 text-[13px] font-bold uppercase tracking-[0.16em] text-[var(--nb-foreground-muted)] shadow-[4px_4px_0px_0px_var(--nb-shadow-color)]">
          Bangalore :: Operating in public
        </p>

        <h1 className="font-black uppercase tracking-tight text-[var(--nb-foreground)]">
          {HERO_TITLE_LINES.map((line, index) => (
            <span
              key={line}
              className={`block text-[38px] font-extrabold leading-[0.88] sm:text-[50px] md:text-[60px] lg:text-[70px] xl:text-[82px] ${
                index === HERO_TITLE_LINES.length - 1
                  ? "bg-gradient-to-r from-[var(--nb-accent-ink)] via-[var(--nb-accent)] to-[var(--nb-accent-hover)] bg-clip-text text-transparent"
                  : ""
              }`}
            >
              {line}
            </span>
          ))}
        </h1>
      </div>

      <div className="mb-10 max-w-2xl animate-fade-slide-up border-2 border-[var(--nb-border)] bg-[var(--nb-surface)] p-5 text-base leading-relaxed text-[var(--nb-foreground)] shadow-[8px_8px_0px_0px_var(--nb-shadow-color)] sm:text-lg [animation-delay:120ms]">
        {showAboutMe
          ? aboutMeDescription
          : `${aboutMeDescription.slice(0, 170)}...`}
        <button
          type="button"
          className="ml-1 font-bold uppercase tracking-[0.12em] text-[var(--nb-accent-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--nb-accent)]"
          onClick={onToggleAboutMe}
        >
          {showAboutMe ? "Show less" : "Read more"}
        </button>
      </div>

      <div className="mb-10 flex animate-fade-slide-up flex-col gap-4 sm:flex-row sm:gap-6 [animation-delay:220ms]">
        <NeoButton
          size="lg"
          className="w-full sm:w-auto"
          onClick={onOpenResume}
        >
          <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
          </svg>
          Open Resume
        </NeoButton>

        <NeoButton
          size="lg"
          variant="secondary"
          className="w-full sm:w-auto"
          onClick={onOpenContact}
        >
          <Mail className="mr-2 h-5 w-5" />
          Contact Me
        </NeoButton>
      </div>
    </div>
  );
}
