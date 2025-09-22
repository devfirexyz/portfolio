"use client"

import { useState, useRef, useEffect } from "react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import {
  Github, Linkedin, Mail, Menu, X,
  ChevronRight, ExternalLink, Code2, Briefcase,
  Zap, Trophy, Copy, Check
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { resumeData } from "@/lib/data/resume-data"

export default function Portfolio() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [resumeUnlocked, setResumeUnlocked] = useState(false)
  const [copiedEmail, setCopiedEmail] = useState(false)
  const [activeSection, setActiveSection] = useState("home")

  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95])

  const copyEmail = async () => {
    await navigator.clipboard.writeText(resumeData.personal.email)
    setCopiedEmail(true)
    setTimeout(() => setCopiedEmail(false), 2000)
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Discord exact gradient background - matches reference images */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#404EED] via-[#36367c] to-[#1e1f22]" />

      {/* Additional gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-radial from-[#5865F2]/10 via-transparent to-[#202225]/50" />

      {/* Floating blur elements - Enhanced for Discord look */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Top left purple blob */}
        <div className="absolute top-[-15%] left-[-10%] w-[800px] h-[800px] bg-[#5865F2]/25 rounded-full blur-[140px] animate-pulse" style={{ animationDuration: '8s' }} />

        {/* Top right pink blob */}
        <div className="absolute top-[10%] right-[-15%] w-[600px] h-[600px] bg-[#EB459E]/20 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />

        {/* Bottom center large purple blob */}
        <div className="absolute bottom-[-25%] left-[20%] w-[900px] h-[900px] bg-[#5865F2]/20 rounded-full blur-[160px] animate-pulse" style={{ animationDuration: '12s', animationDelay: '4s' }} />

        {/* Mid-right green accent */}
        <div className="absolute top-[40%] right-[10%] w-[400px] h-[400px] bg-[#57F287]/15 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '9s', animationDelay: '1s' }} />

        {/* Bottom left yellow accent */}
        <div className="absolute bottom-[10%] left-[-5%] w-[500px] h-[500px] bg-[#FEE75C]/15 rounded-full blur-[110px] animate-pulse" style={{ animationDuration: '11s', animationDelay: '3s' }} />
      </div>

      {/* Discord-style floating UI elements */}
      <div className="absolute inset-0">
        {/* Large floating Discord-style mockup card - hidden on mobile */}
        <div className="absolute top-32 -left-40 w-[400px] md:w-[500px] lg:w-[600px] h-[300px] md:h-[350px] lg:h-[400px] float-3d hidden lg:block" style={{ animationDelay: "0s" }}>
          <div className="discord-floating-card rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 transform rotate-12 hover:rotate-6 transition-transform duration-1000">
            <div className="discord-bright-overlay absolute inset-0 opacity-60" />
            <div className="relative z-10 space-y-3 md:space-y-4">
              <div className="bg-[#36393f] rounded-xl md:rounded-2xl p-4 md:p-6">
                <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                  <div className="w-6 h-6 md:w-8 md:h-8 bg-[#5865F2] rounded-full" />
                  <div className="text-white font-semibold text-sm md:text-base">Piyush Raj</div>
                  <div className="ml-auto text-xs text-gray-400">Developer</div>
                </div>
                <div className="text-[#dcddde] text-xs md:text-sm leading-relaxed">
                  Building scalable applications with modern tech stack...
                </div>
                <div className="flex gap-2 mt-3 md:mt-4">
                  <div className="bg-[#5865F2] text-white text-xs px-2 md:px-3 py-1 rounded-full">React</div>
                  <div className="bg-[#ED4245] text-white text-xs px-2 md:px-3 py-1 rounded-full">Node.js</div>
                  <div className="bg-[#57F287] text-[#2C2F33] text-xs px-2 md:px-3 py-1 rounded-full">TypeScript</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating code editor mockup - hidden on smaller screens */}
        <div className="absolute top-20 -right-32 w-[350px] md:w-[450px] lg:w-[500px] h-[250px] md:h-[300px] lg:h-[350px] float-3d hidden md:block" style={{ animationDelay: "2s" }}>
          <div className="discord-floating-card rounded-xl md:rounded-2xl p-4 md:p-6 transform -rotate-6 hover:rotate-0 transition-transform duration-1000">
            <div className="bg-gradient-to-br from-[#EB459E]/80 to-[#5865F2]/60 absolute inset-0 rounded-xl md:rounded-2xl opacity-70" />
            <div className="relative z-10">
              <div className="bg-[#1e1f22] rounded-lg md:rounded-xl p-3 md:p-4">
                <div className="flex gap-2 mb-2 md:mb-3">
                  <div className="w-2 h-2 md:w-3 md:h-3 bg-[#ff5f56] rounded-full" />
                  <div className="w-2 h-2 md:w-3 md:h-3 bg-[#ffbd2e] rounded-full" />
                  <div className="w-2 h-2 md:w-3 md:h-3 bg-[#27c93f] rounded-full" />
                </div>
                <div className="text-xs font-mono space-y-1">
                  <div className="text-[#ff7b72]">const skills = [</div>
                  <div className="text-[#79c0ff] ml-4">"Full Stack Development",</div>
                  <div className="text-[#79c0ff] ml-4">"Modern JavaScript",</div>
                  <div className="text-[#79c0ff] ml-4">"Cloud Architecture"</div>
                  <div className="text-[#ff7b72]">];</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom floating stats card - hidden on mobile */}
        <div className="absolute bottom-32 left-20 w-[300px] md:w-[350px] lg:w-[400px] h-[150px] md:h-[180px] lg:h-[200px] float-3d hidden lg:block" style={{ animationDelay: "4s" }}>
          <div className="discord-floating-card rounded-xl md:rounded-2xl p-4 md:p-6 transform rotate-3 hover:-rotate-1 transition-transform duration-1000">
            <div className="bg-gradient-to-r from-[#FEE75C]/70 to-[#57F287]/80 absolute inset-0 rounded-xl md:rounded-2xl opacity-60" />
            <div className="relative z-10 grid grid-cols-2 gap-2 md:gap-4 text-center">
              <div>
                <div className="text-lg md:text-xl lg:text-2xl font-black text-white">4+</div>
                <div className="text-xs text-gray-300">Years Exp</div>
              </div>
              <div>
                <div className="text-lg md:text-xl lg:text-2xl font-black text-white">20+</div>
                <div className="text-xs text-gray-300">Projects</div>
              </div>
              <div>
                <div className="text-lg md:text-xl lg:text-2xl font-black text-white">2M+</div>
                <div className="text-xs text-gray-300">Users</div>
              </div>
              <div>
                <div className="text-lg md:text-xl lg:text-2xl font-black text-white">99%</div>
                <div className="text-xs text-gray-300">Uptime</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scattered cosmic stars - Fixed positions for SSR */}
        <div className="absolute inset-0">
          {Array.from({ length: 50 }).map((_, i) => {
            // Use deterministic positions based on index
            const seed = i * 1234567; // Large prime-like number for distribution
            const left = (seed % 100);
            const top = ((seed * 7) % 100);
            const delay = ((seed * 3) % 5000) / 1000;

            return (
              <div
                key={i}
                className="absolute"
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                  animationDelay: `${delay}s`,
                }}
              >
                {i % 4 === 0 ? (
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse opacity-60" />
                ) : (
                  <svg className="w-3 h-3 text-white/40 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation - Discord Exact Replica */}
      <nav className="fixed top-0 z-50 w-full backdrop-blur-sm bg-black/10">
        <div className="px-6 lg:px-10">
          <div className="flex items-center justify-between h-20">
            {/* Discord Logo */}
            <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
              <svg className="w-[32px] h-[24px] mr-2" viewBox="0 0 71 55" fill="none">
                <g clipPath="url(#clip0)">
                  <path d="M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.440769 45.4204 0.525289C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.525289C25.5141 0.443589 25.4218 0.40133 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3935 44.2785 53.4831 44.2898 53.5502 44.3433C53.9057 44.6363 54.2779 44.9293 54.6529 45.2082C54.7816 45.304 54.7732 45.5041 54.6333 45.5858C52.8646 46.6197 51.0259 47.4931 49.0921 48.2228C48.9662 48.2707 48.9102 48.4172 48.9718 48.5383C50.038 50.6034 51.2554 52.5699 52.5959 54.435C52.6519 54.5139 52.7526 54.5477 52.845 54.5195C58.6464 52.7249 64.529 50.0174 70.6019 45.5576C70.6551 45.5182 70.6887 45.459 70.6943 45.3942C72.1747 30.0791 68.2147 16.7757 60.1968 4.9823C60.1772 4.9429 60.1437 4.9147 60.1045 4.8978ZM23.7259 37.3253C20.2276 37.3253 17.3451 34.1136 17.3451 30.1693C17.3451 26.225 20.1717 23.0133 23.7259 23.0133C27.308 23.0133 30.1626 26.2532 30.1066 30.1693C30.1066 34.1136 27.28 37.3253 23.7259 37.3253ZM47.3178 37.3253C43.8196 37.3253 40.9371 34.1136 40.9371 30.1693C40.9371 26.225 43.7636 23.0133 47.3178 23.0133C50.9 23.0133 53.7545 26.2532 53.6986 30.1693C53.6986 34.1136 50.9 37.3253 47.3178 37.3253Z" fill="white"/>
                </g>
                <defs>
                  <clipPath id="clip0">
                    <rect width="71" height="55" fill="white"/>
                  </clipPath>
                </defs>
              </svg>
              <span className="text-white font-bold text-xl tracking-tight">Discord</span>
            </Link>

            {/* Center Navigation */}
            <div className="hidden lg:flex items-center gap-10">
              <Link href="/download" className="text-white hover:underline font-semibold">
                Download
              </Link>
              <Link href="/nitro" className="text-white hover:underline font-semibold">
                Nitro
              </Link>
              <Link href="/discover" className="text-white hover:underline font-semibold">
                Discover
              </Link>
              <button className="text-white hover:underline font-semibold flex items-center gap-1">
                Safety
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <button className="text-white hover:underline font-semibold flex items-center gap-1">
                Support
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <button className="text-white hover:underline font-semibold flex items-center gap-1">
                Blog
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <Link href="/careers" className="text-white hover:underline font-semibold">
                Careers
              </Link>
            </div>

            {/* Right side - Login button */}
            <Button
              className="bg-white hover:bg-[#dcddde] text-black text-sm font-medium px-6 py-2.5 rounded-full transition-all hover:shadow-lg hover:scale-105"
              onClick={() => setResumeUnlocked(true)}
            >
              Log In
            </Button>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-white p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-[#2C2F33] border-t border-black/20"
            >
              <div className="container mx-auto px-4 py-4 space-y-2">
                <Link href="#about" className="block py-2 text-gray-300 hover:text-white">
                  About
                </Link>
                <Link href="#experience" className="block py-2 text-gray-300 hover:text-white">
                  Experience
                </Link>
                <Link href="#projects" className="block py-2 text-gray-300 hover:text-white">
                  Projects
                </Link>
                <Link href="#skills" className="block py-2 text-gray-300 hover:text-white">
                  Skills
                </Link>
                <Button
                  className="w-full bg-[#5865f2] hover:bg-[#4752c4] text-white font-semibold rounded-full"
                  onClick={() => setResumeUnlocked(true)}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Contact Me
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section - Split Layout */}
      <section className="relative min-h-screen flex items-center pt-24 lg:pt-32 overflow-hidden">
        <div className="container mx-auto px-6 lg:px-20 relative z-20">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Side - Portfolio Content */}
            <div className="text-left order-2 lg:order-1">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="font-black text-white mb-6 uppercase tracking-tight">
                  <span className="block text-[32px] sm:text-[48px] lg:text-[56px] xl:text-[64px] leading-[0.95] font-extrabold">SOFTWARE</span>
                  <span className="block text-[32px] sm:text-[48px] lg:text-[56px] xl:text-[64px] leading-[0.95] font-extrabold">DEVELOPMENT</span>
                  <span className="block text-[32px] sm:text-[48px] lg:text-[56px] xl:text-[64px] leading-[0.95] font-extrabold bg-gradient-to-r from-[#5865F2] to-[#EB459E] bg-clip-text text-transparent">ENGINEER III</span>
                </h1>
                <p className="text-lg lg:text-xl text-white/90 leading-[1.6] mb-8">
                  Building scalable applications at <span className="text-[#5865F2] font-semibold">Angel One</span> with
                  modern tech stack. Specialized in AI-powered platforms, micro-frontends, and high-performance web applications
                  serving millions of users.
                </p>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 mb-12"
              >
                <Button
                  size="lg"
                  className="bg-white hover:bg-[#f2f3f5] text-black px-8 py-4 text-lg font-medium rounded-full flex items-center gap-3 transition-all hover:shadow-lg hover:scale-105"
                  onClick={() => window.open('https://github.com/piyush-fs-dev', '_blank')}
                >
                  <Github className="w-5 h-5" />
                  View Projects
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-[#23272a] hover:bg-[#36393f] text-white border-0 px-8 py-4 text-lg font-medium rounded-full transition-all hover:scale-105"
                  onClick={copyEmail}
                >
                  <Mail className="w-5 h-5 mr-2" />
                  {copiedEmail ? 'Email Copied!' : 'Get In Touch'}
                </Button>
              </motion.div>

              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="grid grid-cols-3 gap-4"
              >
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="text-2xl lg:text-3xl font-black text-white">2.5+</div>
                  <div className="text-xs lg:text-sm text-white/80">Years Experience</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="text-2xl lg:text-3xl font-black text-white">1.67Cr+</div>
                  <div className="text-xs lg:text-sm text-white/80">Users Served</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="text-2xl lg:text-3xl font-black text-white">97%</div>
                  <div className="text-xs lg:text-sm text-white/80">On-time Delivery</div>
                </div>
              </motion.div>
            </div>

            {/* Right Side - Discord UI Elements */}
            <div className="relative order-1 lg:order-2 h-[400px] lg:h-[600px]">
              {/* Main Discord Desktop Window */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="absolute left-0 top-0 w-full h-[350px] lg:h-[450px]"
              >
              <div className="bg-[#36393f] rounded-lg shadow-2xl overflow-hidden h-full backdrop-blur-sm">
                {/* Discord window header */}
                <div className="h-8 bg-[#202225] flex items-center justify-between px-4">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                    <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                    <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                  </div>
                  <div className="text-[#dcddde] text-sm font-medium">Discord</div>
                  <div className="w-12" />
                </div>

                {/* Discord app interface */}
                <div className="flex h-full">
                  {/* Server sidebar */}
                  <div className="w-[60px] lg:w-[72px] bg-[#202225] flex flex-col items-center py-3 gap-2">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 bg-[#5865F2] rounded-[20px] lg:rounded-[24px] hover:rounded-[16px] transition-all duration-200 flex items-center justify-center text-white font-bold">
                      <svg className="w-6 h-6 lg:w-8 lg:h-8" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.197.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                      </svg>
                    </div>
                    <div className="w-8 h-[2px] lg:w-12 lg:h-[2px] bg-[#35383e]" />
                    <div className="w-10 h-10 lg:w-12 lg:h-12 bg-[#36393f] rounded-full hover:bg-[#5865F2] hover:rounded-[16px] transition-all duration-200" />
                    <div className="w-10 h-10 lg:w-12 lg:h-12 bg-[#36393f] rounded-full hover:bg-[#57F287] hover:rounded-[16px] transition-all duration-200" />
                    <div className="w-10 h-10 lg:w-12 lg:h-12 bg-[#36393f] rounded-full hover:bg-[#EB459E] hover:rounded-[16px] transition-all duration-200" />
                  </div>

                  {/* Channel sidebar - Hidden on very small screens */}
                  <div className="hidden sm:block w-[180px] lg:w-[240px] bg-[#2f3136]">
                    <div className="p-3 lg:p-4">
                      <div className="text-white font-semibold mb-4 text-sm lg:text-base">Discord Portfolio</div>
                      <div className="text-white/60 text-xs font-semibold uppercase mb-2">Text Channels</div>
                      <div className="space-y-1">
                        <div className="px-2 py-1 bg-[#42464d] rounded text-[#dcddde] text-sm flex items-center gap-2">
                          <span className="text-[#72767d]">#</span>
                          <span>showcase</span>
                        </div>
                        <div className="px-2 py-1 hover:bg-[#42464d] rounded text-[#96989d] text-sm flex items-center gap-2">
                          <span className="text-[#72767d]">#</span>
                          <span>projects</span>
                        </div>
                        <div className="px-2 py-1 hover:bg-[#42464d] rounded text-[#96989d] text-sm flex items-center gap-2">
                          <span className="text-[#72767d]">#</span>
                          <span>feedback</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Main chat area */}
                  <div className="flex-1 bg-[#36393f] flex flex-col">
                    {/* Chat header */}
                    <div className="h-10 lg:h-12 border-b border-[#202225] px-3 lg:px-4 flex items-center">
                      <span className="text-[#72767d] text-lg">#</span>
                      <span className="ml-2 text-white font-semibold text-sm lg:text-base">showcase</span>
                      <div className="ml-auto flex items-center gap-2">
                        <div className="w-2 h-2 bg-[#3ba55d] rounded-full" />
                        <span className="text-[#b5bac1] text-xs hidden lg:inline">24 online</span>
                      </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 p-2 lg:p-4 space-y-2 lg:space-y-3 overflow-hidden">
                      <div className="flex gap-2 lg:gap-3">
                        <div className="w-6 h-6 lg:w-8 lg:h-8 bg-[#5865F2] rounded-full flex items-center justify-center text-white text-xs lg:text-sm font-bold flex-shrink-0">P</div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-white font-medium text-xs lg:text-sm">Piyush Raj</span>
                            <span className="text-[#72767d] text-xs">now</span>
                          </div>
                          <div className="text-[#dcddde] text-xs lg:text-sm">Just deployed an AI-powered financial platform serving 1.67Cr+ users! 🚀</div>
                        </div>
                      </div>

                      <div className="flex gap-2 lg:gap-3">
                        <div className="w-6 h-6 lg:w-8 lg:h-8 bg-[#57F287] rounded-full flex items-center justify-center text-[#2c2f33] text-xs lg:text-sm font-bold flex-shrink-0">T</div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-white font-medium text-xs lg:text-sm">Tech Recruiter</span>
                            <span className="bg-[#5865F2] text-white text-xs px-1 py-0.5 rounded text-[10px]">HR</span>
                          </div>
                          <div className="text-[#dcddde] text-xs lg:text-sm">97% on-time delivery rate is outstanding! Let's connect 💯</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Mobile Discord App */}
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="absolute right-4 sm:right-8 lg:right-16 xl:right-20 top-32 lg:top-48 w-[160px] sm:w-[200px] lg:w-[240px] h-[280px] sm:h-[360px] lg:h-[420px] hidden sm:block"
            >
              <div className="bg-gradient-to-br from-[#36393f] to-[#2f3136] rounded-[24px] lg:rounded-[32px] shadow-2xl p-3 lg:p-4 h-full">
                <div className="bg-[#202225] rounded-[16px] lg:rounded-[24px] h-full p-2 lg:p-3">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-white text-xs font-semibold">Discord</div>
                    <div className="w-2 h-2 bg-[#3ba55d] rounded-full" />
                  </div>
                  <div className="text-white/60 text-xs mb-3">Direct Messages</div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 p-1 rounded hover:bg-[#36393f]">
                      <div className="w-6 h-6 lg:w-8 lg:h-8 bg-[#5865F2] rounded-full flex items-center justify-center text-white text-xs font-bold">J</div>
                      <div className="text-[#dcddde] text-xs lg:text-sm">John Doe</div>
                    </div>
                    <div className="flex items-center gap-2 p-1 rounded hover:bg-[#36393f]">
                      <div className="w-6 h-6 lg:w-8 lg:h-8 bg-[#57F287] rounded-full flex items-center justify-center text-[#2c2f33] text-xs font-bold">S</div>
                      <div className="text-[#dcddde] text-xs lg:text-sm">Sarah Kim</div>
                    </div>
                    <div className="flex items-center gap-2 p-1 rounded bg-[#42464d]">
                      <div className="w-6 h-6 lg:w-8 lg:h-8 bg-[#EB459E] rounded-full flex items-center justify-center text-white text-xs font-bold">A</div>
                      <div className="text-[#dcddde] text-xs lg:text-sm">Alex Chen</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Character Illustrations */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="absolute bottom-0 left-0 right-0 flex justify-center items-end gap-2 sm:gap-4 lg:gap-8"
            >
              {/* Character 1 - Left */}
              <div className="relative">
                <div className="w-16 h-24 sm:w-20 sm:h-32 lg:w-28 lg:h-40 bg-gradient-to-b from-[#5865F2] to-[#404EED] rounded-full opacity-90 shadow-lg" />
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-full opacity-80" />
                <div className="absolute top-6 sm:top-8 left-1/2 -translate-x-1/2 w-2 h-2 sm:w-3 sm:h-3 bg-[#202225] rounded-full" />
              </div>

              {/* Character 2 */}
              <div className="relative">
                <div className="w-14 h-20 sm:w-18 sm:h-28 lg:w-24 lg:h-36 bg-gradient-to-b from-[#EB459E] to-[#B845EB] rounded-full opacity-90 shadow-lg" />
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-5 h-5 sm:w-7 sm:h-7 bg-white rounded-full opacity-80" />
                <div className="absolute top-5 sm:top-7 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#202225] rounded-full" />
              </div>

              {/* Character 3 - Center (tallest) */}
              <div className="relative">
                <div className="w-20 h-32 sm:w-24 sm:h-40 lg:w-32 lg:h-48 bg-gradient-to-b from-[#57F287] to-[#3BA55D] rounded-full opacity-90 shadow-lg" />
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-7 h-7 sm:w-9 sm:h-9 bg-white rounded-full opacity-80" />
                <div className="absolute top-7 sm:top-9 left-1/2 -translate-x-1/2 w-2 h-2 sm:w-3 sm:h-3 bg-[#202225] rounded-full" />
              </div>

              {/* Character 4 */}
              <div className="relative">
                <div className="w-16 h-24 sm:w-20 sm:h-32 lg:w-26 lg:h-38 bg-gradient-to-b from-[#FEE75C] to-[#FCD34D] rounded-full opacity-90 shadow-lg" />
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-full opacity-80" />
                <div className="absolute top-6 sm:top-8 left-1/2 -translate-x-1/2 w-2 h-2 sm:w-3 sm:h-3 bg-[#202225] rounded-full" />
              </div>

              {/* Character 5 - Right */}
              <div className="relative hidden sm:block">
                <div className="w-14 h-20 sm:w-16 sm:h-24 lg:w-22 lg:h-32 bg-gradient-to-b from-[#ED4245] to-[#CC2936] rounded-full opacity-90 shadow-lg" />
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-5 h-5 sm:w-6 sm:h-6 bg-white rounded-full opacity-80" />
                <div className="absolute top-5 sm:top-6 left-1/2 -translate-x-1/2 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#202225] rounded-full" />
              </div>
            </motion.div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 h-3 bg-gray-400 rounded-full mt-2"
            />
          </div>
        </motion.div>
      </section>
    </div>
  )
}