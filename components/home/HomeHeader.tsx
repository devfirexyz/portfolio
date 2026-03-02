import Link from "next/link";
import { useEffect } from "react";
import { Github, Linkedin, Menu, Twitter, X } from "lucide-react";

import { SOCIAL_LINKS } from "@/lib/data/home-content";
import { ThemeToggle } from "@/components/ThemeToggle";

interface HomeHeaderProps {
  isMenuOpen: boolean;
  onToggleMenu: () => void;
  onCloseMenu: () => void;
}

function SocialIcon({ icon }: { icon: (typeof SOCIAL_LINKS)[number]["icon"] }) {
  if (icon === "github") return <Github className="h-5 w-5" />;
  if (icon === "linkedin") return <Linkedin className="h-5 w-5" />;
  return <Twitter className="h-5 w-5" />;
}

export function HomeHeader({
  isMenuOpen,
  onToggleMenu,
  onCloseMenu,
}: HomeHeaderProps) {
  useEffect(() => {
    if (!isMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onCloseMenu();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isMenuOpen, onCloseMenu]);

  return (
    <>
      <nav className="fixed top-0 z-50 w-full border-b-2 border-[var(--nb-border)] bg-[var(--nb-background)]/95 px-4 py-3 backdrop-blur sm:px-6 lg:px-10">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-3">
          <Link
            href="/"
            className="inline-flex border-2 border-[var(--nb-border)] bg-[var(--nb-surface)] px-3 py-2 text-base font-bold uppercase tracking-[0.16em] text-[var(--nb-foreground)] shadow-[4px_4px_0px_0px_var(--nb-shadow-color)]"
          >
            piyushraj.sys
          </Link>

          {/* <div className="hidden items-center border-2 border-[var(--nb-border)] bg-[var(--nb-surface-alt)] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--nb-foreground-muted)] lg:flex">
            portfolio node :: live
          </div> */}

          <div className="flex items-center gap-3">
            <Link
              href="/blog"
              className="neo-link hidden text-sm font-bold uppercase tracking-[0.14em] text-[var(--nb-foreground)] md:block"
            >
              Blogs
            </Link>

            <Link
              href="/#projects"
              className="neo-link hidden text-sm font-bold uppercase tracking-[0.14em] text-[var(--nb-foreground)] md:block"
            >
              Projects
            </Link>

            <div className="hidden items-center gap-3 md:flex">
              {SOCIAL_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 w-10 items-center justify-center border-2 border-[var(--nb-border)] bg-[var(--nb-surface)] text-[var(--nb-foreground)] shadow-[4px_4px_0px_0px_var(--nb-shadow-color)] transition-all duration-150 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_var(--nb-shadow-color)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--nb-accent)]"
                  aria-label={link.label}
                >
                  <SocialIcon icon={link.icon} />
                </Link>
              ))}
            </div>

            <div className="hidden md:block">
              <ThemeToggle />
            </div>

            <button
              type="button"
              className="border-2 border-[var(--nb-border)] bg-[var(--nb-surface)] p-2 text-[var(--nb-foreground)] shadow-[4px_4px_0px_0px_var(--nb-shadow-color)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--nb-accent)] md:hidden"
              onClick={onToggleMenu}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-nav-menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {isMenuOpen && (
        <div
          id="mobile-nav-menu"
          className="fixed left-0 right-0 top-[72px] z-40 border-b-2 border-[var(--nb-border)] bg-[var(--nb-background)] p-6 md:hidden"
        >
          <Link
            href="/blog"
            className="neo-link block py-2 text-sm font-bold uppercase tracking-[0.14em] text-[var(--nb-foreground)]"
            onClick={onCloseMenu}
          >
            Blogs
          </Link>

          <Link
            href="/#projects"
            className="neo-link block py-2 text-sm font-bold uppercase tracking-[0.14em] text-[var(--nb-foreground)]"
            onClick={onCloseMenu}
          >
            Projects
          </Link>

          <div className="mt-5 flex gap-3">
            {SOCIAL_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center border-2 border-[var(--nb-border)] bg-[var(--nb-surface)] text-[var(--nb-foreground)] shadow-[4px_4px_0px_0px_var(--nb-shadow-color)]"
                onClick={onCloseMenu}
                aria-label={link.label}
              >
                <SocialIcon icon={link.icon} />
              </Link>
            ))}
          </div>

          <div className="mt-5 md:hidden">
            <ThemeToggle />
          </div>
        </div>
      )}
    </>
  );
}
