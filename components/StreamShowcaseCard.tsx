"use client";

import React from "react";

import { ModernCarousel } from "./ModernCarousel";

interface ShowcaseAvatar {
  src: string;
  alt: string;
  label?: string;
}

interface StreamShowcaseCardProps {
  title: string;
  subtitle?: string;
  description: string;
  mainImage: string;
  mainImageAlt?: string;
  projectUrl?: string;
  avatars?: ShowcaseAvatar[];
  liveIndicator?: boolean;
  viewerCount?: string;
}

export function StreamShowcaseCard({
  title,
  subtitle,
  description,
  mainImage,
  mainImageAlt = "Showcase image",
  projectUrl,
  avatars = [],
  liveIndicator = false,
  viewerCount,
}: StreamShowcaseCardProps) {
  return (
    <article
      className="relative mx-auto w-full max-w-7xl rounded-[24px] bg-gradient-to-br from-[#32357f] via-[#4f5ac9] to-[#3555a7] px-3 py-8 shadow-2xl transition-transform duration-300 hover:-translate-y-1 sm:rounded-[64px] sm:px-6 sm:py-16 lg:px-8"
    >
      <img
        src="/character_main.webp"
        alt="main character"
        width={100}
        height={133}
        className="animate-subtle-float absolute -mt-[120px] hidden sm:flex sm:h-[200px] sm:w-[150px] sm:-mt-[187px]"
      />

      <div className="relative grid grid-cols-1 items-center gap-6 lg:grid-cols-2 lg:gap-12">
        <div className="space-y-4 text-white sm:space-y-6">
          <h2 className="text-2xl font-black uppercase leading-tight tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
            {title.split(" ").map((word) => (
              <span key={word} className="block">
                {word}
              </span>
            ))}
            {subtitle && <span className="block text-lg sm:text-3xl md:text-4xl">{subtitle}</span>}
          </h2>

          <p className="max-w-md text-sm leading-relaxed text-white/85 sm:text-base md:text-lg">
            {description}
          </p>
        </div>

        <div className="relative">
          <div className="rounded-[1rem] border border-[#9fb4ff]/30 bg-black/35 p-3 shadow-2xl backdrop-blur-xl transition-colors duration-300 hover:border-[#b8ffdb]/45 sm:rounded-[2rem] sm:p-6">
            <div className="relative aspect-video overflow-hidden rounded-lg bg-gradient-to-br from-purple-900/50 to-blue-900/50 sm:rounded-xl">
              <img
                src={mainImage}
                alt={mainImageAlt}
                width={1280}
                height={720}
                loading="lazy"
                className="h-full w-full object-cover"
              />

              {liveIndicator && (
                <div className="absolute right-2 top-2 flex items-center gap-2 rounded-full bg-red-600 px-2 py-1 sm:right-4 sm:top-4 sm:px-3 sm:py-1.5">
                  <div className="h-2 w-2 rounded-full bg-white" />
                  <span className="text-xs font-semibold uppercase text-white sm:text-sm">Live</span>
                </div>
              )}

              {viewerCount && (
                <div className="absolute bottom-2 left-2 flex items-center gap-2 rounded-full bg-black/60 px-2 py-1 backdrop-blur-md sm:bottom-4 sm:left-4 sm:px-3 sm:py-1.5">
                  <svg className="h-3 w-3 text-white sm:h-4 sm:w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path
                      fillRule="evenodd"
                      d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-xs font-medium text-white sm:text-sm">{viewerCount}</span>
                </div>
              )}
            </div>

            {avatars.length > 0 && (
              <div className="mt-4 flex items-center gap-3 px-2">
                {avatars.map((avatar) => (
                  <div key={`${avatar.alt}-${avatar.label}`} className="relative shrink-0">
                    <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 p-0.5 sm:h-16 sm:w-16 sm:rounded-xl md:h-20 md:w-20">
                      <div className="h-full w-full overflow-hidden rounded-lg bg-black sm:rounded-xl">
                        <img
                          src={avatar.src}
                          alt={avatar.alt}
                          width={80}
                          height={80}
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </div>

                    {avatar.label && (
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-purple-600/90 px-1.5 py-0.5 text-xs font-medium text-white backdrop-blur-sm sm:-bottom-2 sm:px-2">
                        {avatar.label}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {projectUrl && (
              <div className="mt-4 px-2">
                <a
                  href={projectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex rounded-full border border-white/30 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
                >
                  Open Project
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

const projects = [
  {
    title: "CONVOBASE",
    subtitle: "Infrastructure for AI conversations",
    description:
      "Modern chat infrastructure for AI-first companies. Replace legacy platforms with APIs designed for streaming conversations, intelligent context, and Bring Your Own Cloud deployment.",
    mainImage: "/convobase.png",
    liveIndicator: true,
    viewerCount: "2.3k",
    projectUrl: "https://convobase.app",
    avatars: [
      {
        src: "https://tanstack.com/images/logos/logo-color-600.png",
        alt: "Tanstack Start",
        label: "Tanstack Start",
      },
      {
        src: "https://www.typescriptlang.org/favicon-32x32.png",
        alt: "TypeScript",
        label: "TypeScript",
      },
      {
        src: "https://cdn.prod.website-files.com/626a25d633b1b99aa0e1afa7/686e6f89b9a5b88ba66f8287_image1.jpg",
        alt: "BYOC",
        label: "BYOC",
      },
      {
        src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1xATUSgtKnWPtxuTElYHK79kG5uvqlQefEw&s",
        alt: "Go",
        label: "Go",
      },
    ],
  },
  {
    title: "MY GPT-11",
    subtitle: "AI fantasy cricket engine",
    description:
      "AI-driven fantasy team generation using player form, pitch conditions, and historical data to optimize outcomes.",
    mainImage: "/gpt11.png",
    liveIndicator: false,
    viewerCount: "1.8k",
    projectUrl: "https://www.mygpt11.com/",
    avatars: [
      {
        src: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/512px-React-icon.svg.png",
        alt: "React",
        label: "React",
      },
      {
        src: "https://assets.vercel.com/image/upload/v1662130559/nextjs/Icon_light_background.png",
        alt: "Next.js",
        label: "Next.js",
      },
      {
        src: "https://www.typescriptlang.org/favicon-32x32.png",
        alt: "TypeScript",
        label: "TypeScript",
      },
      {
        src: "https://tailwindcss.com/favicons/favicon-32x32.png",
        alt: "Tailwind CSS",
        label: "Tailwind",
      },
    ],
  },
];

export function DefaultStreamShowcase() {
  return (
    <section className="relative hidden bg-[radial-gradient(circle_at_15%_20%,#2e3ca6_0%,#21237e_45%,#16195c_100%)] pb-48 pt-20 sm:pb-[500px] sm:pt-40 lg:block">
      <div className="animate-soft-glow absolute left-16 top-10 h-60 w-60 rounded-full bg-[#58f262]/20 blur-3xl" />
      <div className="animate-soft-glow absolute bottom-16 right-24 h-72 w-72 rounded-full bg-[#3ab4ff]/20 blur-3xl [animation-delay:1.2s]" />
      <div className="relative z-10 mb-10 px-4 text-center sm:mb-20 sm:mt-20">
        <h2 className="font-black uppercase tracking-tight text-white">
          <span
            className="block bg-gradient-to-r from-[#58f262] via-[#3ab4ff] to-[#fc34d8] bg-clip-text text-[32px] font-extrabold leading-[0.9] text-transparent sm:text-[44px] md:text-[56px] lg:text-[64px]"
            style={{ fontFamily: "Alan Sans" }}
          >
            What Have I Been Doing?
          </span>
        </h2>
      </div>

      <div className="relative z-10 px-4">
        <ModernCarousel autoPlay={false} showDots showArrows className="mx-auto w-full">
          {projects.map((project) => (
            <StreamShowcaseCard
              key={project.title}
              title={project.title}
              subtitle={project.subtitle}
              description={project.description}
              mainImage={project.mainImage}
              mainImageAlt={`${project.title} project`}
              projectUrl={project.projectUrl}
              liveIndicator={project.liveIndicator}
              viewerCount={project.viewerCount}
              avatars={project.avatars}
            />
          ))}
        </ModernCarousel>
      </div>
    </section>
  );
}
