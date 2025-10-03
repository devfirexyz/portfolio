"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

interface BlogLayoutProps {
  children: React.ReactNode;
  showBackButton?: boolean;
}

const modernBackgroundStyle = {
  background: `linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)`,
};

export function BlogLayout({
  children,
  showBackButton = false,
}: BlogLayoutProps) {
  // Memoized space elements for performance
  const spaceElements = useMemo(
    () => [
      // Stars
      { type: "star", top: "15%", left: "20%", delay: 0, duration: 20, size: "text-2xl", opacity: 0.7 },
      { type: "star", top: "70%", left: "80%", delay: 5, duration: 25, size: "text-xl", opacity: 0.6 },
      { type: "star", top: "30%", left: "70%", delay: 8, duration: 18, size: "text-3xl", opacity: 0.8 },
      { type: "star", top: "60%", left: "15%", delay: 12, duration: 22, size: "text-2xl", opacity: 0.7 },
      { type: "star", top: "85%", left: "45%", delay: 15, duration: 24, size: "text-xl", opacity: 0.6 },

      // Sparkles
      { type: "sparkle", top: "25%", left: "10%", delay: 2, duration: 15, size: "text-xl", opacity: 0.8 },
      { type: "sparkle", top: "65%", left: "90%", delay: 7, duration: 17, size: "text-2xl", opacity: 0.7 },
      { type: "sparkle", top: "40%", left: "5%", delay: 11, duration: 19, size: "text-xl", opacity: 0.6 },

      // Planets (fewer for performance)
      { type: "planet", top: "20%", left: "85%", delay: 3, duration: 35, size: "text-3xl", opacity: 0.4 },
      { type: "planet", top: "75%", left: "25%", delay: 18, duration: 40, size: "text-4xl", opacity: 0.5 },

      // Satellites
      { type: "satellite", top: "35%", left: "60%", delay: 6, duration: 28, size: "text-2xl", opacity: 0.5 },

      // Additional space elements
      { type: "rocket", top: "10%", left: "50%", delay: 4, duration: 30, size: "text-2xl", opacity: 0.4 },
      { type: "twinkle", top: "80%", left: "70%", delay: 10, duration: 12, size: "text-lg", opacity: 0.7 },
    ],
    []
  );

  // Memoized twinkling stars for background
  const twinklingStars = useMemo(
    () => Array.from({ length: 50 }).map((_, i) => {
      const seed = i * 12345;
      return {
        left: (seed % 100),
        top: ((seed * 7) % 100),
        delay: ((seed * 3) % 8000) / 1000,
        size: (seed % 4) + 2, // Slightly larger
        brightness: (seed % 6) + 4, // Brighter
        duration: (seed % 4) + 3,
      };
    }),
    []
  );

  return (
    <div
      className="min-h-screen text-white flex flex-col relative"
      style={modernBackgroundStyle}
    >
      {/* Optimized Space Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Enhanced gradient orbs */}
        <div className="absolute top-0 left-0 w-full h-full">
          <motion.div
            className="absolute top-[10%] left-[10%] w-[600px] h-[600px] bg-gradient-to-br from-blue-500/20 via-purple-500/15 to-transparent rounded-full blur-[120px]"
            animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] bg-gradient-to-tl from-cyan-500/20 via-blue-500/15 to-transparent rounded-full blur-[100px]"
            animate={{ scale: [1, 1.3, 1], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          />
          <motion.div
            className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-r from-purple-500/18 to-pink-500/18 rounded-full blur-[80px]"
            animate={{ scale: [1, 1.25, 1], rotate: [0, 180, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute top-[20%] right-[20%] w-[300px] h-[300px] bg-gradient-to-l from-green-500/15 to-emerald-500/15 rounded-full blur-[60px]"
            animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 5 }}
          />
        </div>

        {/* Optimized floating space elements */}
        {spaceElements.map((item, i) => (
          <motion.div
            key={`space-${i}`}
            className={`absolute ${item.size} select-none pointer-events-none`}
            style={{
              top: item.top,
              left: item.left,
              opacity: item.opacity,
              filter: "blur(0.5px)"
            }}
            animate={{
              y: item.type === "star" || item.type === "sparkle" ? [-8, 8, -8] : [-20, 20, -20],
              x: item.type === "star" || item.type === "sparkle" ? [-4, 4, -4] : [-10, 10, -10],
              scale: item.type === "star" || item.type === "sparkle" ? [0.8, 1.4, 0.8] : [0.9, 1.1, 0.9],
              opacity: [item.opacity * 0.5, item.opacity, item.opacity * 0.5],
            }}
            transition={{
              duration: item.duration,
              delay: item.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {item.type === "star" && <span className="text-white">⭐</span>}
            {item.type === "sparkle" && <span className="text-white">✨</span>}
            {item.type === "planet" && <span className="text-blue-300">🪐</span>}
            {item.type === "satellite" && <span className="text-white">🛰️</span>}
            {item.type === "rocket" && <span className="text-white">🚀</span>}
            {item.type === "twinkle" && <span className="text-white">💫</span>}
          </motion.div>
        ))}

        {/* Optimized twinkling star field */}
        <div className="absolute inset-0">
          {twinklingStars.map((star, i) => (
            <motion.div
              key={`star-${i}`}
              className="absolute"
              style={{
                left: `${star.left}%`,
                top: `${star.top}%`,
              }}
              animate={{
                opacity: [0.2, 1, 0.2],
                scale: [0.5, 1.5, 0.5],
              }}
              transition={{
                duration: star.duration,
                delay: star.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div
                className="bg-white rounded-full"
                style={{
                  width: `${star.size}px`,
                  height: `${star.size}px`,
                  filter: "blur(0.5px)",
                  opacity: star.brightness / 10,
                  boxShadow: `0 0 ${star.size * 2}px rgba(255, 255, 255, ${star.brightness / 15})`,
                }}
              />
            </motion.div>
          ))}
        </div>

        {/* Subtle dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />

        {/* Background blur overlay */}
        <div className="absolute inset-0 backdrop-blur-[2px] bg-black/10" />
      </div>
      {/* Modern Glass Header */}
      <motion.header
        className="relative z-10 border-b border-white/[0.08] backdrop-blur-xl bg-white/[0.02]"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-5">
          <div className="flex items-center gap-4">
            {showBackButton ? (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  href="/blog"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/[0.08] rounded-lg transition-all duration-200"
                >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Back to Blog
                </Link>
              </motion.div>
            ) : (
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  href="/"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/[0.08] rounded-lg transition-all duration-200"
                >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Back to Portfolio
                </Link>
              </motion.div>
            )}
          </div>

          <div className="flex items-center sm:gap-4">
            <nav className="hidden items-center gap-4 text-sm sm:flex sm:gap-6">
              {/* Navigation items can be added here */}
            </nav>
          </div>
        </div>
      </motion.header>

      {/* Main content */}
      <motion.main
        className="relative flex-1 z-10"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
      >
        {children}
      </motion.main>

      {/* Modern Glass Footer */}
      <motion.footer
        className="border-t border-white/[0.08] mt-auto relative z-10 bg-white/[0.02] backdrop-blur-xl"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
      >
        <div className="max-w-5xl mx-auto px-6 py-8">
          <motion.div
            className="text-center text-sm text-white/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            © {new Date().getFullYear()} Piyush Raj. All rights reserved.
          </motion.div>
        </div>
      </motion.footer>
    </div>
  );
}
