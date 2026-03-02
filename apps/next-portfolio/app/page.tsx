"use client";

import { useState, useCallback, useMemo } from "react";
import { Mail, Menu, X, Github, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";

import { Button } from "@portfolio/ui";
import { DefaultStreamShowcase } from "@/components/StreamShowcaseCard";
import { InfiniteTicker } from "@/components/InfiniteTicker";
import { CanvasStars } from "@/components/CanvasStars";

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

  return (
    <div className="relative">
      {/* Hero Section with Background */}
      <div className="relative overflow-hidden pt-20 pb-40 md:pb-56 sm:pb-20">
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
              style={{ animationDuration: "12s", animationDelay: "1s" }}
            />
            <div
              className="absolute top-[30%] right-[20%] w-[600px] h-[600px] bg-gradient-to-br from-[#57F287]/20 via-[#34D399]/15 to-transparent rounded-full blur-[130px] animate-pulse"
              style={{ animationDuration: "10s", animationDelay: "1s" }}
            />
            <div
              className="absolute bottom-[20%] left-[10%] w-[700px] h-[700px] bg-gradient-to-tr from-[#FEE75C]/15 via-[#FBBF24]/10 to-transparent rounded-full blur-[150px] animate-pulse"
              style={{ animationDuration: "14s", animationDelay: "1s" }}
            />

            <div
              className="absolute w-screen h-screen bg-gradient-to-r from-[#A855F7]/15 to-transparent rounded-full blur-[120px] animate-pulse"
              style={{ animationDuration: "9s", animationDelay: "1s" }}
            />
          </div>
          <div className="absolute inset-0 z-0">
             <CanvasStars />
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
                    href="https://x.com/piyushrajthemt"
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
          <div className="md:hidden fixed top-20 left-0 right-0 bg-[#2c2f36]/95 backdrop-blur-lg border-b border-white/10 z-40 animate-fade-in">
            <div className="px-6 py-4 space-y-4">
              <Link
                href="/blog"
                className="block text-white/80 hover:text-white transition-colors text-sm font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </Link>
            </div>
          </div>
        )}

        {/* Hero Section - Expanded Layout for Discord */}
        <section className="relative flex items-center pt-16 sm:pt-20 md:pt-24 lg:pt-32 overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6  relative z-20 w-full">
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 sm:gap-8 md:gap-10 lg:gap-12 xl:gap-16 2xl:gap-20 items-center">
              {/* Left Side - Portfolio Content (Reduced width) */}
              <div className="xl:col-span-2 text-left order-2 xl:order-1 w-full max-w-none">
                {/* Simple working animated heading */}
                <div className="mb-6 sm:mb-8">
                  <h1 className="font-black text-white uppercase tracking-tight">
                    <span
                      className="block text-[28px] xs:text-[32px] sm:text-[40px] md:text-[48px] lg:text-[52px] xl:text-[64px] 2xl:text-[72px] leading-[0.9] font-extrabold"
                      style={{
                        fontFamily: "Alan Sans",
                        animationDelay: "0.2s",
                      }}
                    >
                      SOFTWARE
                    </span>
                    <span
                      className="block text-[28px] xs:text-[32px] sm:text-[40px] md:text-[48px] lg:text-[52px] xl:text-[64px] 2xl:text-[72px] leading-[0.9] font-extrabold "
                      style={{
                        fontFamily: "Alan Sans",
                        animationDelay: "0.4s",
                      }}
                    >
                      DEVELOPMENT
                    </span>
                    <span
                      className="block text-[28px] xs:text-[32px] sm:text-[40px] md:text-[48px] lg:text-[52px] xl:text-[64px] 2xl:text-[72px] leading-[0.9] font-extrabold bg-gradient-to-r from-[#5865F2] via-[#8B5CF6] to-[#EB459E] bg-clip-text text-transparent animate-gradient-text"
                      style={{
                        fontFamily: "Alan Sans",
                        animationDelay: "0.6s",
                      }}
                    >
                      ENGINEER III
                    </span>
                  </h1>
                </div>

                {/* Animated description */}
                <div className="mb-8 sm:mb-10 lg:mb-12">
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
                </div>

                {/* CTA Buttons with enhanced animations */}
                <div
                  className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-8 sm:mb-12 animate-bounce-in animate-floating"
                  style={{
                    animationDelay: "0.2s",
                  }}
                >
                  <div className="hover:scale-105 hover:-translate-y-0.5 active:scale-95 transition-all duration-200 animate-hero-glow-pulse">
                    <Button
                      size="lg"
                      className="w-full sm:w-auto bg-white hover:bg-[#f2f3f5] text-black px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-medium rounded-full flex items-center justify-center gap-3 transition-all duration-300 hover:shadow-2xl hover:shadow-white/20 group"
                      onClick={openResumeModal}
                    >
                      <svg
                        className="w-5 h-5 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                      </svg>
                      View Resume
                    </Button>
                  </div>
                  <div className="hover:scale-105 hover:-translate-y-0.5 active:scale-95 transition-all duration-200">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full sm:w-auto bg-gradient-to-r from-[#23272a] to-[#2c2f36] hover:from-[#36393f] hover:to-[#3a3d44] text-white border-2 border-white/20 hover:border-white/40 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-medium rounded-full transition-all duration-300 hover:shadow-2xl hover:shadow-[#5865F2]/20 group animate-hero-glow-pulse"
                      onClick={copyEmail}
                    >
                      <Mail className="w-5 h-5 mr-2 group-hover:animate-bounce group-hover:scale-110" />
                      {copiedEmail ? "✓ Email Copied!" : "Get In Touch"}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Right Side - Expanded Discord Portfolio Component */}
              <div className="xl:col-span-3 order-1 xl:order-2 w-full h-[400px] sm:h-[500px] md:h-[600px]">
                <DiscordPortfolio className="w-full h-full" />
              </div>
            </div>
          </div>
        </section>
      </div>

      <InfiniteTicker />

      {/* Stream Showcase Section */}
      <DefaultStreamShowcase />

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
            className="absolute z-[9999] sm:-mt-48 sm:h-[300px] sm:w-[250px] h-[200px] w-[150px] -mt-32"
            onClick={openResumeModal}
          />
          <img
            src="/character_leaf.webp"
            alt="main character"
            className="absolute sm:-mt-[290px] sm:w-[350px] sm:h-[150px] w-[200px] h-[50px] -mt-40 animate-bounce"
          />
        </div>

        <div className="relative w-full py-16 lg:pt-96">
          {/* Large "Piyush Raj" Text - Discord Style with Uni Sans Heavy */}
          <div className="relative pt-10 sm:pt-20 pb-16 text-center">
            <h1
              className="text-[80px] sm:text-[180px] md:text-[240px] lg:text-[320px] font-black text-white select-none leading-[0.9]"
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
  );
}
