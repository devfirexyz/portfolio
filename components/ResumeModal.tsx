"use client";

import { memo, useEffect, useId, useRef } from "react";
import { X } from "lucide-react";

interface ResumeModalProps {
  onClose: () => void;
}

const ResumeModal = memo(({ onClose }: ResumeModalProps) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 p-3 sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
    >
      <div
        className="relative flex h-[80vh] max-h-[80vh] w-[80vw] max-w-[80vw] flex-col overflow-hidden border-2 border-[var(--nb-border)] bg-[var(--nb-surface)] shadow-[10px_10px_0px_0px_var(--nb-shadow-color)] sm:h-[90vh] sm:max-h-[calc(100vh-2rem)] sm:w-full sm:max-w-6xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b-2 border-[var(--nb-border)] bg-[var(--nb-surface-alt)] p-3 sm:p-5">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-7 w-7 items-center justify-center border-2 border-[var(--nb-border)] bg-[var(--nb-accent)] text-[var(--nb-foreground)] sm:h-8 sm:w-8">
              <svg className="h-3 w-3 sm:h-4 sm:w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
              </svg>
            </div>
            <h2
              id={titleId}
              className="text-sm font-bold uppercase tracking-[0.14em] text-[var(--nb-foreground)] sm:text-base"
            >
              Resume - Piyush Raj
            </h2>
            <p id={descriptionId} className="sr-only">
              Resume preview dialog. Press Escape to close.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              ref={closeButtonRef}
              type="button"
              className="flex h-8 w-8 items-center justify-center border-2 border-[var(--nb-border)] bg-[var(--nb-surface)] text-[var(--nb-foreground)] shadow-[3px_3px_0px_0px_var(--nb-shadow-color)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--nb-accent)] sm:h-9 sm:w-9"
              onClick={onClose}
              aria-label="Close resume modal"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 bg-[var(--nb-background)]">
          <iframe
            src="/resume.pdf"
            className="h-full w-full border-0 sm:hidden"
            title="Resume PDF mobile"
            loading="lazy"
            style={{ background: "white" }}
          />
          <iframe
            src="/resume.pdf"
            className="hidden h-full w-full border-0 sm:block"
            title="Resume PDF desktop"
            loading="lazy"
            style={{ background: "white" }}
          />
        </div>
      </div>
    </div>
  );
});

ResumeModal.displayName = "ResumeModal";

export default ResumeModal;
