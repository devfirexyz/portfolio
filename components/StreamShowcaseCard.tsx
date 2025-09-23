"use client";

import React, { useMemo } from "react";
import Image from "next/image";

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
      className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-gradient-to-br from-[#3e3d83] to-[#5e68d9] sm:rounded-[88px] shadow-2xl"
      onClick={onClick}
    >
      <img
        src="/character_main.webp"
        alt="main character"
        width={150}
        height={200}
        className="absolute -mt-[167px] hidden sm:flex"
      />
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-blue-600/10 to-transparent rounded-[3rem] blur-3xl" />

      {/* Main container with glassmorphism */}
      <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Left Content Section */}
        <div className="text-white space-y-6 z-10">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight uppercase tracking-tight">
              {title.split(" ").map((word, index) => (
                <span key={index} className="block">
                  {word}
                </span>
              ))}
              {subtitle && (
                <span className="block text-3xl md:text-4xl lg:text-5xl">
                  {subtitle}
                </span>
              )}
            </h2>
          </div>

          <p className="text-base md:text-lg text-white/80 leading-relaxed max-w-md">
            {description}
          </p>
        </div>

        {/* Right Card Section */}
        <div className="relative">
          {/* Glow effect behind card */}
          <div className="absolute -inset-4 bg-gradient-to-r from-green-500/30 via-purple-500/30 to-blue-500/30 rounded-[2rem] blur-2xl opacity-60" />

          {/* Card Container */}
          <div className="relative bg-black/40 backdrop-blur-xl rounded-[2rem] p-4 border border-white/10 shadow-2xl">
            {/* Main Image Container */}
            <div className="relative rounded-xl overflow-hidden aspect-video bg-gradient-to-br from-purple-900/50 to-blue-900/50">
              <img
                src={mainImage}
                alt={mainImageAlt}
                className="w-full h-full object-cover"
              />

              {/* Live Badge */}
              {liveIndicator && (
                <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-red-600 rounded-full">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  <span className="text-white text-sm font-semibold uppercase">
                    Live
                  </span>
                </div>
              )}

              {/* Viewer Count */}
              {viewerCount && (
                <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-full">
                  <svg
                    className="w-4 h-4 text-white"
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
                  <span className="text-white text-sm font-medium">
                    {viewerCount}
                  </span>
                </div>
              )}
            </div>

            {/* Avatar Row */}
            {avatars.length > 0 && (
              <div className="flex items-center gap-3 mt-4 px-2">
                {avatars.map((avatar, index) => (
                  <div key={index} className="relative group">
                    {/* Avatar Container */}
                    <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden bg-gradient-to-br from-purple-600 to-blue-600 p-0.5 transition-transform duration-200 hover:scale-105">
                      <div className="w-full h-full rounded-xl overflow-hidden bg-black">
                        <img
                          src={avatar.src}
                          alt={avatar.alt}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Label */}
                    {avatar.label && (
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-purple-600/90 backdrop-blur-sm text-white text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap">
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

export function DefaultStreamShowcase() {
  return (
    <div className="relative bg-[#21237e] sm:pb-[500px] pb-48 pt-20">
      {/* Optimized Twinkling Star Field */}
      <div className="absolute inset-0 w-full h-full">
        {Array.from({ length: 125 }).map((_, i) => {
          const seed = i * 9876544;
          const left = seed % 100;
          const top = (seed * 7) % 100;
          const delay = ((seed * 3) % 12000) / 1000;
          const size = (seed % 4) + 1;
          const brightness = (seed % 5) + 3; // 3-7 for varied brightness
          const blinkSpeed = (seed % 3) + 2; // 2-4 second blink cycles

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

      <h1 className="font-black text-white uppercase tracking-tight sm:mt-20 sm:mb-40 mb-10 w-full items-center justify-center flex">
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

      <StreamShowcaseCard
        title="CONVOBASE"
        subtitle="👷 THIS CURRENTLY ON THE SIDE ✨"
        description="Modern chat infrastructure for AI-first companies. Replace legacy platforms with APIs designed for streaming conversations, intelligent context, and Bring Your Own Cloud deployment."
        mainImage="/convobase.png"
        mainImageAlt="Development collaboration"
        liveIndicator={true}
        onClick={() => {
          window.open("https://convobase.app", "_blank");
        }}
        viewerCount="2.3k"
        avatars={[
          {
            src: "https://tanstack.com/images/logos/logo-color-600.png",
            alt: "tanstack_start",
            label: "Tanstack Start",
          },
          {
            src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNq0QOFcaHlf2FUGgNwUAZrrw41XGen9BeGg&s",
            alt: "Developer 2",
            label: "TypeScript",
          },
          {
            src: "https://cdn.prod.website-files.com/626a25d633b1b99aa0e1afa7/686e6f89b9a5b88ba66f8287_image1.jpg",
            alt: "Developer 4",
            label: "BYOC",
          },
          {
            src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1xATUSgtKnWPtxuTElYHK79kG5uvqlQefEw&s",
            alt: "Developer 4",
            label: "GO-Lang",
          },
        ]}
      />
    </div>
  );
}
