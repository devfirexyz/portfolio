"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useScroll, useTransform, useInView, useSpring, AnimatePresence } from "framer-motion"
import { ArrowDown, Code, Github, Mail, User, X, Terminal, Gamepad2, Trophy, Target, Sword, Zap, Crown, Sparkles, Cpu, Rocket } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import CustomCursor from "@/components/custom-cursor"
import TextReveal from "@/components/text-reveal"
import ParticleBackground from "@/components/particle-background"
import ProjectCard from "@/components/project-card"
import HorizontalScroll from "@/components/horizontal-scroll"
import PlayerCard from "@/components/player-card"

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState("home")
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const aboutRef = useRef(null)
  const skillsRef = useRef(null)
  const projectsRef = useRef(null)
  const contactRef = useRef(null)
  const heroRef = useRef(null)
  const journeyRef = useRef(null)

  const aboutInView = useInView(aboutRef, { once: false, amount: 0.3 })
  const skillsInView = useInView(skillsRef, { once: false, amount: 0.3 })
  const projectsInView = useInView(projectsRef, { once: false, amount: 0.3 })
  const contactInView = useInView(contactRef, { once: false, amount: 0.3 })
  const heroInView = useInView(heroRef, { once: false, amount: 0.3 })
  const journeyInView = useInView(journeyRef, { once: false, amount: 0.3 })

  const { scrollYProgress } = useScroll()
  const scrollProgress = useTransform(scrollYProgress, [0, 1], [0, 100])
  const smoothScrollProgress = useSpring(scrollProgress, { stiffness: 100, damping: 30 })

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  useEffect(() => {
    if (heroInView) setActiveSection("home")
    else if (aboutInView) setActiveSection("about")
    else if (skillsInView) setActiveSection("skills")
    else if (projectsInView) setActiveSection("projects")
    else if (contactInView) setActiveSection("contact")
    else if (journeyInView) setActiveSection("journey")
  }, [heroInView, aboutInView, skillsInView, projectsInView, contactInView, journeyInView])

  const projects = [
    {
      title: "E-Commerce Platform",
      description: "A full-featured online store with payment integration and admin dashboard.",
      image: "/ecommerce-dashboard-dark.png",
      tags: ["Next.js", "Stripe", "Tailwind CSS"],
      color: "#7c3aed",
    },
    {
      title: "Social Media App",
      description: "A real-time social platform with messaging and content sharing.",
      image: "/social-media-dark-mode.png",
      tags: ["React", "Firebase", "Socket.io"],
      color: "#8b5cf6",
    },
    {
      title: "Portfolio Website",
      description: "A custom portfolio site with animations and interactive elements.",
      image: "/dark-portfolio-showcase.png",
      tags: ["Next.js", "Framer Motion", "Three.js"],
      color: "#6d28d9",
    },
    {
      title: "Task Management",
      description: "A productivity app for managing tasks and team collaboration.",
      image: "/task-management-dark.png",
      tags: ["React", "Redux", "Node.js"],
      color: "#9333ea",
    },
    {
      title: "Fitness Tracker",
      description: "An app to track workouts, nutrition, and fitness progress.",
      image: "/fitness-tracker-dark.png",
      tags: ["React Native", "GraphQL", "MongoDB"],
      color: "#a855f7",
    },
    {
      title: "Weather Dashboard",
      description: "Real-time weather forecasting with interactive maps and alerts.",
      image: "/weather-dashboard-dark.png",
      tags: ["JavaScript", "Weather API", "D3.js"],
      color: "#c084fc",
    },
  ]

  return (
    <>
      <CustomCursor mousePosition={mousePosition} />

      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-purple-600 z-50 origin-left"
        style={{ scaleX: scrollYProgress }}
      />

      <div className="min-h-screen bg-black text-white overflow-hidden">
        {/* Navigation */}
        <nav className="fixed top-0 z-40 w-full backdrop-blur-lg bg-black/50 border-b border-gray-800/50">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="text-xl font-bold"
            >
              <span className="text-white">Piyush</span>
              <span className="text-purple-500">Raj</span>
            </motion.div>

            <motion.ul
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, staggerChildren: 0.1, delayChildren: 0.2 }}
              className="hidden md:flex space-x-8"
            >
              {["home", "about", "journey", "skills", "projects", "contact"].map((item) => (
                <motion.li key={item} whileHover={{ y: -2 }} className="relative">
                  <a
                    href={`#${item === "home" ? "" : item}`}
                    className={`hover:text-purple-500 transition-colors capitalize ${
                      activeSection === item ? "text-purple-500" : "text-gray-300"
                    }`}
                  >
                    {item}
                  </a>
                  {activeSection === item && (
                    <motion.div
                      layoutId="activeSection"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-purple-500"
                    />
                  )}
                </motion.li>
              ))}
            </motion.ul>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="md:hidden"
            >
              <Button variant="ghost" size="icon" className="text-white" onClick={() => setShowMobileMenu(true)}>
                <User className="h-6 w-6" />
              </Button>
            </motion.div>
          </div>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {showMobileMenu && (
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-0 bg-black z-50 flex flex-col p-6"
            >
              <div className="flex justify-end">
                <Button variant="ghost" size="icon" onClick={() => setShowMobileMenu(false)} className="text-white">
                  <X className="h-6 w-6" />
                </Button>
              </div>

              <div className="flex flex-col items-center justify-center flex-1 gap-8">
                {["home", "about", "journey", "skills", "projects", "contact"].map((item) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * ["home", "about", "journey", "skills", "projects", "contact"].indexOf(item) }}
                  >
                    <a
                      href={`#${item === "home" ? "" : item}`}
                      className="text-3xl font-bold hover:text-purple-500 transition-colors capitalize"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      {item}
                    </a>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hero Section */}
        <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
          <ParticleBackground />

          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-black/80" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(120,50,255,0.15),transparent_70%)]" />
          </div>

          <div className="container mx-auto px-4 z-10">
            <div className="flex flex-col items-center text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="mb-6 relative w-32 h-32 group"
              >
                {/* Base glow effect */}
                <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-xl" />
                
                {/* Sphere Container */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* X-axis rings */}
                  <div className="absolute w-full h-full animate-spin-slow">
                    <div className="absolute inset-0 border-2 border-purple-500/30 rounded-full transform rotate-0" />
                    <div className="absolute inset-0 border-2 border-purple-500/30 rounded-full transform rotate-45" />
                    <div className="absolute inset-0 border-2 border-purple-500/30 rounded-full transform rotate-90" />
                    <div className="absolute inset-0 border-2 border-purple-500/30 rounded-full transform rotate-135" />
                  </div>
                  
                  {/* Y-axis rings */}
                  <div className="absolute w-full h-full animate-spin-reverse">
                    <div className="absolute inset-0 border-2 border-purple-400/30 rounded-full transform rotateY-0" />
                    <div className="absolute inset-0 border-2 border-purple-400/30 rounded-full transform rotateY-45" />
                    <div className="absolute inset-0 border-2 border-purple-400/30 rounded-full transform rotateY-90" />
                    <div className="absolute inset-0 border-2 border-purple-400/30 rounded-full transform rotateY-135" />
                  </div>
                  
                  {/* Z-axis rings */}
                  <div className="absolute w-full h-full animate-spin-slow-reverse">
                    <div className="absolute inset-0 border-2 border-purple-300/30 rounded-full transform rotateZ-0" />
                    <div className="absolute inset-0 border-2 border-purple-300/30 rounded-full transform rotateZ-45" />
                    <div className="absolute inset-0 border-2 border-purple-300/30 rounded-full transform rotateZ-90" />
                    <div className="absolute inset-0 border-2 border-purple-300/30 rounded-full transform rotateZ-135" />
                  </div>
                  
                  {/* Core */}
                  <div className="relative text-2xl font-bold text-purple-400/80 flex items-center">
                    <span className="animate-float-slow mr-0.5">P</span>
                    <span className="animate-float-delayed ml-0.5">R</span>
                    
                    {/* Glowing effect behind letters */}
                    <div className="absolute inset-0 blur-sm bg-purple-500/30 -z-10" />
                    
                    {/* Rotating dots around letters */}
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-0.5 h-0.5 rounded-full bg-purple-300"
                        style={{
                          transform: `rotate(${i * 60}deg) translateY(-10px)`,
                          animation: `micro-orbit ${2 + i * 0.5}s infinite linear`
                        }}
                      />
                    ))}
                  </div>
                  
                  {/* Particles */}
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-1 h-1 rounded-full bg-purple-400"
                      style={{
                        top: `${50 + Math.cos(i * 30) * 40}%`,
                        left: `${50 + Math.sin(i * 30) * 40}%`,
                        animation: `particle-orbit ${3 + Math.random() * 2}s infinite linear`,
                        opacity: 0.6,
                      }}
                    />
                  ))}
                </div>
              </motion.div>

              <div className="overflow-hidden">
                <TextReveal
                  text="Player One: Piyush Raj"
                  className="text-4xl md:text-6xl font-bold mb-4"
                  highlightColor="text-purple-500"
                />
              </div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-xl md:text-2xl text-gray-300 mb-8"
              >
                <span className="text-purple-400">Level 80</span>{" "}
                <span className="text-gray-400">|</span>{" "}
                <span className="text-purple-400">Software Engineer</span>{" "}
                <span className="text-gray-400">|</span>{" "}
                <span className="text-purple-400">AngelOne Guild</span>
              </motion.h2>

              <div className="flex flex-col md:flex-row items-center gap-8 mt-12">
                <PlayerCard />
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="flex flex-wrap gap-4 justify-center"
                >
                  <Button className="bg-purple-600 hover:bg-purple-700 relative overflow-hidden group" asChild>
                    <a href="#projects">
                      <Sword className="w-4 h-4 mr-2 inline-block" />
                      <span className="relative z-10">View Quests</span>
                      <span className="absolute inset-0 bg-purple-800 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    className="border-purple-500 text-purple-500 hover:bg-purple-500/10 relative overflow-hidden group"
                    asChild
                  >
                    <a href="#contact">
                      <span className="relative z-10">Contact Me</span>
                      <span className="absolute inset-0 bg-purple-500/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    </a>
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1,
              delay: 1.2,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          >
            <a href="#about" className="flex flex-col items-center text-gray-400 hover:text-white transition-colors">
              <span className="text-sm mb-2">Scroll Down</span>
              <ArrowDown className="h-5 w-5" />
            </a>
          </motion.div>
        </section>

        {/* About Section */}
        <section id="about" ref={aboutRef} className="py-20 bg-gray-950 relative">
          <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-black to-transparent z-10" />

          <div className="container mx-auto px-4 relative z-20">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={aboutInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7 }}
              className="max-w-4xl mx-auto"
            >
              <div className="flex flex-col items-center mb-12">
                <div className="inline-block relative">
                  <h2 className="text-3xl md:text-4xl font-bold text-center flex items-center gap-3">
                    <Crown className="w-8 h-8 text-purple-500" />
                    Character <span className="text-purple-500">Stats</span>
                  </h2>
                  <motion.div
                    className="absolute -bottom-2 left-0 right-0 h-1 bg-purple-500"
                    initial={{ width: 0 }}
                    animate={aboutInView ? { width: "100%" } : { width: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-10 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={aboutInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.7, delay: 0.2 }}
                  className="relative"
                >
                  {/* Character Stats Card */}
                  <div className="relative p-6 rounded-lg bg-gray-900/50 backdrop-blur-sm border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300">
                    {/* Character Level Banner */}
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-purple-500 px-4 py-1 rounded-full text-sm font-bold">
                      Level 80
                    </div>

                    {/* Stats Grid */}
                    <div className="space-y-6 mt-4">
                      {[
                        { label: "Class", value: "Software Engineer", icon: Code, color: "text-blue-400" },
                        { label: "Guild", value: "AngelOne", icon: Trophy, color: "text-yellow-400" },
                        { label: "Experience", value: "4+ Years", icon: Target, color: "text-green-400" },
                        { label: "Specialization", value: "Full Stack", icon: Cpu, color: "text-red-400" },
                      ].map((stat, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={aboutInView ? { opacity: 1, x: 0 } : {}}
                          transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                          className="flex items-center gap-4"
                        >
                          <div className={`w-10 h-10 rounded-lg bg-gray-800/50 flex items-center justify-center ${stat.color}`}>
                            <stat.icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm text-gray-400">{stat.label}</div>
                            <div className="text-white font-medium">{stat.value}</div>
                          </div>
                          {/* Progress Bar */}
                          <div className="w-24 h-2 bg-gray-800 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={aboutInView ? { width: "85%" } : { width: 0 }}
                              transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                              className="h-full bg-gradient-to-r from-purple-500 to-purple-300"
                            />
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Achievement Badges */}
                    <div className="mt-8 grid grid-cols-3 gap-3">
                      {[
                        { icon: Zap, label: "Fast Learner" },
                        { icon: Crown, label: "Team Leader" },
                        { icon: Sparkles, label: "Problem Solver" },
                      ].map((badge, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={aboutInView ? { opacity: 1, scale: 1 } : {}}
                          transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                          className="flex flex-col items-center gap-2 p-2 rounded-lg bg-gray-800/30 border border-purple-500/20"
                        >
                          <badge.icon className="w-5 h-5 text-purple-400" />
                          <span className="text-xs text-gray-400">{badge.label}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={aboutInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.7, delay: 0.4 }}
                >
                  <h3 className="text-2xl font-semibold mb-4 text-purple-400">Who I Am</h3>
                  <p className="text-gray-300 mb-4 leading-relaxed">
                    I'm a passionate <span className="text-purple-400 font-medium">Senior Software Engineer</span> currently working at AngelOne. With extensive experience in web development, I bring a unique perspective to every project.
                  </p>
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    My journey from a Frontend Developer intern to an SDE-2 (soon to be SDE-3) has been marked by rapid growth, continuous learning, and a deep commitment to creating impactful solutions. I believe in clean code, thoughtful UI, and building products that make a difference.
                  </p>

                  <div className="flex flex-wrap gap-3">
                    {["React", "Next.js", "TypeScript", "Node.js", "UI/UX"].map((skill, index) => (
                      <Badge
                        key={index}
                        className="bg-purple-600/10 text-purple-400 border border-purple-500/30 hover:bg-purple-600/20 transition-colors duration-300"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Journey Section */}
        <section id="journey" ref={journeyRef} className="py-20 bg-gray-950 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-black to-transparent z-10" />
          
          {/* Gaming-inspired background effects */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(120,50,255,0.15),transparent_70%)]" />
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
          <div className="absolute inset-0 bg-black/50" />
          
          {/* Animated particles or lines (optional) */}
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute h-px w-[100px] bg-gradient-to-r from-transparent via-purple-500 to-transparent"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  rotate: `${Math.random() * 360}deg`,
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.1,
                }}
              />
            ))}
          </div>

          <div className="container mx-auto px-4 relative z-20">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={journeyInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7 }}
              className="max-w-4xl mx-auto"
            >
              <div className="flex flex-col items-center mb-12">
                <div className="inline-block relative">
                  <h2 className="text-3xl md:text-4xl font-bold text-center flex items-center gap-3">
                    <Gamepad2 className="w-8 h-8 text-purple-500" />
                    Quest <span className="text-purple-500">Progress</span>
                  </h2>
                  <motion.div
                    className="absolute -bottom-2 left-0 right-0 h-1 bg-purple-500"
                    initial={{ width: 0 }}
                    animate={journeyInView ? { width: "100%" } : { width: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  />
                </div>
              </div>

              <div className="space-y-12">
                {[
                  {
                    year: "2021",
                    level: "Level 1",
                    title: "Beginner's Quest",
                    description: "Started my journey as a Frontend Developer intern during my final year at LPU.",
                    icon: Terminal,
                    achievement: "First Code Deployment 🎯",
                  },
                  {
                    year: "2021-2023",
                    level: "Level 2",
                    title: "Code Warrior",
                    description: "Worked as SDE-1 at an early-stage startup for 1 year and 10 months, gaining hands-on experience in web development.",
                    icon: Rocket,
                    achievement: "Startup Survivor 🚀",
                  },
                  {
                    year: "2023",
                    level: "Level 3",
                    title: "New Adventure",
                    description: "Transitioned to AngelOne through an acquihire, continuing as SDE-1.",
                    icon: Target,
                    achievement: "Team Transition Master 🎯",
                  },
                  {
                    year: "2024",
                    level: "Level 4",
                    title: "Power Level Up",
                    description: "Promoted to SDE-2 within 10 months at AngelOne.",
                    icon: Trophy,
                    achievement: "Quick Promotion Unlocked 🏆",
                  },
                  {
                    year: "2025",
                    level: "Level 5",
                    title: "Boss Battle",
                    description: "On track for promotion to SDE-3 by April 2025.",
                    icon: Target,
                    achievement: "Next Challenge Loading... ⚔️",
                  },
                ].map((milestone, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                    animate={journeyInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.7, delay: 0.2 * index }}
                    className="relative"
                  >
                    {/* Connection Line */}
                    {index !== 4 && (
                      <div className="absolute left-[27px] top-[64px] w-1 h-[calc(100%+48px)] bg-gradient-to-b from-purple-500 to-transparent" />
                    )}

                    <div className="flex gap-6">
                      {/* Level Indicator */}
                      <div className="relative">
                        <motion.div
                          className="w-14 h-14 rounded-full bg-purple-500/20 border-2 border-purple-500 flex items-center justify-center"
                          whileHover={{ scale: 1.1 }}
                        >
                          <milestone.icon className="w-6 h-6 text-purple-400" />
                        </motion.div>
                      </div>

                      {/* Content Card */}
                      <div className="flex-1">
                        <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 relative group">
                          {/* Gaming-inspired hover effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-600/5 to-purple-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <span className="text-purple-400 font-semibold">{milestone.year}</span>
                              <h3 className="text-xl font-bold mt-1 text-white group-hover:text-purple-400 transition-colors">
                                {milestone.title}
                              </h3>
                            </div>
                            <span className="text-sm font-mono text-purple-400/80">{milestone.level}</span>
                          </div>
                          
                          <p className="text-gray-300 mb-4">{milestone.description}</p>
                          
                          <div className="flex items-center gap-2 text-sm">
                            <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400">
                              {milestone.achievement}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" ref={skillsRef} className="py-20 bg-black relative">
          <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-gray-950 to-transparent z-10" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(120,50,255,0.15),transparent_70%)]" />
          
          {/* Add gaming grid background */}
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />

          <div className="container mx-auto px-4 relative z-20">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={skillsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7 }}
              className="max-w-4xl mx-auto"
            >
              <div className="flex flex-col items-center mb-12">
                <div className="inline-block relative">
                  <h2 className="text-3xl md:text-4xl font-bold text-center flex items-center gap-3">
                    <Cpu className="w-8 h-8 text-purple-500" />
                    Skill <span className="text-purple-500">Tree</span>
                  </h2>
                  <motion.div
                    className="absolute -bottom-2 left-0 right-0 h-1 bg-purple-500"
                    initial={{ width: 0 }}
                    animate={skillsInView ? { width: "100%" } : { width: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-10">
                {[
                  { name: "Frontend Magic", icon: Sparkles, value: 90, xp: "90,000 XP" },
                  { name: "Backend Powers", icon: Zap, value: 85, xp: "85,000 XP" },
                  { name: "UI/UX Mastery", icon: Crown, value: 80, xp: "80,000 XP" },
                  { name: "React Wizardry", icon: Cpu, value: 95, xp: "95,000 XP" },
                  { name: "Node.js Craft", icon: Terminal, value: 85, xp: "85,000 XP" },
                  { name: "Database Arts", icon: Trophy, value: 75, xp: "75,000 XP" },
                ].map((skill, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={skillsInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                    className="group"
                    whileHover={{ y: -5 }}
                  >
                    <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800/50 hover:border-purple-500/50 transition-all duration-300 h-full relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      <CardContent className="p-6 flex flex-col items-center text-center relative z-10">
                        <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center mb-4 group-hover:bg-purple-500/20 transition-colors relative">
                          <skill.icon className="h-8 w-8 text-purple-400" />
                          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100">
                            <motion.circle
                              initial={{ pathLength: 0 }}
                              animate={skillsInView ? { pathLength: skill.value / 100 } : { pathLength: 0 }}
                              transition={{ duration: 1.5, delay: 0.2 + 0.1 * index }}
                              stroke="rgba(139, 92, 246, 0.6)"
                              strokeWidth="4"
                              fill="transparent"
                              r="48"
                              cx="50"
                              cy="50"
                              strokeLinecap="round"
                              className="transform -rotate-90 origin-center"
                            />
                          </svg>
                        </div>
                        <h3 className="font-semibold mb-2 group-hover:text-purple-400 transition-colors">
                          {skill.name}
                        </h3>
                        <div className="w-full bg-gray-800/50 rounded-full h-2.5 mb-1 mt-2 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={skillsInView ? { width: `${skill.value}%` } : {}}
                            transition={{ duration: 1, delay: 0.2 + 0.1 * index }}
                            className="h-full rounded-full bg-gradient-to-r from-purple-600 to-purple-400"
                          />
                        </div>
                        <span className="text-sm text-purple-400 font-mono">{skill.xp}</span>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" ref={projectsRef} className="py-20 bg-gray-950 relative">
          <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-black to-transparent z-10" />

          <div className="container mx-auto px-4 relative z-20">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={projectsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7 }}
            >
              <div className="flex flex-col items-center mb-12">
                <div className="inline-block relative">
                  <h2 className="text-3xl md:text-4xl font-bold text-center flex items-center gap-3">
                    <Trophy className="w-8 h-8 text-purple-500" />
                    Quest <span className="text-purple-500">Log</span>
                  </h2>
                  <motion.div
                    className="absolute -bottom-2 left-0 right-0 h-1 bg-purple-500"
                    initial={{ width: 0 }}
                    animate={projectsInView ? { width: "100%" } : { width: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  />
                </div>
              </div>

              <div className="overflow-hidden">
                <HorizontalScroll className="flex gap-6 pb-8 px-4 -mx-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide">
                  {projects.map((project, index) => (
                    <div key={index} className="snap-center" style={{ flex: "0 0 85%" }}>
                      <ProjectCard project={project} index={index} inView={projectsInView} />
                    </div>
                  ))}
                </HorizontalScroll>
              </div>

              <div className="mt-8 text-center">
                <Button variant="outline" className="border-purple-500 text-purple-500 hover:bg-purple-500/10">
                  View All Projects
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" ref={contactRef} className="py-20 bg-black relative">
          <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-gray-950 to-transparent z-10" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(120,50,255,0.15),transparent_70%)]" />

          <div className="container mx-auto px-4 relative z-20">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={contactInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7 }}
              className="max-w-4xl mx-auto"
            >
              <div className="flex flex-col items-center mb-12">
                <div className="inline-block relative">
                  <h2 className="text-3xl md:text-4xl font-bold text-center flex items-center gap-3">
                    <Gamepad2 className="w-8 h-8 text-purple-500" />
                    Player <span className="text-purple-500">Connect</span>
                  </h2>
                  <motion.div
                    className="absolute -bottom-2 left-0 right-0 h-1 bg-purple-500"
                    initial={{ width: 0 }}
                    animate={contactInView ? { width: "100%" } : { width: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-10">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={contactInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.7, delay: 0.2 }}
                  className="relative"
                >
                  <div className="absolute -top-10 -left-10 w-20 h-20 border border-purple-500/30 rounded-full z-[-1]" />
                  <div className="absolute -bottom-10 -right-10 w-40 h-40 border border-purple-500/30 rounded-full z-[-1]" />

                  <h3 className="text-2xl font-semibold mb-4 text-purple-400">Contact Information</h3>
                  <p className="text-gray-300 mb-6">
                    Feel free to reach out to me for collaborations, opportunities, or just to say hello!
                  </p>

                  <div className="space-y-6">
                    <motion.div className="flex items-center group" whileHover={{ x: 5 }}>
                      <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center mr-4 group-hover:bg-purple-500/20 transition-colors">
                        <Mail className="h-5 w-5 text-purple-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Email</p>
                        <p className="text-white group-hover:text-purple-400 transition-colors">piyushraj888s@gmail.com</p>
                      </div>
                    </motion.div>

                    <motion.div className="flex items-center group" whileHover={{ x: 5 }}>
                      <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center mr-4 group-hover:bg-purple-500/20 transition-colors">
                        <Github className="h-5 w-5 text-purple-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">GitHub</p>
                        <p className="text-white group-hover:text-purple-400 transition-colors">github.com/devfirexyz</p>
                      </div>
                    </motion.div>
                  </div>

                  <div className="mt-10">
                    <h4 className="text-lg font-medium mb-4 text-gray-200">Follow Me</h4>
                    <div className="flex space-x-4">
                      {["github", "twitter", "linkedin", "instagram"].map((social, index) => (
                        <motion.a
                          key={index}
                          href="#"
                          whileHover={{ y: -5, backgroundColor: "#7c3aed", color: "#ffffff" }}
                          className="w-12 h-12 rounded-full bg-gray-800/50 backdrop-blur-sm flex items-center justify-center text-gray-400 border border-gray-700/50 transition-colors"
                        >
                          <span className="sr-only">{social}</span>
                          <Github className="h-5 w-5" />
                        </motion.a>
                      ))}
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={contactInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.7, delay: 0.4 }}
                >
                  <form className="space-y-4 relative">
                    <div className="absolute -top-20 -right-20 w-40 h-40 border border-purple-500/30 rounded-full z-[-1]" />

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm text-gray-400">
                          Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          className="w-full px-4 py-3 rounded-lg bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 text-white focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all duration-300"
                          placeholder="Your Name"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm text-gray-400">
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          className="w-full px-4 py-3 rounded-lg bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 text-white focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all duration-300"
                          placeholder="Your Email"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="subject" className="text-sm text-gray-400">
                        Subject
                      </label>
                      <input
                        type="text"
                        id="subject"
                        className="w-full px-4 py-3 rounded-lg bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 text-white focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all duration-300"
                        placeholder="Subject"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm text-gray-400">
                        Message
                      </label>
                      <textarea
                        id="message"
                        rows={5}
                        className="w-full px-4 py-3 rounded-lg bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 text-white focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all duration-300 resize-none"
                        placeholder="Your Message"
                      />
                    </div>

                    <Button className="w-full bg-purple-600 hover:bg-purple-700 relative overflow-hidden group">
                      <span className="relative z-10">Send Message</span>
                      <span className="absolute inset-0 bg-purple-800 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    </Button>
                  </form>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 bg-gray-950 border-t border-gray-800/50 relative z-20">
          <div className="container mx-auto px-4 text-center">
            <p className="text-gray-400">© {new Date().getFullYear()} devfirexyz. All rights reserved.</p>
          
          </div>
        </footer>
      </div>
    </>
  )
}
