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

        {/* Bright Shooting Stars - Fixed deterministic positions */}
        <div className="absolute inset-0">
          {Array.from({ length: 8 }).map((_, i) => {
            // Use deterministic values based on index to avoid hydration mismatch
            const seed = i * 1234567;
            const startLeft = ((seed % 8000) / 100) + 10;
            const startTop = (((seed * 7) % 8000) / 100) + 10;
            const endLeft = startLeft + (((seed * 3) % 4000) / 100) - 20;
            const endTop = startTop + (((seed * 5) % 4000) / 100) - 20;
            const delay = i * 8 + ((seed % 500) / 100);
            const duration = 2 + ((seed % 200) / 100);

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
                  duration: duration,
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
              onClick={() => window.open('https://github.com/devfirexyz', '_blank')}
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
      <section className="relative min-h-screen flex items-center pt-16 sm:pt-20 md:pt-24 lg:pt-32 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12 xl:gap-16 items-center">
            {/* Left Side - Portfolio Content */}
            <div className="text-left order-2 lg:order-1 max-w-none lg:max-w-2xl">
              {/* Animated heading with stagger effect */}
              <div className="mb-6 sm:mb-8 overflow-hidden">
                <motion.h1
                  className="font-black text-white uppercase tracking-tight"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6 }}
                >
                  <motion.span
                    className="block text-[28px] xs:text-[32px] sm:text-[40px] md:text-[48px] lg:text-[52px] xl:text-[64px] 2xl:text-[72px] leading-[0.9] font-extrabold"
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                  >
                    SOFTWARE
                  </motion.span>
                  <motion.span
                    className="block text-[28px] xs:text-[32px] sm:text-[40px] md:text-[48px] lg:text-[52px] xl:text-[64px] 2xl:text-[72px] leading-[0.9] font-extrabold"
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                  >
                    DEVELOPMENT
                  </motion.span>
                  <motion.span
                    className="block text-[28px] xs:text-[32px] sm:text-[40px] md:text-[48px] lg:text-[52px] xl:text-[64px] 2xl:text-[72px] leading-[0.9] font-extrabold bg-gradient-to-r from-[#5865F2] via-[#8B5CF6] to-[#EB459E] bg-clip-text text-transparent animate-pulse"
                    style={{ animationDuration: '3s' }}
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
                  >
                    ENGINEER III
                  </motion.span>
                </motion.h1>
              </div>

              {/* Animated description */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="mb-8 sm:mb-10 lg:mb-12"
              >
                <div className="text-base sm:text-lg lg:text-xl xl:text-2xl text-white/90 leading-relaxed max-w-2xl">
                  Building scalable applications at{' '}
                  <motion.span
                    className="text-[#5865F2] font-semibold relative"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    Angel One
                    <motion.div
                      className="absolute bottom-0 left-0 w-full h-0.5 bg-[#5865F2]"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.6, delay: 1.2 }}
                    />
                  </motion.span>{' '}
                  with modern tech stack. Specialized in AI-powered platforms, micro-frontends, and high-performance web applications serving millions of users.
                </div>
              </motion.div>

              {/* CTA Buttons with enhanced animations */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0, duration: 0.8, ease: "easeOut" }}
                className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-8 sm:mb-12"
              >
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-white hover:bg-[#f2f3f5] text-black px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-medium rounded-full flex items-center justify-center gap-3 transition-all duration-300 hover:shadow-2xl hover:shadow-white/20 group"
                    onClick={() => window.open('https://github.com/devfirexyz', '_blank')}
                  >
                    <Github className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                    View Projects
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto bg-gradient-to-r from-[#23272a] to-[#2c2f36] hover:from-[#36393f] hover:to-[#3a3d44] text-white border-2 border-white/20 hover:border-white/40 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-medium rounded-full transition-all duration-300 hover:shadow-2xl hover:shadow-[#5865F2]/20 group"
                    onClick={copyEmail}
                  >
                    <Mail className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                    {copiedEmail ? '✓ Email Copied!' : 'Get In Touch'}
                  </Button>
                </motion.div>
              </motion.div>
            </div>

            {/* Right Side - Discord UI Elements */}
            <div className="relative order-1 lg:order-2 h-[350px] sm:h-[400px] md:h-[450px] lg:h-[550px] xl:h-[650px]">
              {/* Main Discord Desktop Window */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotateY: 10 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                transition={{
                  delay: 2.0,
                  duration: 1.0,
                  ease: "easeOut",
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{
                  scale: 1.02,
                  rotateY: -2,
                  transition: { duration: 0.3 }
                }}
                className="absolute left-0 top-0 w-full h-[300px] sm:h-[350px] md:h-[400px] lg:h-[450px] xl:h-[500px]"
              >
                <div className="bg-[#36393f] rounded-lg shadow-2xl overflow-hidden h-full backdrop-blur-sm">
                  {/* Discord window header */}
                  <div className="h-8 bg-[#202225] flex items-center justify-between px-4">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                      <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                      <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                    </div>
                    <div className="text-white text-sm font-medium">Portfolio Chat</div>
                    <div className="w-12" />
                  </div>

                  {/* Discord app interface */}
                  <div className="flex h-full">
                    {/* Server sidebar with smooth animations */}
                    <div className="w-[60px] lg:w-[72px] bg-[#202225] flex flex-col items-center py-3 gap-2">
                      <motion.div
                        className="w-10 h-10 lg:w-12 lg:h-12 bg-[#5865F2] rounded-[20px] lg:rounded-[24px] flex items-center justify-center text-white font-bold cursor-pointer relative group"
                        whileHover={{
                          borderRadius: "16px",
                          scale: 1.1,
                          rotate: [0, -5, 5, 0]
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 20,
                          duration: 0.3
                        }}
                      >
                        <motion.svg
                          className="w-6 h-6 lg:w-8 lg:h-8"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.2 }}
                        >
                          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.197.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                        </motion.svg>
                        <motion.div
                          className="absolute -inset-1 bg-white/10 rounded-[20px] -z-10"
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileHover={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.2 }}
                        />
                      </motion.div>
                      <div className="w-8 h-[2px] lg:w-12 lg:h-[2px] bg-[#35383e] rounded-full" />
                      {[
                        { color: "#5865F2", delay: 0 },
                        { color: "#57F287", delay: 0.1 },
                        { color: "#EB459E", delay: 0.2 }
                      ].map((server, index) => (
                        <motion.div
                          key={index}
                          className="w-10 h-10 lg:w-12 lg:h-12 bg-[#36393f] rounded-full cursor-pointer relative group"
                          whileHover={{
                            backgroundColor: server.color,
                            borderRadius: "16px",
                            scale: 1.1
                          }}
                          whileTap={{ scale: 0.95 }}
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 25,
                            delay: server.delay
                          }}
                        >
                          <motion.div
                            className="absolute -inset-1 rounded-full -z-10"
                            style={{ backgroundColor: server.color }}
                            initial={{ opacity: 0, scale: 0.5 }}
                            whileHover={{ opacity: 0.2, scale: 1.1 }}
                            transition={{ duration: 0.3 }}
                          />
                        </motion.div>
                      ))}
                    </div>

                    {/* Channel sidebar with smooth interactions */}
                    <div className="hidden sm:block w-[140px] lg:w-[180px] bg-[#2f3136]">
                      <div className="p-3 lg:p-4">
                        <motion.div
                          className="text-white font-semibold mb-4 text-sm lg:text-base"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 2.5, duration: 0.6 }}
                        >
                          Portfolio Server
                        </motion.div>
                        <motion.div
                          className="text-white/60 text-xs font-semibold uppercase mb-2"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 2.7, duration: 0.6 }}
                        >
                          Text Channels
                        </motion.div>
                        <div className="space-y-1">
                          {[
                            { name: "introductions", active: true, delay: 2.8 },
                            { name: "tech-stack", active: false, delay: 3.0 },
                            { name: "achievements", active: false, delay: 3.2 }
                          ].map((channel, index) => (
                            <motion.div
                              key={channel.name}
                              className={`px-2 py-1 rounded text-sm flex items-center gap-2 cursor-pointer group transition-all duration-300 ${
                                channel.active
                                  ? "bg-[#42464d] text-white"
                                  : "text-[#96989d] hover:bg-[#42464d]/50 hover:text-white"
                              }`}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: channel.delay, duration: 0.4 }}
                              whileHover={{
                                x: 4,
                                backgroundColor: channel.active ? "#42464d" : "#42464d"
                              }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <motion.span
                                className="text-[#72767d] group-hover:text-white transition-colors duration-300"
                                whileHover={{ scale: 1.2 }}
                              >
                                #
                              </motion.span>
                              <span className="truncate">{channel.name}</span>
                              {channel.active && (
                                <motion.div
                                  className="w-1 h-4 bg-white rounded-full ml-auto"
                                  initial={{ scaleY: 0 }}
                                  animate={{ scaleY: 1 }}
                                  transition={{ delay: channel.delay + 0.3, duration: 0.3 }}
                                />
                              )}
                            </motion.div>
                          ))}
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
                          <div className="w-2 h-2 bg-[#3ba55d] rounded-full animate-pulse" />
                          <span className="text-[#b5bac1] text-xs hidden lg:inline">Active Now</span>
                        </div>
                      </div>

                      {/* Messages with smooth animations */}
                      <div className="flex-1 p-3 lg:p-4 space-y-3 overflow-y-auto bg-[#36393f] smooth-scroll">
                        {[
                          {
                            user: "Piyush Raj",
                            avatar: "P",
                            role: "SDE III",
                            time: "2 mins ago",
                            message: "Hey! I'm a Software Development Engineer III at Angel One. Built AI-powered financial platforms from scratch, processing 720+ articles daily with 70% effort reduction!",
                            avatarColors: "from-[#5865F2] to-[#4752c4]",
                            delay: 3.5
                          },
                          {
                            user: "Tech Recruiter",
                            avatar: "R",
                            role: "HIRING",
                            time: "1 min ago",
                            message: "Impressive! Tell me about your experience with scalable systems 🤔",
                            avatarColors: "from-[#57F287] to-[#3ba55d]",
                            roleColor: "bg-[#EB459E]",
                            delay: 4.0
                          },
                          {
                            user: "Piyush Raj",
                            avatar: "P",
                            time: "just now",
                            message: "Led composable-SDK integration serving 1.67Cr+ B2C and 5.3L+ B2B users with zero failures. Optimized performance: 40% smaller bundles, FCP under 1.5s 💪",
                            avatarColors: "from-[#5865F2] to-[#4752c4]",
                            delay: 4.5
                          }
                        ].map((msg, msgIndex) => (
                          <motion.div
                            key={msgIndex}
                            className="flex gap-3 group"
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{
                              delay: msg.delay,
                              duration: 0.6,
                              type: "spring",
                              stiffness: 200
                            }}
                            whileHover={{ scale: 1.01 }}
                          >
                            <motion.div
                              className={`w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br ${msg.avatarColors} rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-lg cursor-pointer`}
                              whileHover={{
                                scale: 1.1,
                                rotate: [0, -5, 5, 0],
                                boxShadow: "0 8px 32px rgba(88, 101, 242, 0.3)"
                              }}
                              transition={{ duration: 0.3 }}
                            >
                              {msg.avatar}
                            </motion.div>
                            <div className="flex-1">
                              <motion.div
                                className="flex items-center gap-2 mb-1"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: msg.delay + 0.1, duration: 0.4 }}
                              >
                                <span className="text-[#f2f3f5] font-bold text-sm hover:text-white transition-colors cursor-pointer">
                                  {msg.user}
                                </span>
                                {msg.role && (
                                  <motion.span
                                    className={`${msg.roleColor || "bg-[#5865F2]"} text-white text-xs px-2 py-0.5 rounded font-medium cursor-pointer`}
                                    whileHover={{ scale: 1.05, y: -1 }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    {msg.role}
                                  </motion.span>
                                )}
                                <span className="text-[#b5bac1] text-xs group-hover:text-[#dcddde] transition-colors">
                                  {msg.time}
                                </span>
                              </motion.div>
                              <motion.div
                                className="text-[#dcddde] text-sm leading-relaxed bg-[#4f545c]/60 p-3 rounded-lg border border-[#5c6370]/50 shadow-sm backdrop-blur-sm hover:bg-[#4f545c]/80 hover:border-[#5c6370]/70 transition-all duration-300 cursor-pointer group-hover:shadow-md"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: msg.delay + 0.2, duration: 0.5 }}
                                whileHover={{ y: -1 }}
                              >
                                {msg.message.split(/(Angel One|720\+ articles daily|70% effort reduction|1\.67Cr\+ B2C|5\.3L\+ B2B users|zero failures|40% smaller bundles|scalable systems)/).map((part, i) => {
                                  const highlights: Record<string, string> = {
                                    "Angel One": "text-[#00d4aa] bg-[#00d4aa]/20",
                                    "720+ articles daily": "text-[#faa61a] bg-[#faa61a]/20",
                                    "70% effort reduction": "text-[#23a559] bg-[#23a559]/20",
                                    "1.67Cr+ B2C": "text-[#faa61a] bg-[#faa61a]/20",
                                    "5.3L+ B2B users": "text-[#faa61a] bg-[#faa61a]/20",
                                    "zero failures": "text-[#23a559] bg-[#23a559]/20",
                                    "40% smaller bundles": "text-[#5865f2] bg-[#5865f2]/20",
                                    "scalable systems": "text-[#5865f2] bg-[#5865f2]/20"
                                  };

                                  if (highlights[part]) {
                                    return (
                                      <motion.span
                                        key={i}
                                        className={`font-semibold px-1.5 py-0.5 rounded transition-all duration-200 hover:scale-105 cursor-pointer ${highlights[part]}`}
                                        whileHover={{ scale: 1.05 }}
                                      >
                                        {part}
                                      </motion.span>
                                    );
                                  }
                                  return part;
                                })}
                              </motion.div>
                            </div>
                          </motion.div>
                        ))}

                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

      
      </section>
    </div>
  )
}