"use client";

import {
  memo,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { X } from "lucide-react";

interface ContactFormModalProps {
  onClose: () => void;
}

const ContactFormModal = memo(({ onClose }: ContactFormModalProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  const errorId = useId();

  const isSubmitDisabled = useMemo(
    () => !name.trim() || !email.trim() || !subject.trim() || !message.trim(),
    [email, message, name, subject],
  );

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

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitDisabled) {
      setError("Please complete all fields before sending.");
      return;
    }

    const mailSubject = encodeURIComponent(
      `[Portfolio Contact] ${subject.trim()}`,
    );
    const mailBody = encodeURIComponent(
      `Name: ${name.trim()}\nEmail: ${email.trim()}\n\nMessage:\n${message.trim()}`,
    );

    window.location.href = `mailto:piyushraj888s@gmail.com?subject=${mailSubject}&body=${mailBody}`;
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 sm:p-5"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
    >
      <div
        className="w-full max-w-2xl border-2 border-[var(--nb-border)] bg-[var(--nb-surface)] shadow-[10px_10px_0px_0px_var(--nb-shadow-color)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b-2 border-[var(--nb-border)] bg-[var(--nb-surface-alt)] px-4 py-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--nb-foreground-muted)]">
              Contact Me
            </p>
            <h2
              id={titleId}
              className="text-sm font-black uppercase tracking-[0.08em] text-[var(--nb-foreground)] sm:text-base"
            >
              Start a Project Conversation
            </h2>
            <p id={descriptionId} className="sr-only">
              Press Escape to close this dialog.
            </p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            className="flex h-9 w-9 items-center justify-center border-2 border-[var(--nb-border)] bg-[var(--nb-surface)] text-[var(--nb-foreground)] shadow-[3px_3px_0px_0px_var(--nb-shadow-color)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--nb-accent)]"
            onClick={onClose}
            aria-label="Close contact form"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form className="space-y-4 p-4 sm:p-6" onSubmit={onSubmit}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--nb-foreground-muted)]">
                Name
              </span>
              <input
                id="contact-name"
                name="name"
                autoComplete="name"
                required
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                  if (error) setError("");
                }}
                aria-describedby={error ? errorId : undefined}
                className="h-12 w-full border-2 border-[var(--nb-border)] bg-[var(--nb-background)] px-3 text-sm text-[var(--nb-foreground)] outline-none transition-colors focus:border-[var(--nb-accent)]"
                placeholder="Your name"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--nb-foreground-muted)]">
                Email
              </span>
              <input
                id="contact-email"
                name="email"
                autoComplete="email"
                required
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  if (error) setError("");
                }}
                aria-describedby={error ? errorId : undefined}
                className="h-12 w-full border-2 border-[var(--nb-border)] bg-[var(--nb-background)] px-3 text-sm text-[var(--nb-foreground)] outline-none transition-colors focus:border-[var(--nb-accent)]"
                placeholder="you@example.com"
              />
            </label>
          </div>

          <label className="block">
            <span className="mb-1 block text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--nb-foreground-muted)]">
              Subject
            </span>
            <input
              id="contact-subject"
              name="subject"
              required
              value={subject}
              onChange={(event) => {
                setSubject(event.target.value);
                if (error) setError("");
              }}
              aria-describedby={error ? errorId : undefined}
              className="h-12 w-full border-2 border-[var(--nb-border)] bg-[var(--nb-background)] px-3 text-sm text-[var(--nb-foreground)] outline-none transition-colors focus:border-[var(--nb-accent)]"
              placeholder="What are we building?"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--nb-foreground-muted)]">
              Message
            </span>
            <textarea
              id="contact-message"
              name="message"
              required
              value={message}
              onChange={(event) => {
                setMessage(event.target.value);
                if (error) setError("");
              }}
              aria-describedby={error ? errorId : undefined}
              className="min-h-[150px] w-full border-2 border-[var(--nb-border)] bg-[var(--nb-background)] p-3 text-sm text-[var(--nb-foreground)] outline-none transition-colors focus:border-[var(--nb-accent)]"
              placeholder="Project scope, timeline, and goals."
            />
          </label>

          {error ? (
            <p
              id={errorId}
              role="alert"
              className="rounded-full border-2 border-[var(--nb-border)] bg-[var(--nb-danger)] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.1em] text-white"
            >
              {error}
            </p>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="rounded-full border-2 border-[var(--nb-border)] bg-[var(--nb-surface-alt)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--nb-foreground-muted)]">
              Response channel: piyushraj888s@gmail.com
            </p>

            <button
              type="submit"
              disabled={isSubmitDisabled}
              className="h-12 border-2 border-[var(--nb-border)] bg-[var(--nb-accent)] px-6 text-xs font-black uppercase tracking-[0.14em] text-white shadow-[5px_5px_0px_0px_var(--nb-shadow-color)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0px_0px_var(--nb-shadow-color)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--nb-accent)] disabled:opacity-50"
            >
              Send Message
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

ContactFormModal.displayName = "ContactFormModal";

export default ContactFormModal;
