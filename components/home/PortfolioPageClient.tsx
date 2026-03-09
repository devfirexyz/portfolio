"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { HeroBackdrop } from "@/components/home/HeroBackdrop";
import { HeroContent } from "@/components/home/HeroContent";
import { HomeFooter } from "@/components/home/HomeFooter";
import { HomeHeader } from "@/components/home/HomeHeader";

const ContactFormModal = dynamic(
  () => import("@/components/ContactFormModal"),
  {
    loading: () => null,
  },
);

type ContactModalMode = "default" | "resume-request";

function ProjectsShell() {
  return (
    <section
      id="projects"
      className="min-h-[780px] lg:min-h-[900px] border-b-2 border-[var(--nb-border)] bg-[var(--nb-background-alt)] px-4 py-20 sm:px-8"
      aria-busy="true"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-[var(--nb-foreground-muted)]">
              Work Samples
            </p>
            <h2 className="mt-2 text-4xl font-black uppercase leading-[0.9] tracking-[-0.05em] sm:text-6xl">
              What am i doing ?
            </h2>
          </div>
          <p className="max-w-md text-base leading-relaxed text-[var(--nb-foreground-muted)]">
            Selected builds with measurable outcomes, production context, and
            implementation details.
          </p>
        </div>

        <div className="overflow-hidden border-2 border-[var(--nb-border)] bg-[var(--nb-surface)] shadow-[8px_8px_0px_0px_var(--nb-shadow-color)]">
          <div className="h-[320px] border-b-2 border-[var(--nb-border)] bg-[var(--nb-surface-muted)] sm:h-[420px]" />
          <div className="space-y-4 p-6">
            <div className="h-6 w-2/5 bg-[var(--nb-surface-alt)]" />
            <div className="h-4 w-full bg-[var(--nb-surface-alt)]" />
            <div className="h-4 w-3/4 bg-[var(--nb-surface-alt)]" />
            <div className="h-10 w-40 bg-[var(--nb-surface-alt)]" />
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-3 w-10 bg-[var(--nb-surface-alt)]" />
            <span className="h-3 w-3 bg-[var(--nb-surface-alt)]" />
            <span className="h-3 w-3 bg-[var(--nb-surface-alt)]" />
          </div>

          <div className="flex items-center gap-3">
            <span className="h-10 w-10 bg-[var(--nb-surface-alt)]" />
            <span className="h-10 w-10 bg-[var(--nb-surface-alt)]" />
          </div>
        </div>
      </div>
    </section>
  );
}

const loadDiscordPortfolio = () => import("@/components/DiscordPortfolio");
const loadNeoProjectsSection = () =>
  import("@/components/home/neo/NeoProjectsSection").then(
    (mod) => mod.NeoProjectsSection,
  );

const PROJECTS_LOADED_KEY = "projectsSectionLoaded";
let projectsSectionLoadedCache = false;

const DiscordPortfolio = dynamic(loadDiscordPortfolio, {
  ssr: false,
  loading: () => null,
});

const NeoProjectsSection = dynamic(loadNeoProjectsSection, {
  ssr: false,
  loading: ProjectsShell,
});

interface PortfolioPageClientProps {
  aboutMeDescription: string;
}

function DiscordShell({ onEnable }: { onEnable: () => void }) {
  return (
    <div className="flex h-full flex-col overflow-hidden bg-[var(--nb-surface)]">
      <div className="flex min-h-16 items-center justify-between border-b-2 border-[var(--nb-border)] bg-[var(--nb-surface-alt)] px-4">
        <div className="flex items-center gap-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ef4444]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#f59e0b]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#10b981]" />
        </div>
        <p className="truncate px-3 text-[13px] font-bold uppercase tracking-[0.14em] text-[var(--nb-foreground-muted)]">
          Portfolio Resume Console
        </p>
        <span className="hidden border-2 border-[var(--nb-border)] bg-[var(--nb-surface)] px-3 py-1 text-[12px] font-bold uppercase tracking-[0.08em] text-[var(--nb-foreground-muted)] sm:inline-flex">
          Resume Snapshot
        </span>
      </div>

      <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-4 bg-[var(--nb-background)] p-6 text-center">
        <p className="max-w-md text-sm font-bold uppercase tracking-[0.12em] text-[var(--nb-foreground-muted)]">
          Interactive console loads on demand to reduce initial JavaScript and
          speed up first render.
        </p>
        <button
          type="button"
          onClick={onEnable}
          className="border-2 border-[var(--nb-border)] bg-[var(--nb-accent)] px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-white shadow-[5px_5px_0px_0px_var(--nb-shadow-color)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--nb-accent)]"
        >
          Load Interactive Console
        </button>
      </div>
    </div>
  );
}

