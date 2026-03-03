"use client";

import dynamic from "next/dynamic";
import { useCallback, useState } from "react";

import { PortfolioChatSurface } from "@/components/chat/PortfolioChatSurface";

const ContactFormModal = dynamic(() => import("@/components/ContactFormModal"), {
  loading: () => null,
});

export function PortfolioChatPageClient() {
  const [isContactOpen, setIsContactOpen] = useState(false);

  const onOpenContact = useCallback(() => {
    setIsContactOpen(true);
  }, []);

  const onCloseContact = useCallback(() => {
    setIsContactOpen(false);
  }, []);

  return (
    <main className="min-h-[100dvh] overflow-hidden bg-[var(--nb-background)] px-0 pb-[env(safe-area-inset-bottom)] pt-0 sm:p-4">
      <div className="mx-auto flex h-[100dvh] min-h-0 w-full max-w-[92rem] sm:h-[calc(100dvh-2rem)]">
        <PortfolioChatSurface onOpenContact={onOpenContact} />
      </div>
      {isContactOpen ? <ContactFormModal onClose={onCloseContact} /> : null}
    </main>
  );
}
