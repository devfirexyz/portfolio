"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";

import { HeroBackdrop } from "@/components/home/HeroBackdrop";
import { HeroContent } from "@/components/home/HeroContent";
import { HomeFooter } from "@/components/home/HomeFooter";
import { HomeHeader } from "@/components/home/HomeHeader";
import { ABOUT_ME_DESCRIPTION } from "@/lib/data/home-content";

const ResumeModal = dynamic(() => import("@/components/ResumeModal"), {
  loading: () => null,
});

const ContactFormModal = dynamic(() => import("@/components/ContactFormModal"), {
  loading: () => null,
});

const DiscordPortfolio = dynamic(() => import("@/components/DiscordPortfolio"), {
  ssr: false,
  loading: () => null,
});

const NeoProjectsSection = dynamic(
  () => import("@/components/home/neo/NeoProjectsSection").then((mod) => mod.NeoProjectsSection),
  { ssr: false, loading: () => null }
);

function DiscordShell({
  onEnable,
}: {
  onEnable: () => void;
}) {
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
          Interactive console loads on demand to reduce initial JavaScript and speed up first render.
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

function ProjectsShell() {
  return (
    <section
      id="projects"
      className="border-b-2 border-[var(--nb-border)] bg-[var(--nb-background-alt)] px-4 py-20 sm:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-[var(--nb-foreground-muted)]">
          Work Samples
        </p>
        <h2 className="mt-2 text-4xl font-black uppercase leading-[0.9] tracking-[-0.05em] sm:text-6xl">
          Project Evidence
        </h2>
        <p className="mt-4 max-w-md text-sm font-bold uppercase tracking-[0.1em] text-[var(--nb-foreground-subtle)]">
          Loading showcase...
        </p>
      </div>
    </section>
  );
}

export default function PortfolioPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [showAboutMe, setShowAboutMe] = useState(false);
  const [showInteractiveConsole, setShowInteractiveConsole] = useState(false);
  const [showProjects, setShowProjects] = useState(false);
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

  const onOpenResume = useCallback(() => {
    setIsResumeModalOpen(true);
  }, []);

  const onCloseResume = useCallback(() => {
    setIsResumeModalOpen(false);
  }, []);

  const onOpenContact = useCallback(() => {
    setIsContactModalOpen(true);
  }, []);

  const onCloseContact = useCallback(() => {
    setIsContactModalOpen(false);
  }, []);

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
        { rootMargin: "0px", threshold: 0.1 }
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
                aboutMeDescription={ABOUT_ME_DESCRIPTION}
                onToggleAboutMe={onToggleAboutMe}
                onOpenResume={onOpenResume}
                onOpenContact={onOpenContact}
              />

              <div className="order-first h-[420px] w-full border-2 border-[var(--nb-border)] bg-[var(--nb-surface)] p-2 shadow-[10px_10px_0px_0px_var(--nb-shadow-color)] xl:order-none xl:col-span-3 xl:h-[600px]">
                {showInteractiveConsole ? (
                  <DiscordPortfolio className="h-full w-full" />
                ) : (
                  <DiscordShell onEnable={() => setShowInteractiveConsole(true)} />
                )}
              </div>
            </div>
          </div>
        </section>
      </div>

      <div ref={projectsSentinelRef} />
      {showProjects ? <NeoProjectsSection /> : <ProjectsShell />}

      <HomeFooter onOpenResume={onOpenResume} onOpenContact={onOpenContact} />

      {isResumeModalOpen && <ResumeModal onClose={onCloseResume} />}
      {isContactModalOpen && <ContactFormModal onClose={onCloseContact} />}
    </div>
  );
}
