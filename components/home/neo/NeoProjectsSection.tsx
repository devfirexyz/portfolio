"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";

import { NeoButton } from "@/components/neo/NeoButton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { NEO_PROJECTS, type NeoProject } from "@/lib/data/neo-home";

const CARD_DESCRIPTION_LIMIT = 130;
const CARD_IMPACT_LIMIT = 105;
const MAX_STACK_CHIPS = 3;

function truncateCopy(text: string, maxLength: number) {
  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength).trimEnd()}...`;
}

export function NeoProjectsSection() {
  const [api, setApi] = useState<CarouselApi>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slideCount, setSlideCount] = useState(0);
  const [selectedProject, setSelectedProject] = useState<NeoProject | null>(null);

  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCurrentIndex(api.selectedScrollSnap());
      setSlideCount(api.scrollSnapList().length);
    };

    onSelect();
    api.on("select", onSelect);
    api.on("reInit", onSelect);

    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api]);

  return (
    <section
      id="projects"
      className="min-h-[720px] border-b-2 border-[var(--nb-border)] bg-[var(--nb-background-alt)] px-4 py-16 sm:px-8 sm:py-20 md:min-h-[780px] lg:min-h-[900px]"
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

        <Carousel
          setApi={setApi}
          opts={{ align: "start", loop: true }}
          className="w-full"
          aria-label="Projects carousel"
        >
          <CarouselContent className="-ml-0 pb-5 pt-1 md:pb-6">
            {NEO_PROJECTS.map((project, index) => (
              <CarouselItem key={project.id} className="pl-0 pb-2 md:basis-1/2">
                <article
                  role="button"
                  tabIndex={0}
                  aria-label={`Open details for ${project.title}`}
                  onClick={() => setSelectedProject(project)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setSelectedProject(project);
                    }
                  }}
                  className="group mr-4 flex h-[560px] cursor-pointer flex-col overflow-hidden border-2 border-[var(--nb-border)] bg-[var(--nb-surface)] shadow-[8px_8px_0px_0px_var(--nb-shadow-color)] transition-transform duration-150 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--nb-accent)] sm:mr-6 sm:h-[620px] md:h-[680px] xl:h-[700px]"
                >
                  <div className="relative aspect-[16/10] border-b-2 border-[var(--nb-border)] bg-[var(--nb-surface-muted)]">
                    <Image
                      src={project.image}
                      alt={`${project.title} preview`}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      quality={70}
                      priority={index === 0}
                      className="object-cover transition-transform duration-200 group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <span className="absolute left-4 top-4 border-2 border-[var(--nb-border)] bg-[var(--nb-surface-strong)] px-2 py-1 text-[12px] font-bold uppercase tracking-[0.16em] text-[var(--nb-accent-ink-inverse)]">
                      {project.status}
                    </span>
                  </div>

                  <div className="flex h-full flex-col gap-3 p-4 sm:gap-5 sm:p-6">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-lg font-black uppercase leading-[0.95] tracking-[-0.03em] text-[var(--nb-foreground)] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] overflow-hidden sm:text-xl sm:[-webkit-line-clamp:3] md:text-2xl">
                        {project.title}
                      </h3>
                      <span className="shrink-0 border-2 border-[var(--nb-border)] bg-[var(--nb-surface-alt)] px-2 py-1 text-[12px] font-bold uppercase tracking-[0.14em] text-[var(--nb-foreground-muted)]">
                        {project.impactMetric}
                      </span>
                    </div>

                    <div className="min-h-[118px] space-y-2 sm:min-h-[168px] sm:space-y-4">
                      <p className="text-[14px] leading-relaxed text-[var(--nb-foreground-muted)] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] overflow-hidden sm:text-base sm:[-webkit-line-clamp:3]">
                        {truncateCopy(project.description, CARD_DESCRIPTION_LIMIT)}
                      </p>
                      <p className="text-[14px] leading-relaxed text-[var(--nb-foreground)] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] overflow-hidden sm:text-base sm:[-webkit-line-clamp:3]">
                        <span className="font-bold uppercase tracking-[0.1em] text-[var(--nb-accent-ink)]">
                          Impact:
                        </span>{" "}
                        {truncateCopy(project.impact, CARD_IMPACT_LIMIT)}
                      </p>
                    </div>

                    <div className="flex min-h-[62px] flex-wrap content-start gap-2 sm:min-h-[76px]">
                      {project.stack.slice(0, MAX_STACK_CHIPS).map((tag) => (
                        <span
                          key={tag}
                          className="border-2 border-[var(--nb-border)] bg-[var(--nb-surface-alt)] px-2 py-1 text-[12px] font-bold uppercase tracking-[0.14em] text-[var(--nb-foreground-muted)]"
                        >
                          {tag}
                        </span>
                      ))}
                      {project.stack.length > MAX_STACK_CHIPS ? (
                        <span className="border-2 border-[var(--nb-border)] bg-[var(--nb-surface-strong)] px-2 py-1 text-[12px] font-bold uppercase tracking-[0.14em] text-[var(--nb-foreground-subtle)]">
                          +{project.stack.length - MAX_STACK_CHIPS} more
                        </span>
                      ) : null}
                    </div>

                    <div className="mt-auto flex items-center justify-between gap-2 border-t-2 border-[var(--nb-border)] pt-3 sm:pt-4">
                      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--nb-foreground-subtle)] sm:text-[12px]">
                        Tap for full details
                      </p>
                      <NeoButton
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={(event) => {
                          event.stopPropagation();
                          setSelectedProject(project);
                        }}
                      >
                        View Full
                      </NeoButton>
                    </div>
                  </div>
                </article>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {Array.from({ length: slideCount }).map((_, index) => (
              <button
                key={`project-dot-${index}`}
                type="button"
                className={`h-3 border-2 border-[var(--nb-border)] transition-all duration-150 ${
                  index === currentIndex
                    ? "w-10 bg-[var(--nb-accent)]"
                    : "w-3 bg-[var(--nb-surface-alt)] hover:bg-[var(--nb-surface-muted)]"
                }`}
                onClick={() => api?.scrollTo(index)}
                aria-label={`Go to project ${index + 1}`}
                aria-pressed={index === currentIndex}
              />
            ))}
          </div>

          <div className="flex items-center gap-3">
            <NeoButton
              type="button"
              size="sm"
              variant="ghost"
              className="h-10 w-10 px-0"
              onClick={() => api?.scrollPrev()}
              aria-label="Previous project"
            >
              <ArrowLeft className="h-4 w-4" />
            </NeoButton>
            <NeoButton
              type="button"
              size="sm"
              variant="ghost"
              className="h-10 w-10 px-0"
              onClick={() => api?.scrollNext()}
              aria-label="Next project"
            >
              <ArrowRight className="h-4 w-4" />
            </NeoButton>
          </div>
        </div>

        <Dialog
          open={Boolean(selectedProject)}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedProject(null);
            }
          }}
        >
          <DialogContent className="max-h-[92dvh] w-[calc(100vw-1rem)] max-w-5xl overflow-y-auto border-[3px] border-[var(--nb-border)] bg-[var(--nb-surface)] p-0 shadow-[14px_14px_0px_0px_var(--nb-shadow-color)] sm:w-[calc(100vw-2rem)] md:overflow-hidden data-[state=open]:animate-none data-[state=closed]:animate-none data-[state=open]:[animation:neo-modal-in_260ms_cubic-bezier(0.16,1,0.3,1)] data-[state=closed]:[animation:neo-modal-out_170ms_ease-in_forwards] motion-reduce:data-[state=open]:[animation:none] motion-reduce:data-[state=closed]:[animation:none] [&>button]:right-3 [&>button]:top-3 [&>button]:inline-flex [&>button]:h-9 [&>button]:w-9 [&>button]:items-center [&>button]:justify-center [&>button]:border-[2px] [&>button]:border-[var(--nb-border)] [&>button]:bg-[var(--nb-surface-strong)] [&>button]:p-0 [&>button]:text-[var(--nb-accent-ink)] [&>button]:leading-none [&>button]:shadow-[4px_4px_0px_0px_var(--nb-shadow-color)] [&>button]:hover:translate-x-[1px] [&>button]:hover:translate-y-[1px] [&>button]:hover:shadow-[2px_2px_0px_0px_var(--nb-shadow-color)] [&>button_svg]:h-4 [&>button_svg]:w-4 md:[&>button]:right-4 md:[&>button]:top-4">
            {selectedProject ? (
              <div className="grid md:max-h-[88vh] md:grid-cols-[1.08fr_1fr] lg:grid-cols-[1.12fr_1fr]">
                <div className="relative min-h-[220px] border-b-2 border-[var(--nb-border)] bg-[var(--nb-surface-muted)] md:min-h-[620px] md:border-b-0 md:border-r-2 lg:min-h-[640px]">
                  <Image
                    src={selectedProject.image}
                    alt={`${selectedProject.title} preview`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(88,101,242,0.3),transparent_56%)]" />
                  <span className="absolute left-4 top-4 border-2 border-[var(--nb-border)] bg-[var(--nb-surface-strong)] px-2 py-1 text-[12px] font-bold uppercase tracking-[0.16em] text-[var(--nb-accent-ink-inverse)]">
                    {selectedProject.status}
                  </span>
                </div>

                <div className="relative space-y-5 bg-[linear-gradient(160deg,var(--nb-surface)_0%,#2f3745_100%)] p-5 sm:p-8 md:space-y-6 md:overflow-y-auto md:p-9">
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[var(--nb-accent)]/25 to-transparent" />

                  <DialogHeader className="relative space-y-4 text-left">
                    <div className="inline-flex w-fit border-2 border-[var(--nb-border)] bg-[var(--nb-surface-strong)] px-2 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--nb-accent-ink)]">
                      Project Detail
                    </div>
                    <DialogTitle className="text-3xl font-black uppercase leading-[0.9] tracking-[-0.05em] sm:text-[2.55rem]">
                      {selectedProject.title}
                    </DialogTitle>
                    <DialogDescription className="text-base leading-relaxed text-[var(--nb-foreground-muted)]">
                      {selectedProject.description}
                    </DialogDescription>
                  </DialogHeader>

                  <div className="relative border-2 border-[var(--nb-border)] bg-[var(--nb-surface-alt)] p-4 shadow-[5px_5px_0px_0px_var(--nb-shadow-color)]">
                    <p className="text-sm font-bold uppercase tracking-[0.16em] text-[var(--nb-accent-ink)]">
                      Impact
                    </p>
                    <p className="mt-2 text-base leading-relaxed text-[var(--nb-foreground)]">
                      {selectedProject.impact}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm font-bold uppercase tracking-[0.16em] text-[var(--nb-foreground-subtle)]">
                      Stack
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.stack.map((tag) => (
                        <span
                          key={tag}
                          className="border-2 border-[var(--nb-border)] bg-[var(--nb-surface)] px-2 py-1 text-[12px] font-bold uppercase tracking-[0.14em] text-[var(--nb-foreground-muted)]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 border-t-2 border-[var(--nb-border)] pt-5">
                    <div className="border-2 border-[var(--nb-border)] bg-[var(--nb-surface-strong)] px-2 py-1 text-[12px] font-bold uppercase tracking-[0.14em] text-[var(--nb-accent-ink)]">
                      {selectedProject.impactMetric}
                    </div>
                    {selectedProject.href && !selectedProject.liveUnavailable ? (
                      <NeoButton asChild size="sm" variant="ghost">
                        <Link
                          href={selectedProject.href}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Live Preview
                          <ArrowUpRight className="ml-2 h-4 w-4" />
                        </Link>
                      </NeoButton>
                    ) : selectedProject.href && selectedProject.liveUnavailable ? (
                      <NeoButton
                        type="button"
                        size="sm"
                        variant="ghost"
                        disabled
                        aria-disabled="true"
                        title="Live preview is temporarily unavailable"
                      >
                        Live Preview Unavailable
                      </NeoButton>
                    ) : (
                      <div className="inline-flex border-2 border-[var(--nb-border)] bg-[var(--nb-surface-alt)] px-3 py-2 text-[12px] font-bold uppercase tracking-[0.14em] text-[var(--nb-foreground-subtle)]">
                        Case Study on Request
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : null}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