export function PortfolioPageClient({
  aboutMeDescription,
}: PortfolioPageClientProps) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactModalMode, setContactModalMode] =
    useState<ContactModalMode>("default");
  const [showAboutMe, setShowAboutMe] = useState(false);
  const [showInteractiveConsole, setShowInteractiveConsole] = useState(false);
  const [showProjects, setShowProjects] = useState(projectsSectionLoadedCache);
  const [hasUserScrolled, setHasUserScrolled] = useState(false);
  const projectsSentinelRef = useRef<HTMLDivElement | null>(null);

  const onToggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const onCloseMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const onToggleAboutMe = useCallback(() => {
    setShowAboutMe((prev) => !prev);
  }, []);

  const onOpenChat = useCallback(() => {
    router.push("/chat");
  }, [router]);

  const onOpenResume = useCallback(() => {
    setContactModalMode("resume-request");
    setIsContactModalOpen(true);
  }, []);

  const onOpenContact = useCallback(() => {
    setContactModalMode("default");
    setIsContactModalOpen(true);
  }, []);

  const onCloseContact = useCallback(() => {
    setIsContactModalOpen(false);
    setContactModalMode("default");
  }, []);

  useEffect(() => {
    if (showProjects) {
      projectsSectionLoadedCache = true;
      try {
        sessionStorage.setItem(PROJECTS_LOADED_KEY, "1");
      } catch {
        // Ignore storage failures.
      }
      return;
    }

    try {
      if (sessionStorage.getItem(PROJECTS_LOADED_KEY) === "1") {
        projectsSectionLoadedCache = true;
        setShowProjects(true);
      }
    } catch {
      // Ignore storage failures.
    }
  }, [showProjects]);

  useEffect(() => {
    if (hasUserScrolled) {
      return;
    }

    const onScroll = () => {
      if (window.scrollY > 0) {
        setHasUserScrolled(true);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [hasUserScrolled]);

  useEffect(() => {
    let idleId: number | null = null;
    let timeoutId: number | null = null;
    let warmed = false;

    const warmNonCriticalChunks = () => {
      if (warmed) {
        return;
      }

      warmed = true;
      void loadDiscordPortfolio();
      void loadNeoProjectsSection();
    };

    const onInteraction = () => {
      if (typeof window.requestIdleCallback === "function") {
        idleId = window.requestIdleCallback(warmNonCriticalChunks, {
          timeout: 1800,
        });
        return;
      }

      timeoutId = window.setTimeout(warmNonCriticalChunks, 500);
    };

    window.addEventListener("pointerdown", onInteraction, {
      once: true,
      passive: true,
    });
    window.addEventListener("keydown", onInteraction, { once: true });
    window.addEventListener("touchstart", onInteraction, {
      once: true,
      passive: true,
    });
    window.addEventListener("wheel", onInteraction, {
      once: true,
      passive: true,
    });

    return () => {
      window.removeEventListener("pointerdown", onInteraction);
      window.removeEventListener("keydown", onInteraction);
      window.removeEventListener("touchstart", onInteraction);
      window.removeEventListener("wheel", onInteraction);
      if (idleId !== null && typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(idleId);
      }
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
    };
  }, []);

  useEffect(() => {
    if (showProjects || !hasUserScrolled) {
      return;
    }

    const enable = () => setShowProjects(true);
    const sentinel = projectsSentinelRef.current;

    let observer: IntersectionObserver | null = null;
    if (sentinel && "IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            enable();
          }
        },
        { rootMargin: "240px", threshold: 0.01 },
      );
      observer.observe(sentinel);
    } else {
      enable();
    }

    return () => {
      observer?.disconnect();
    };
  }, [hasUserScrolled, showProjects]);

  return (
    <div className="relative bg-[var(--nb-background)] text-[var(--nb-foreground)]">
      <div className="relative overflow-hidden border-b-2 border-[var(--nb-border)] pb-20 pt-20 sm:pb-20 md:pb-28">
        <HeroBackdrop />

        <HomeHeader
          isMenuOpen={isMenuOpen}
          onToggleMenu={onToggleMenu}
          onCloseMenu={onCloseMenu}
        />

        <section className="relative flex items-center overflow-hidden pt-14 sm:pt-16 md:pt-20 lg:pt-28">
          <div className="container relative z-20 mx-auto w-full px-4 sm:px-6">
            <div className="grid grid-cols-1 items-center gap-8 xl:grid-cols-5 xl:gap-14">
              <HeroContent
                showAboutMe={showAboutMe}
                aboutMeDescription={aboutMeDescription}
                onToggleAboutMe={onToggleAboutMe}
                onOpenChat={onOpenChat}
                onOpenContact={onOpenContact}
              />

              <div className="order-first h-[420px] w-full border-2 border-[var(--nb-border)] bg-[var(--nb-surface)] p-2 shadow-[10px_10px_0px_0px_var(--nb-shadow-color)] xl:order-none xl:col-span-3 xl:h-[600px]">
                {showInteractiveConsole ? (
                  <DiscordPortfolio className="h-full w-full" />
                ) : (
                  <DiscordShell
                    onEnable={() => setShowInteractiveConsole(true)}
                  />
                )}
              </div>
            </div>
          </div>
        </section>
      </div>

      <div ref={projectsSentinelRef} />
      {showProjects ? <NeoProjectsSection /> : <ProjectsShell />}

      <HomeFooter onOpenResume={onOpenResume} onOpenContact={onOpenContact} />

      {isContactModalOpen && (
        <ContactFormModal onClose={onCloseContact} mode={contactModalMode} />
      )}
    </div>
  );
}
