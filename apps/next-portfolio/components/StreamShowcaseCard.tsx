"use client";

import React from "react";

interface StreamShowcaseCardProps {
  title: string;
  subtitle?: string;
  description: string;
  mainImage: string;
  mainImageAlt?: string;
  avatars?: {
    src: string;
    alt: string;
    label?: string;
  }[];
  liveIndicator?: boolean;
  viewerCount?: string;
  onClick?: () => void;
}

export function StreamShowcaseCard({
  title,
  subtitle,
  description,
  mainImage,
  mainImageAlt = "Showcase image",
  avatars = [],
  liveIndicator = false,
  viewerCount,
  onClick,
}: StreamShowcaseCardProps) {
  return (
    <div
      className="relative w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-16 bg-gradient-to-br from-[#3e3d83] to-[#5e68d9] rounded-[24px] sm:rounded-[88px] shadow-2xl"
      onClick={onClick}
    >
      <img
        src="/character_main.webp"
        alt="main character"
        width={100}
        height={133}
        className="absolute -mt-[120px] sm:-mt-[187px] hidden sm:flex sm:w-[150px] sm:h-[200px]"
      />
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-blue-600/10 to-transparent rounded-[3rem] blur-3xl" />

      {/* Main container with glassmorphism */}
      <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8 lg:gap-12 items-center">
        {/* Left Content Section */}
        <div className="text-white space-y-4 sm:space-y-6 z-10">
          <div className="space-y-2 sm:space-y-4">
            <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight uppercase tracking-tight">
              {title.split(" ").map((word, index) => (
                <span key={index} className="block">
                  {word}
                </span>
              ))}
              {subtitle && (
                <span className="block text-lg sm:text-3xl md:text-4xl lg:text-5xl">
                  {subtitle}
                </span>
              )}
            </h2>
          </div>

          <p className="text-sm sm:text-base md:text-lg text-white/80 leading-relaxed max-w-md">
            {description}
          </p>
        </div>

        {/* Right Card Section */}
        <div className="relative">
          {/* Glow effect behind card */}
          <div className="absolute -inset-4 bg-gradient-to-r from-green-500/30 via-purple-500/30 to-blue-500/30 rounded-[2rem] blur-2xl opacity-60" />

          {/* Card Container */}
          <div className="relative bg-black/40 backdrop-blur-xl rounded-[1rem] sm:rounded-[2rem] p-3 sm:p-6 border border-white/10 shadow-2xl">
            {/* Main Image Container */}
            <div className="relative rounded-lg sm:rounded-xl overflow-hidden aspect-video bg-gradient-to-br from-purple-900/50 to-blue-900/50">
              <img
                src={mainImage}
                alt={mainImageAlt}
                className="w-full h-full object-cover"
              />

              {/* Live Badge */}
              {liveIndicator && (
                <div className="absolute top-2 sm:top-4 right-2 sm:right-4 flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-red-600 rounded-full">
                  <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white rounded-full animate-pulse" />
                  <span className="text-white text-xs sm:text-sm font-semibold uppercase">
                    Live
                  </span>
                </div>
              )}

              {/* Viewer Count */}
              {viewerCount && (
                <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-black/60 backdrop-blur-md rounded-full">
                  <svg
                    className="w-3 sm:w-4 h-3 sm:h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path
                      fillRule="evenodd"
                      d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-white text-xs sm:text-sm font-medium">
                    {viewerCount}
                  </span>
                </div>
              )}
            </div>

            {/* Avatar Row */}
            {avatars.length > 0 && (
              <div className="flex items-center gap-3 mt-4 px-2">
                {avatars.map((avatar, index) => (
                  <div key={index} className="relative group flex-shrink-0">
                    {/* Avatar Container */}
                    <div className="relative w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-lg sm:rounded-xl overflow-hidden bg-gradient-to-br from-purple-600 to-blue-600 p-0.5 transition-transform duration-200 hover:scale-105">
                      <div className="w-full h-full rounded-lg sm:rounded-xl overflow-hidden bg-black">
                        <img
                          src={avatar.src}
                          alt={avatar.alt}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Label */}
                    {avatar.label && (
                      <div className="absolute -bottom-1 sm:-bottom-2 left-1/2 transform -translate-x-1/2 bg-purple-600/90 backdrop-blur-sm text-white text-xs font-medium px-1.5 sm:px-2 py-0.5 rounded-full whitespace-nowrap">
                        {avatar.label}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import { ModernCarousel } from "./ModernCarousel";

// Sample project data
const projects = [
  {
    title: "CONVOBASE",
    subtitle: "👷 THIS CURRENTLY ON THE SIDE ✨",
    description: "Modern chat infrastructure for AI-first companies. Replace legacy platforms with APIs designed for streaming conversations, intelligent context, and Bring Your Own Cloud deployment.",
    mainImage: "/convobase.png",
    liveIndicator: true,
    viewerCount: "2.3k",
    onClick: () => window.open("https://convobase.app", "_blank"),
    avatars: [
      {
        src: "https://tanstack.com/images/logos/logo-color-600.png",
        alt: "tanstack_start",
        label: "Tanstack Start",
      },
      {
        src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNq0QOFcaHlf2FUGgNwUAZrrw41XGen9BeGg&s",
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
        alt: "GO-Lang",
        label: "GO-Lang",
      },
    ]
  },
  {
    title: "MY GPT-11",
    subtitle: "AI-Powered Fantasy Cricket Teams",
    description: "Our AI analyzes player statistics, recent form, pitch conditions, and historical data to create optimized fantasy teams.",
    mainImage: "/gpt11.png",
    liveIndicator: false,
    viewerCount: "1.8k",
    onClick: () => window.open("https://www.mygpt11.com/", "_blank"),
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
        alt: "Tailwind",
        label: "Tailwind",
      },
    ]
  }
];

export function DefaultStreamShowcase() {
  return (
    <div className="relative bg-[#21237e] sm:pb-[500px] pb-48 pt-20 sm:pt-40 hidden lg:block">
      {/* Optimized Twinkling Star Field */}
      <div className="absolute inset-0 w-full h-full">
        {Array.from({ length: 125 }).map((_, i) => {
          const seed = i * 9876544;
          const left = seed % 100;
          const top = (seed * 7) % 100;
          const delay = ((seed * 3) % 12000) / 1000;
          const size = (seed % 4) + 1;
          const brightness = (seed % 5) + 3;
          const blinkSpeed = (seed % 3) + 2;

          return (
            <div
              key={`star-${i}`}
              className={`absolute animate-twinkle animation-delay-${Math.floor(
                delay
              )}`}
              style={{
                left: `${left}%`,
                top: `${top}%`,
                animationDuration: `${blinkSpeed + (i % 3)}s`,
              }}
            >
              <div
                className={`bg-white rounded-full`}
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  filter: "blur(0.5px)",
                  opacity: brightness / 10,
                  boxShadow: `0 0 ${size * 2}px rgba(255, 255, 255, ${
                    brightness / 10
                  })`,
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse animation-delay-2" />
      </div>

      {/* Section Title */}
      <div className="relative z-10 text-center mb-16 px-4">
        <h1 className="font-black text-white uppercase tracking-tight sm:mt-20 sm:mb-20 mb-10">
          <span
            className="block animate-bounce text-[28px] xs:text-[32px] sm:text-[40px] md:text-[48px] lg:text-[52px] xl:text-[64px] 2xl:text-[72px] leading-[0.9] font-extrabold bg-gradient-to-r from-[#58f262] via-[#3ab4ff] to-[#fc34d8] bg-clip-text text-transparent animate-gradient-text"
            style={{
              fontFamily: "Alan Sans",
              animationDelay: "0.2s",
            }}
          >
            WhAt HaVe I b33n DOING ?
          </span>
        </h1>
      </div>

      {/* Modern Carousel */}
      <div className="relative z-10 px-4">
        <ModernCarousel
          autoPlay={true}
          autoPlayInterval={6000}
          showDots={true}
          showArrows={true}
          className="w-full mx-auto"
        >
          {projects.map((project, index) => (
            <StreamShowcaseCard
              key={index}
              title={project.title}
              subtitle={project.subtitle}
              description={project.description}
              mainImage={project.mainImage}
              mainImageAlt={`${project.title} project`}
              liveIndicator={project.liveIndicator}
              viewerCount={project.viewerCount}
              onClick={project.onClick}
              avatars={project.avatars}
            />
          ))}
        </ModernCarousel>
      </div>
    </div>
  );
}
