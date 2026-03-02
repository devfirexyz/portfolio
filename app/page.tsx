"use client";

import dynamic from "next/dynamic";
import { useCallback, useState } from "react";

import ContactFormModal from "@/components/ContactFormModal";
import DiscordPortfolio from "@/components/DiscordPortfolio";
import { HeroBackdrop } from "@/components/home/HeroBackdrop";
import { HeroContent } from "@/components/home/HeroContent";
import { HomeFooter } from "@/components/home/HomeFooter";
import { HomeHeader } from "@/components/home/HomeHeader";
import { NeoProjectsSection } from "@/components/home/neo/NeoProjectsSection";
import { ABOUT_ME_DESCRIPTION } from "@/lib/data/home-content";

const ResumeModal = dynamic(() => import("@/components/ResumeModal"), {
  loading: () => null,
});

export default function PortfolioPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [showAboutMe, setShowAboutMe] = useState(false);

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
                <DiscordPortfolio className="h-full w-full" />
              </div>
            </div>
          </div>
        </section>
      </div>

      <NeoProjectsSection />

      <HomeFooter onOpenResume={onOpenResume} onOpenContact={onOpenContact} />

      {isResumeModalOpen && <ResumeModal onClose={onCloseResume} />}
      {isContactModalOpen && <ContactFormModal onClose={onCloseContact} />}
    </div>
  );
}
