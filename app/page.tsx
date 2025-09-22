"use client";

import { useState, useCallback, useMemo } from "react";
import { motion, LazyMotion, domAnimation } from "framer-motion";
import { Mail, Menu, X, Github, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";

import { Button } from "@/components/ui/button";

// Lazy load heavy components
const ResumeModal = dynamic(
  () =>
    import("@/components/ResumeModal").then((mod) => ({
      default: mod.default,
    })),
  {
    ssr: false,
  }
);

const DiscordPortfolio = dynamic(
  () => import("@/components/DiscordPortfolio"),
  {
    ssr: false,
  }
);

export default function Portfolio() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [showAboutMe, setShowAboutMe] = useState(false);

  const aboutMeDescription = `I design and build systems that remove bottlenecks and scale effortlessly. From architecting AI platforms that transform raw data into real-time insights, to developing modular SDKs powering millions of users with zero downtime — my work blends deep technical rigor with a bias for business impact.
I thrive at the intersection of automation, scalability, and product velocity, turning complex challenges into platforms that outlast their first use case.`;

  const copyEmail = useCallback(async () => {
    await navigator.clipboard.writeText("piyushraj888s@gmail.com");
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  }, []);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const openResumeModal = useCallback(() => {
    setIsResumeModalOpen(true);
  }, []);

  const closeResumeModal = useCallback(() => {
    setIsResumeModalOpen(false);
  }, []);

  // Memoize heavy animations data
  const spaceElements = useMemo(
    () => [
      // Rockets
      {
        type: "rocket",
        top: "15%",
        left: "20%",
        delay: 0,
        duration: 25,
        size: "text-4xl",
      },
      {
        type: "rocket",
        top: "70%",
        left: "80%",
        delay: 8,
        duration: 30,
        size: "text-3xl",
      },
      // Planets
      {
        type: "saturn",
        top: "25%",
        left: "70%",
        delay: 2,
        duration: 35,
        size: "text-5xl",
      },
      {
        type: "earth",
        top: "60%",
        left: "15%",
        delay: 12,
        duration: 28,
        size: "text-4xl",
      },
      {
        type: "mars",
        top: "10%",
        left: "85%",
        delay: 15,
        duration: 32,
        size: "text-3xl",
      },
      {
        type: "neptune",
        top: "75%",
        left: "10%",
        delay: 20,
        duration: 40,
        size: "text-4xl",
      },
      {
        type: "venus",
        top: "45%",
        left: "90%",
        delay: 6,
        duration: 26,
        size: "text-3xl",
      },
      {
        type: "jupiter",
        top: "85%",
        left: "75%",
        delay: 18,
        duration: 38,
        size: "text-5xl",
      },
      // Stars
      {
        type: "star",
        top: "10%",
        left: "50%",
        delay: 1,
        duration: 20,
        size: "text-2xl",
      },
      {
        type: "star",
        top: "40%",
        left: "85%",
        delay: 5,
        duration: 22,
        size: "text-xl",
      },
      {
        type: "star",
        top: "80%",
        left: "45%",
        delay: 7,
        duration: 18,
        size: "text-2xl",
      },
      // Sparkles
      {
        type: "sparkle",
        top: "20%",
        left: "30%",
        delay: 3,
        duration: 15,
        size: "text-lg",
      },
      {
        type: "sparkle",
        top: "65%",
        left: "60%",
        delay: 9,
        duration: 17,
        size: "text-xl",
      },
      {
        type: "sparkle",
        top: "35%",
        left: "5%",
        delay: 11,
        duration: 19,
        size: "text-lg",
      },
      // Twinkles
      {
        type: "twinkle",
        top: "50%",
        left: "40%",
        delay: 4,
        duration: 14,
        size: "text-sm",
      },
      {
        type: "twinkle",
        top: "30%",
        left: "95%",
        delay: 13,
        duration: 16,
        size: "text-sm",
      },
      {
        type: "twinkle",
        top: "90%",
        left: "30%",
        delay: 2,
        duration: 21,
        size: "text-sm",
      },
      // Satellites
      {
        type: "satellite",
        top: "35%",
        left: "25%",
        delay: 3,
        duration: 32,
        size: "text-3xl",
      },
      {
        type: "satellite",
        top: "75%",
        left: "65%",
        delay: 10,
        duration: 26,
        size: "text-2xl",
      },
    ],
    []
  );

  const constellationStars = useMemo(
    () => [
      // Big Dipper pattern
      { x: 20, y: 25, size: 2 },
      { x: 25, y: 28, size: 2 },
      { x: 30, y: 30, size: 2 },
      { x: 35, y: 29, size: 2 },
      { x: 40, y: 27, size: 2 },
      { x: 44, y: 32, size: 2 },
      { x: 48, y: 35, size: 2 },
      // Orion Belt
      { x: 70, y: 60, size: 3 },
      { x: 74, y: 62, size: 3 },
      { x: 78, y: 64, size: 3 },
      // Small cluster
      { x: 85, y: 20, size: 1 },
      { x: 87, y: 22, size: 1 },
      { x: 89, y: 19, size: 1 },
      { x: 91, y: 24, size: 1 },
    ],
    []
  );

  return (
    <LazyMotion features={domAnimation}>
      <div className="relative">
        {/* Hero Section with Background */}
        <div className="relative h-screen overflow-hidden">
          {/* Discord exact gradient background - matches reference images */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#404EED] via-[#36367c] to-[#1e1f22]" />

          {/* Additional gradient overlay for depth */}
          <div className="absolute inset-0 bg-gradient-radial from-[#5865F2]/10 via-transparent to-[#202225]/50" />

          {/* Galaxy Space Background with Floating Elements */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Enhanced Galaxy Gradient Orbs */}
            <div className="absolute inset-0">
              {/* Primary galaxy nebulas */}
              <div
                className="absolute top-[-15%] left-[-10%] w-[800px] h-[800px] bg-gradient-to-r from-[#5865F2]/30 via-[#8B5CF6]/20 to-transparent rounded-full blur-[140px] animate-pulse"
                style={{ animationDuration: "8s" }}
              />
              <div
                className="absolute bottom-[-15%] right-[-10%] w-[900px] h-[900px] bg-gradient-to-l from-[#EB459E]/25 via-[#F472B6]/15 to-transparent rounded-full blur-[160px] animate-pulse"
                style={{ animationDuration: "12s", animationDelay: "2s" }}
              />
              <div
                className="absolute top-[30%] right-[20%] w-[600px] h-[600px] bg-gradient-to-br from-[#57F287]/20 via-[#34D399]/15 to-transparent rounded-full blur-[130px] animate-pulse"
                style={{ animationDuration: "10s", animationDelay: "4s" }}
              />
              <div
                className="absolute bottom-[20%] left-[10%] w-[700px] h-[700px] bg-gradient-to-tr from-[#FEE75C]/15 via-[#FBBF24]/10 to-transparent rounded-full blur-[150px] animate-pulse"
                style={{ animationDuration: "14s", animationDelay: "1s" }}
              />

              {/* Additional cosmic depth */}
              <div
                className="absolute w-screen h-screen bg-gradient-to-r from-[#A855F7]/15 to-transparent rounded-full blur-[120px] animate-pulse"
                style={{ animationDuration: "9s", animationDelay: "3s" }}
              />
            </div>

            {/* Optimized Floating Space Illustrations */}
            {spaceElements.map((item, i) => (
              <motion.div
                key={`space-${i}`}
                className={`absolute ${item.size} select-none pointer-events-none filter blur-[1px] w-screen h-screen`}
                style={{ top: item.top, left: item.left }}
                animate={{
                  y:
                    item.type.includes("star") ||
                    item.type.includes("sparkle") ||
                    item.type.includes("twinkle")
                      ? [-10, 10, -10]
                      : [-30, 30, -30],
                  x:
                    item.type.includes("star") ||
                    item.type.includes("sparkle") ||
                    item.type.includes("twinkle")
                      ? [-5, 5, -5]
                      : [-15, 15, -15],
                  rotate: item.type === "rocket" ? [0, 360] : [-10, 10, -10],
                  scale:
                    item.type.includes("star") ||
                    item.type.includes("sparkle") ||
                    item.type.includes("twinkle")
                      ? [0.5, 1.5, 0.5]
                      : [0.8, 1.2, 0.8],
                  opacity:
                    item.type.includes("star") ||
                    item.type.includes("sparkle") ||
                    item.type.includes("twinkle")
                      ? [0.3, 1, 0.3]
                      : [0.2, 0.3, 0.2],
                }}
                transition={{
                  duration: item.duration,
                  delay: item.delay,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                {item.type === "rocket" && (
                  <span className="text-white/20">🚀</span>
                )}
                {item.type === "saturn" && (
                  <span className="text-white/25">🪐</span>
                )}
                {item.type === "earth" && (
                  <span className="text-blue-300/30">🌍</span>
                )}
                {item.type === "mars" && (
                  <span className="text-red-300/30">🔴</span>
                )}
                {item.type === "neptune" && (
                  <span className="text-blue-400/30">🔵</span>
                )}
                {item.type === "venus" && (
                  <span className="text-yellow-300/30">🟡</span>
                )}
                {item.type === "jupiter" && (
                  <span className="text-orange-300/30">🟠</span>
                )}
                {item.type === "star" && (
                  <span className="text-white/40">⭐</span>
                )}
                {item.type === "sparkle" && (
                  <span className="text-white/50">✨</span>
                )}
                {item.type === "twinkle" && (
                  <span className="text-white/60">💫</span>
                )}
                {item.type === "satellite" && (
                  <span className="text-white/20">🛰️</span>
                )}
              </motion.div>
            ))}

            {/* Optimized Twinkling Star Field */}
            <div className="absolute inset-0 w-screen h-screen">
              {Array.from({ length: 75 }).map((_, i) => {
                const seed = i * 9876543;
                const left = seed % 100;
                const top = (seed * 7) % 100;
                const delay = ((seed * 3) % 12000) / 1000;
                const size = (seed % 4) + 1;
                const brightness = (seed % 5) + 3; // 3-7 for varied brightness
                const blinkSpeed = (seed % 3) + 2; // 2-4 second blink cycles

                return (
                  <motion.div
                    key={`star-${i}`}
                    className="absolute"
                    style={{
                      left: `${left}%`,
                      top: `${top}%`,
                    }}
                    animate={{
                      opacity: [0.1, 1, 0.1],
                      scale: [0.3, 1.8, 0.3],
                      rotate: [0, 180, 360],
                    }}
                    transition={{
                      duration: blinkSpeed + (i % 3),
                      delay: delay,
                      repeat: Infinity,
                      ease: "easeInOut",
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
                  </motion.div>
                );
              })}
            </div>

            {/* Optimized Shooting Stars */}
            <div className="absolute inset-0 w-screen h-screen">
              {Array.from({ length: 4 }).map((_, i) => {
                // Use deterministic values based on index to avoid hydration mismatch
                const seed = i * 1234567;
                const startLeft = (seed % 8000) / 100 + 10;
                const startTop = ((seed * 7) % 8000) / 100 + 10;
                const endLeft = startLeft + ((seed * 3) % 4000) / 100 - 20;
                const endTop = startTop + ((seed * 5) % 4000) / 100 - 20;
                const delay = i * 8 + (seed % 500) / 100;
                const duration = 2 + (seed % 200) / 100;

                return (
                  <motion.div
                    key={`shooting-star-${i}`}
                    className="absolute w-1 h-1 bg-white rounded-full"
                    style={{
                      left: `${startLeft}%`,
                      top: `${startTop}%`,
                      filter: "blur(0.5px)",
                      boxShadow:
                        "0 0 8px rgba(255, 255, 255, 0.8), 0 0 16px rgba(255, 255, 255, 0.4)",
                    }}
                    animate={{
                      x: [`0%`, `${endLeft - startLeft}vw`],
                      y: [`0%`, `${endTop - startTop}vh`],
                      opacity: [0, 1, 1, 0],
                      scale: [0, 1, 1, 0],
                    }}
                    transition={{
                      duration: duration,
                      delay: delay,
                      repeat: Infinity,
                      ease: "easeOut",
                    }}
                  />
                );
              })}
            </div>

            {/* Optimized Constellation Patterns */}
            <div className="absolute inset-0 w-screen h-screen">
              {constellationStars.map((star, i) => (
                <motion.div
                  key={`constellation-${i}`}
                  className="absolute bg-white rounded-full"
                  style={{
                    left: `${star.x}%`,
                    top: `${star.y}%`,
                    width: `${star.size}px`,
                    height: `${star.size}px`,
                    filter: "blur(0.3px)",
                    boxShadow: `0 0 ${
                      star.size * 3
                    }px rgba(255, 255, 255, 0.6)`,
                  }}
                  animate={{
                    opacity: [0.4, 1, 0.4],
                    scale: [0.8, 1.2, 0.8],
                  }}
                  transition={{
                    duration: 4 + (i % 3),
                    delay: i * 0.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Navigation */}
          <nav className="fixed top-0 z-50 w-full ">
            <div className="px-6 lg:px-10">
              <div className="flex items-center justify-between h-20">
                {/* Personal Brand */}
                <Link
                  href="/"
                  className="flex items-center hover:opacity-80 transition-opacity"
                >
                  <span
                    className="text-white font-bold text-xl tracking-tight"
                    style={{
                      fontFamily: "Alan Sans",
                    }}
                  >
                    Piyush Raj
                  </span>
                </Link>

                {/* Navigation Links */}
                <div className="flex items-center gap-6">
                  <Link
                    href="/blog"
                    className="hidden md:block text-white/80 hover:text-white transition-colors text-sm font-medium relative z-50"
                  >
                    Blog
                  </Link>

                  {/* Social Links */}
                  <div className="flex items-center gap-3">
                    <Link
                      href="https://github.com/devfirexyz"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/80 hover:text-white transition-colors p-2 hover:scale-110 transform duration-200 cursor-pointer relative z-50"
                      aria-label="GitHub"
                    >
                      <Github className="w-5 h-5 pointer-events-none" />
                    </Link>
                    <Link
                      href="https://linkedin.com/in/piyush-raj-60a6a2117"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/80 hover:text-white transition-colors p-2 hover:scale-110 transform duration-200 cursor-pointer relative z-50"
                      aria-label="LinkedIn"
                    >
                      <Linkedin className="w-5 h-5 pointer-events-none" />
                    </Link>
                    <Link
                      href="https://twitter.com/devfirexyz"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/80 hover:text-white transition-colors p-2 hover:scale-110 transform duration-200 cursor-pointer relative z-50"
                      aria-label="Twitter"
                    >
                      <Twitter className="w-5 h-5 pointer-events-none" />
                    </Link>
                  </div>

                  {/* Mobile Menu Button */}
                  <button
                    className="md:hidden text-white p-2 ml-2"
                    onClick={toggleMenu}
                  >
                    {isMenuOpen ? (
                      <X className="w-6 h-6" />
                    ) : (
                      <Menu className="w-6 h-6" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </nav>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden fixed top-20 left-0 right-0 bg-[#2c2f36]/95 backdrop-blur-lg border-b border-white/10 z-40"
            >
              <div className="px-6 py-4 space-y-4">
                <Link
                  href="/blog"
                  className="block text-white/80 hover:text-white transition-colors text-sm font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Blog
                </Link>
              </div>
            </motion.div>
          )}

          {/* Hero Section - Expanded Layout for Discord */}
          <section className="relative flex items-center pt-16 sm:pt-20 md:pt-24 lg:pt-32 overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6  relative z-20 w-full">
              <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 sm:gap-8 md:gap-10 lg:gap-12 xl:gap-16 2xl:gap-20 items-center">
                {/* Left Side - Portfolio Content (Reduced width) */}
                <div className="xl:col-span-2 text-left order-2 xl:order-1 w-full max-w-none">
                  {/* Animated heading with stagger effect */}
                  <div className="mb-6 sm:mb-8">
                    <motion.h1
                      className="font-black text-white uppercase tracking-tight"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.6 }}
                    >
                      <motion.span
                        className="block text-[28px] xs:text-[32px] sm:text-[40px] md:text-[48px] lg:text-[52px] xl:text-[64px] 2xl:text-[72px] leading-[0.9] font-extrabold"
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{
                          duration: 0.4,
                          delay: 0.1,
                          ease: "easeOut",
                        }}
                        style={{
                          fontFamily: "Alan Sans",
                        }}
                      >
                        SOFTWARE
                      </motion.span>
                      <motion.span
                        className="block text-[28px] xs:text-[32px] sm:text-[40px] md:text-[48px] lg:text-[52px] xl:text-[64px] 2xl:text-[72px] leading-[0.9] font-extrabold"
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{
                          duration: 0.4,
                          delay: 0.2,
                          ease: "easeOut",
                        }}
                        style={{
                          fontFamily: "Alan Sans",
                        }}
                      >
                        DEVELOPMENT
                      </motion.span>
                      <motion.span
                        className="block text-[28px] xs:text-[32px] sm:text-[40px] md:text-[48px] lg:text-[52px] xl:text-[64px] 2xl:text-[72px] leading-[0.9] font-extrabold bg-gradient-to-r from-[#5865F2] via-[#8B5CF6] to-[#EB459E] bg-clip-text text-transparent animate-pulse"
                        style={{
                          animationDuration: "3s",
                          fontFamily: "Alan Sans",
                        }}
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{
                          duration: 0.4,
                          delay: 0.3,
                          ease: "easeOut",
                        }}
                      >
                        ENGINEER III
                      </motion.span>
                    </motion.h1>
                  </div>

                  {/* Animated description */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="mb-8 sm:mb-10 lg:mb-12"
                  >
                    <div className="text-base sm:text-lg lg:text-xl  text-white/90 leading-relaxed max-w-2xl">
                      {showAboutMe
                        ? aboutMeDescription
                        : aboutMeDescription.slice(0, 140)}
                      <button
                        onClick={() =>
                          showAboutMe
                            ? setShowAboutMe(false)
                            : setShowAboutMe(true)
                        }
                        className="text-green-500 text-xl"
                      >
                        {showAboutMe ? " ...Show Less" : " ...Read More"}
                      </button>
                    </div>
                  </motion.div>

                  {/* CTA Buttons with enhanced animations */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5, ease: "easeOut" }}
                    className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-8 sm:mb-12"
                  >
                    <motion.div
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      }}
                    >
                      <Button
                        size="lg"
                        className="w-full sm:w-auto bg-white hover:bg-[#f2f3f5] text-black px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-medium rounded-full flex items-center justify-center gap-3 transition-all duration-300 hover:shadow-2xl hover:shadow-white/20 group"
                        onClick={openResumeModal}
                      >
                        <svg
                          className="w-5 h-5 group-hover:scale-110 transition-transform duration-300"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                        </svg>
                        View Resume
                      </Button>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      }}
                    >
                      <Button
                        size="lg"
                        variant="outline"
                        className="w-full sm:w-auto bg-gradient-to-r from-[#23272a] to-[#2c2f36] hover:from-[#36393f] hover:to-[#3a3d44] text-white border-2 border-white/20 hover:border-white/40 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-medium rounded-full transition-all duration-300 hover:shadow-2xl hover:shadow-[#5865F2]/20 group"
                        onClick={copyEmail}
                      >
                        <Mail className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                        {copiedEmail ? "✓ Email Copied!" : "Get In Touch"}
                      </Button>
                    </motion.div>
                  </motion.div>
                </div>

                {/* Right Side - Expanded Discord Portfolio Component */}
                <div className="xl:col-span-3 order-1 xl:order-2 w-full h-[400px] sm:h-[500px] md:h-[600px]">
                  <DiscordPortfolio className="w-full h-full" />
                </div>
              </div>
            </div>
          </section>
        </div>

        {/*  Footer */}
        <footer className="relative bg-[#5865F2] text-white mt-0 bg-gradient-to-b from-[#31338b] to-[#5865F2]">
          <div className="relative w-full flex justify-center">
            <img
              src="/characters_side.webp"
              alt="side characters"
              width={950}
              height={490}
              className="md:flex hidden absolute -mt-44"
            />
            <img
              src="/character_main.webp"
              alt="main character"
              width={250}
              height={300}
              className="absolute -mt-44"
            />
            <img
              src="/character_leaf.webp"
              alt="main character"
              width={350}
              height={150}
              className="absolute -mt-[265px] animate-bounce"
            />
          </div>

          <div className="relative w-full py-16 lg:pt-96">
            {/* Large "Piyush Raj" Text - Discord Style with Uni Sans Heavy */}
            <div className="relative pt-20 pb-16 text-center">
              <h1
                className="text-[120px] sm:text-[180px] md:text-[240px] lg:text-[320px] font-black text-white select-none leading-[0.9]"
                style={{
                  fontFamily:
                    '"Alan Sans", "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif',
                  fontWeight: 900,
                  fontStretch: "condensed",
                  opacity: 0.9,
                  textShadow: "0 8px 32px rgba(0,0,0,0.4)",
                  WebkitTextStroke: "2px rgba(255,255,255,0.1)",
                  letterSpacing: "0.1rem",
                }}
              >
                Piyush Raj
              </h1>
            </div>
          </div>
        </footer>

        {/* Optimized Resume Modal */}
        {isResumeModalOpen && <ResumeModal onClose={closeResumeModal} />}
      </div>
    </LazyMotion>
  );
}
