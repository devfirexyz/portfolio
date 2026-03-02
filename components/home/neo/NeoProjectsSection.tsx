"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";

import { NeoButton } from "@/components/neo/NeoButton";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { NEO_PROJECTS } from "@/lib/data/neo-home";

export function NeoProjectsSection() {
  const [api, setApi] = useState<CarouselApi>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slideCount, setSlideCount] = useState(0);

  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCurrentIndex(api.selectedScrollSnap());
    };

    setSlideCount(api.scrollSnapList().length);
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
      className="border-b-2 border-[var(--nb-border)] bg-[var(--nb-background-alt)] px-4 py-20 sm:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-[var(--nb-foreground-muted)]">
              Work Samples
            </p>
            <h2 className="mt-2 text-4xl font-black uppercase leading-[0.9] tracking-[-0.05em] sm:text-6xl">
              Project Evidence
            </h2>
          </div>
          <p className="max-w-md text-base leading-relaxed text-[var(--nb-foreground-muted)]">
            Selected builds with measurable outcomes, production context, and implementation details.
          </p>
        </div>

        <Carousel
          setApi={setApi}
          opts={{ align: "start", loop: true }}
          className="w-full"
          aria-label="Projects carousel"
        >
          <CarouselContent className="-ml-0">
            {NEO_PROJECTS.map((project, index) => (
              <CarouselItem key={project.id} className="pl-0 md:basis-1/2">
                <article className="group mr-6 overflow-hidden border-2 border-[var(--nb-border)] bg-[var(--nb-surface)] shadow-[8px_8px_0px_0px_var(--nb-shadow-color)]">
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

                  <div className="space-y-5 p-6">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-2xl font-black uppercase leading-[0.95] tracking-[-0.03em] text-[var(--nb-foreground)]">
                        {project.title}
                      </h3>
                      <span className="shrink-0 border-2 border-[var(--nb-border)] bg-[var(--nb-surface-alt)] px-2 py-1 text-[12px] font-bold uppercase tracking-[0.14em] text-[var(--nb-foreground-muted)]">
                        {project.impactMetric}
                      </span>
                    </div>

                    <p className="text-base leading-relaxed text-[var(--nb-foreground-muted)]">
                      {project.description}
                    </p>
                    <p className="text-base leading-relaxed text-[var(--nb-foreground)]">
                      <span className="font-bold uppercase tracking-[0.1em] text-[var(--nb-accent-ink)]">
                        Impact:
                      </span>{" "}
                      {project.impact}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {project.stack.map((tag) => (
                        <span
                          key={tag}
                          className="border-2 border-[var(--nb-border)] bg-[var(--nb-surface-alt)] px-2 py-1 text-[12px] font-bold uppercase tracking-[0.14em] text-[var(--nb-foreground-muted)]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {project.href && !project.liveUnavailable ? (
                      <NeoButton asChild size="sm" variant="ghost">
                        <Link href={project.href} target="_blank" rel="noopener noreferrer">
                          Live Preview
                          <ArrowUpRight className="ml-2 h-4 w-4" />
                        </Link>
                      </NeoButton>
                    ) : project.href && project.liveUnavailable ? (
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
      </div>
    </section>
  );
}
