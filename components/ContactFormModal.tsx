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
  mode?: "default" | "resume-request";
}

const ContactFormModal = memo(({ onClose, mode = "default" }: ContactFormModalProps) => {
  const isResumeRequestMode = mode === "resume-request";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState(
    isResumeRequestMode ? "Resume request" : "",
  );
  const [message, setMessage] = useState(
    isResumeRequestMode
      ? "Hi Piyush,\nI would like to request your resume.\n\nThanks."
      : "",
  );
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
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 p-3 sm:p-5"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
    >
      <div
        className="max-h-[calc(100dvh-1.5rem)] w-full max-w-2xl overflow-y-auto border-2 border-[var(--nb-border)] bg-[var(--nb-surface)] shadow-[10px_10px_0px_0px_var(--nb-shadow-color)] sm:max-h-[calc(100dvh-2.5rem)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b-2 border-[var(--nb-border)] bg-[var(--nb-surface-alt)] px-4 py-3">
          <div>
            <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[var(--nb-foreground-muted)]">
              {isResumeRequestMode ? "Resume Access" : "Contact Me"}
            </p>
            <h2
              id={titleId}
              className="text-base font-black uppercase tracking-[0.08em] text-[var(--nb-foreground)] sm:text-lg"
            >
              {isResumeRequestMode
                ? "Request My Resume"
                : "Start a Project Conversation"}
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
          {isResumeRequestMode ? (
            <div className="border-2 border-[var(--nb-border)] bg-[var(--nb-accent)]/10 px-3 py-2 text-[13px] font-bold uppercase tracking-[0.1em] text-[var(--nb-foreground)]">
              To get my resume, drop me a quick email and I will share the
              latest copy.
            </div>
          ) : null}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-[13px] font-bold uppercase tracking-[0.12em] text-[var(--nb-foreground-muted)]">
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
                className="h-12 w-full border-2 border-[var(--nb-border)] bg-[var(--nb-background)] px-3 text-base text-[var(--nb-foreground)] outline-none transition-colors focus:border-[var(--nb-accent)]"
                placeholder="Your name"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-[13px] font-bold uppercase tracking-[0.12em] text-[var(--nb-foreground-muted)]">
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
                className="h-12 w-full border-2 border-[var(--nb-border)] bg-[var(--nb-background)] px-3 text-base text-[var(--nb-foreground)] outline-none transition-colors focus:border-[var(--nb-accent)]"
                placeholder="you@example.com"
              />
            </label>
          </div>

          <label className="block">
            <span className="mb-1 block text-[13px] font-bold uppercase tracking-[0.12em] text-[var(--nb-foreground-muted)]">
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
              className="h-12 w-full border-2 border-[var(--nb-border)] bg-[var(--nb-background)] px-3 text-base text-[var(--nb-foreground)] outline-none transition-colors focus:border-[var(--nb-accent)]"
              placeholder={
                isResumeRequestMode ? "Resume request" : "What are we building?"
              }
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-[13px] font-bold uppercase tracking-[0.12em] text-[var(--nb-foreground-muted)]">
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
              className="min-h-[150px] w-full border-2 border-[var(--nb-border)] bg-[var(--nb-background)] p-3 text-base text-[var(--nb-foreground)] outline-none transition-colors focus:border-[var(--nb-accent)]"
              placeholder={
                isResumeRequestMode
                  ? "Mention your role or context for the request."
                  : "Project scope, timeline, and goals."
              }
            />
          </label>

          {error ? (
            <p
              id={errorId}
              role="alert"
              className="rounded-full border-2 border-[var(--nb-border)] bg-[var(--nb-danger)] px-3 py-1 text-[13px] font-bold uppercase tracking-[0.1em] text-white"
            >
              {error}
            </p>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="rounded-full border-2 border-[var(--nb-border)] bg-[var(--nb-surface-alt)] px-3 py-1 text-[12px] font-bold uppercase tracking-[0.14em] text-[var(--nb-foreground-muted)]">
              Response channel: piyushraj888s@gmail.com
            </p>

            <button
              type="submit"
              disabled={isSubmitDisabled}
              className="h-12 border-2 border-[var(--nb-border)] bg-[var(--nb-accent)] px-6 text-sm font-black uppercase tracking-[0.14em] text-white shadow-[5px_5px_0px_0px_var(--nb-shadow-color)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0px_0px_var(--nb-shadow-color)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--nb-accent)] disabled:opacity-50"
            >
              {isResumeRequestMode ? "Request Resume" : "Send Message"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

ContactFormModal.displayName = "ContactFormModal";

export default ContactFormModal;
