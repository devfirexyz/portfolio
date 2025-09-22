"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Github, Mail, Menu, X
} from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { resumeData } from "@/lib/data/resume-data"

export default function Portfolio() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [copiedEmail, setCopiedEmail] = useState(false)

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

      {/* Galaxy Space Background with Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Enhanced Galaxy Gradient Orbs */}
        <div className="absolute inset-0">
          {/* Primary galaxy nebulas */}
          <div className="absolute top-[-15%] left-[-10%] w-[800px] h-[800px] bg-gradient-to-r from-[#5865F2]/30 via-[#8B5CF6]/20 to-transparent rounded-full blur-[140px] animate-pulse" style={{ animationDuration: '8s' }} />
          <div className="absolute bottom-[-15%] right-[-10%] w-[900px] h-[900px] bg-gradient-to-l from-[#EB459E]/25 via-[#F472B6]/15 to-transparent rounded-full blur-[160px] animate-pulse" style={{ animationDuration: '12s', animationDelay: '2s' }} />
          <div className="absolute top-[30%] right-[20%] w-[600px] h-[600px] bg-gradient-to-br from-[#57F287]/20 via-[#34D399]/15 to-transparent rounded-full blur-[130px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '4s' }} />
          <div className="absolute bottom-[20%] left-[10%] w-[700px] h-[700px] bg-gradient-to-tr from-[#FEE75C]/15 via-[#FBBF24]/10 to-transparent rounded-full blur-[150px] animate-pulse" style={{ animationDuration: '14s', animationDelay: '1s' }} />

          {/* Additional cosmic depth */}
          <div className="absolute top-[60%] left-[60%] w-[500px] h-[500px] bg-gradient-to-r from-[#A855F7]/15 to-transparent rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '9s', animationDelay: '3s' }} />
        </div>

        {/* Floating Space Illustrations */}
        {[
          // Rockets
          { type: 'rocket', top: '15%', left: '20%', delay: 0, duration: 25, size: 'text-4xl' },
          { type: 'rocket', top: '70%', left: '80%', delay: 8, duration: 30, size: 'text-3xl' },

          // Planets - More diverse planets
          { type: 'saturn', top: '25%', left: '70%', delay: 2, duration: 35, size: 'text-5xl' },
          { type: 'earth', top: '60%', left: '15%', delay: 12, duration: 28, size: 'text-4xl' },
          { type: 'mars', top: '10%', left: '85%', delay: 15, duration: 32, size: 'text-3xl' },
          { type: 'neptune', top: '75%', left: '10%', delay: 20, duration: 40, size: 'text-4xl' },
          { type: 'venus', top: '45%', left: '90%', delay: 6, duration: 26, size: 'text-3xl' },
          { type: 'jupiter', top: '85%', left: '75%', delay: 18, duration: 38, size: 'text-5xl' },

          // Blinking Stars - More variety
          { type: 'star', top: '10%', left: '50%', delay: 1, duration: 20, size: 'text-2xl' },
          { type: 'star', top: '40%', left: '85%', delay: 5, duration: 22, size: 'text-xl' },
          { type: 'star', top: '80%', left: '45%', delay: 7, duration: 18, size: 'text-2xl' },
          { type: 'sparkle', top: '20%', left: '30%', delay: 3, duration: 15, size: 'text-lg' },
          { type: 'sparkle', top: '65%', left: '60%', delay: 9, duration: 17, size: 'text-xl' },
          { type: 'sparkle', top: '35%', left: '5%', delay: 11, duration: 19, size: 'text-lg' },
          { type: 'twinkle', top: '50%', left: '40%', delay: 4, duration: 14, size: 'text-sm' },
          { type: 'twinkle', top: '30%', left: '95%', delay: 13, duration: 16, size: 'text-sm' },
          { type: 'twinkle', top: '90%', left: '30%', delay: 2, duration: 21, size: 'text-sm' },

          // Satellites
          { type: 'satellite', top: '35%', left: '25%', delay: 3, duration: 32, size: 'text-3xl' },
          { type: 'satellite', top: '75%', left: '65%', delay: 10, duration: 26, size: 'text-2xl' }
        ].map((item, i) => (
          <motion.div
            key={`space-${i}`}
            className={`absolute ${item.size} select-none pointer-events-none filter blur-[1px]`}
            style={{ top: item.top, left: item.left }}
            animate={{
              y: item.type.includes('star') || item.type.includes('sparkle') || item.type.includes('twinkle') ?
                [-10, 10, -10] : [-30, 30, -30],
              x: item.type.includes('star') || item.type.includes('sparkle') || item.type.includes('twinkle') ?
                [-5, 5, -5] : [-15, 15, -15],
              rotate: item.type === 'rocket' ? [0, 360] : [-10, 10, -10],
              scale: item.type.includes('star') || item.type.includes('sparkle') || item.type.includes('twinkle') ?
                [0.5, 1.5, 0.5] : [0.8, 1.2, 0.8],
              opacity: item.type.includes('star') || item.type.includes('sparkle') || item.type.includes('twinkle') ?
                [0.3, 1, 0.3] : [0.2, 0.3, 0.2]
            }}
            transition={{
              duration: item.duration,
              delay: item.delay,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {item.type === 'rocket' && <span className="text-white/20">🚀</span>}
            {item.type === 'saturn' && <span className="text-white/25">🪐</span>}
            {item.type === 'earth' && <span className="text-blue-300/30">🌍</span>}
            {item.type === 'mars' && <span className="text-red-300/30">🔴</span>}
            {item.type === 'neptune' && <span className="text-blue-400/30">🔵</span>}
            {item.type === 'venus' && <span className="text-yellow-300/30">🟡</span>}
            {item.type === 'jupiter' && <span className="text-orange-300/30">🟠</span>}
            {item.type === 'star' && <span className="text-white/40">⭐</span>}
            {item.type === 'sparkle' && <span className="text-white/50">✨</span>}
            {item.type === 'twinkle' && <span className="text-white/60">💫</span>}
            {item.type === 'satellite' && <span className="text-white/20">🛰️</span>}
          </motion.div>
        ))}

        {/* Floating Code Symbols with Blur */}
        {[
          { symbol: "</>", top: "12%", left: "40%", delay: 0, duration: 20 },
          { symbol: "{ }", top: "22%", left: "75%", delay: 2, duration: 25 },
          { symbol: "++", top: "55%", left: "90%", delay: 4, duration: 22 },
          { symbol: "==", top: "65%", left: "5%", delay: 1, duration: 28 },
          { symbol: "( )", top: "45%", left: "30%", delay: 3, duration: 24 },
          { symbol: "[ ]", top: "85%", left: "55%", delay: 5, duration: 26 },
          { symbol: "&&", top: "30%", left: "10%", delay: 2.5, duration: 23 },
          { symbol: "||", top: "18%", left: "60%", delay: 1.5, duration: 27 },
          { symbol: "=>", top: "50%", left: "75%", delay: 3.5, duration: 21 },
          { symbol: "/**/", top: "38%", left: "85%", delay: 4.5, duration: 29 }
        ].map((item, i) => (
          <motion.div
            key={`code-${i}`}
            className="absolute text-white/15 text-2xl lg:text-3xl font-mono font-bold select-none pointer-events-none filter blur-[2px]"
            style={{ top: item.top, left: item.left }}
            animate={{
              y: [-25, 25, -25],
              x: [-12, 12, -12],
              rotate: [-8, 8, -8],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{
              duration: item.duration,
              delay: item.delay,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {item.symbol}
          </motion.div>
        ))}

        {/* Enhanced Twinkling Star Field */}
        <div className="absolute inset-0">
          {Array.from({ length: 150 }).map((_, i) => {
            const seed = i * 9876543;
            const left = (seed % 100);
            const top = ((seed * 7) % 100);
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
                  rotate: [0, 180, 360]
                }}
                transition={{
                  duration: blinkSpeed + (i % 3),
                  delay: delay,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <div
                  className={`bg-white rounded-full`}
                  style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    filter: 'blur(0.5px)',
                    opacity: brightness / 10,
                    boxShadow: `0 0 ${size * 2}px rgba(255, 255, 255, ${brightness / 10})`
                  }}
                />
              </motion.div>
            );
          })}
        </div>

        {/* Bright Shooting Stars */}
        <div className="absolute inset-0">
          {Array.from({ length: 8 }).map((_, i) => {
            const startLeft = Math.random() * 100;
            const startTop = Math.random() * 100;
            const endLeft = startLeft + (Math.random() * 40 - 20);
            const endTop = startTop + (Math.random() * 40 - 20);
            const delay = i * 8 + Math.random() * 5;

            return (
              <motion.div
                key={`shooting-star-${i}`}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  left: `${startLeft}%`,
                  top: `${startTop}%`,
                  filter: 'blur(0.5px)',
                  boxShadow: '0 0 8px rgba(255, 255, 255, 0.8), 0 0 16px rgba(255, 255, 255, 0.4)'
                }}
                animate={{
                  x: [`0%`, `${endLeft - startLeft}vw`],
                  y: [`0%`, `${endTop - startTop}vh`],
                  opacity: [0, 1, 1, 0],
                  scale: [0, 1, 1, 0]
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  delay: delay,
                  repeat: Infinity,
                  ease: "easeOut"
                }}
              />
            );
          })}
        </div>

        {/* Constellation Patterns */}
        <div className="absolute inset-0">
          {[
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
            { x: 91, y: 24, size: 1 }
          ].map((star, i) => (
            <motion.div
              key={`constellation-${i}`}
              className="absolute bg-white rounded-full"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                filter: 'blur(0.3px)',
                boxShadow: `0 0 ${star.size * 3}px rgba(255, 255, 255, 0.6)`
              }}
              animate={{
                opacity: [0.4, 1, 0.4],
                scale: [0.8, 1.2, 0.8]
              }}
              transition={{
                duration: 4 + (i % 3),
                delay: i * 0.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </div>


      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full backdrop-blur-sm bg-black/10">
        <div className="px-6 lg:px-10">
          <div className="flex items-center justify-between h-20">
            {/* Personal Brand */}
            <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
              <span className="text-white font-bold text-xl tracking-tight">Piyush Raj</span>
            </Link>

            {/* Center Navigation */}
            <div className="hidden lg:flex items-center gap-10">
              <Link href="#about" className="text-white hover:underline font-semibold">
                About
              </Link>
              <Link href="#experience" className="text-white hover:underline font-semibold">
                Experience
              </Link>
              <Link href="#projects" className="text-white hover:underline font-semibold">
                Projects
              </Link>
              <Link href="#skills" className="text-white hover:underline font-semibold">
                Skills
              </Link>
              <Link href="#education" className="text-white hover:underline font-semibold">
                Education
              </Link>
              <Link href="#contact" className="text-white hover:underline font-semibold">
                Contact
              </Link>
            </div>

            {/* Right side - Resume button */}
            <Button
              className="bg-white hover:bg-[#dcddde] text-black text-sm font-medium px-6 py-2.5 rounded-full transition-all hover:shadow-lg hover:scale-105 hidden md:block"
              onClick={() => window.open('https://github.com/piyush-fs-dev', '_blank')}
            >
              View Resume
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
                <Link href="#education" className="block py-2 text-gray-300 hover:text-white">
                  Education
                </Link>
                <Button
                  className="w-full bg-[#5865f2] hover:bg-[#4752c4] text-white font-semibold rounded-full"
                  onClick={copyEmail}
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
                      <div className="text-white font-semibold mb-4 text-sm lg:text-base">Portfolio Server</div>
                      <div className="text-white/60 text-xs font-semibold uppercase mb-2">Channels</div>
                      <div className="space-y-1">
                        <div className="px-2 py-1 bg-[#42464d] rounded text-[#dcddde] text-sm flex items-center gap-2">
                          <span className="text-[#72767d]">#</span>
                          <span>introductions</span>
                        </div>
                        <div className="px-2 py-1 hover:bg-[#42464d] rounded text-[#96989d] text-sm flex items-center gap-2">
                          <span className="text-[#72767d]">#</span>
                          <span>tech-stack</span>
                        </div>
                        <div className="px-2 py-1 hover:bg-[#42464d] rounded text-[#96989d] text-sm flex items-center gap-2">
                          <span className="text-[#72767d]">#</span>
                          <span>achievements</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Main chat area */}
                  <div className="flex-1 bg-[#36393f] flex flex-col">
                    {/* Chat header */}
                    <div className="h-10 lg:h-12 border-b border-[#202225] px-3 lg:px-4 flex items-center">
                      <span className="text-[#72767d] text-lg">#</span>
                      <span className="ml-2 text-white font-semibold text-sm lg:text-base">introductions</span>
                      <div className="ml-auto flex items-center gap-2">
                        <div className="w-2 h-2 bg-[#3ba55d] rounded-full" />
                        <span className="text-[#b5bac1] text-xs hidden lg:inline">Active Now</span>
                      </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 p-2 lg:p-4 space-y-2 lg:space-y-3 overflow-hidden">
                      <div className="flex gap-2 lg:gap-3">
                        <div className="w-6 h-6 lg:w-8 lg:h-8 bg-[#5865F2] rounded-full flex items-center justify-center text-white text-xs lg:text-sm font-bold flex-shrink-0">P</div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-white font-medium text-xs lg:text-sm">Piyush Raj</span>
                            <span className="bg-[#5865F2] text-white text-xs px-1 py-0.5 rounded text-[10px]">SDE III</span>
                            <span className="text-[#72767d] text-xs">2 mins ago</span>
                          </div>
                          <div className="text-[#dcddde] text-xs lg:text-sm">Hey! I'm a Software Development Engineer III at Angel One. Built AI-powered financial platforms from scratch, processing 720+ articles daily with 70% effort reduction!</div>
                        </div>
                      </div>

                      <div className="flex gap-2 lg:gap-3">
                        <div className="w-6 h-6 lg:w-8 lg:h-8 bg-[#57F287] rounded-full flex items-center justify-center text-[#2c2f33] text-xs lg:text-sm font-bold flex-shrink-0">R</div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-white font-medium text-xs lg:text-sm">Recruiter</span>
                            <span className="bg-[#EB459E] text-white text-xs px-1 py-0.5 rounded text-[10px]">HIRING</span>
                            <span className="text-[#72767d] text-xs">just now</span>
                          </div>
                          <div className="text-[#dcddde] text-xs lg:text-sm">Impressive! Tell me about your experience with scalable systems 🤔</div>
                        </div>
                      </div>

                      <div className="flex gap-2 lg:gap-3">
                        <div className="w-6 h-6 lg:w-8 lg:h-8 bg-[#5865F2] rounded-full flex items-center justify-center text-white text-xs lg:text-sm font-bold flex-shrink-0">P</div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-white font-medium text-xs lg:text-sm">Piyush Raj</span>
                            <span className="text-[#72767d] text-xs">now</span>
                          </div>
                          <div className="text-[#dcddde] text-xs lg:text-sm">Led composable-SDK integration serving 1.67Cr+ B2C and 5.3L+ B2B users with zero failures. Optimized app performance: 40% smaller bundles, FCP under 1.5s, LCP under 2.5s 💪</div>
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