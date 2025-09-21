"use client"

import { useState, useRef, useEffect } from "react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import {
  Download, Github, Linkedin, Mail, Menu, X, Lock, Unlock,
  ChevronRight, ExternalLink, Code2, Briefcase, GraduationCap,
  Users, Sparkles, Zap, Trophy, Target, ArrowRight, Copy, Check
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
    <div className="min-h-screen bg-gradient-to-b from-[#2C2F33] to-[#23272A]">
      {/* Navigation - Discord Style */}
      <nav className="fixed top-0 z-50 w-full bg-[#23272A]/95 backdrop-blur-md border-b border-black/20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#5865F2] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <span className="text-white font-semibold text-lg hidden sm:block">Piyush Raj</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#about" className="text-gray-300 hover:text-white transition-colors">
                About
              </Link>
              <Link href="#experience" className="text-gray-300 hover:text-white transition-colors">
                Experience
              </Link>
              <Link href="#projects" className="text-gray-300 hover:text-white transition-colors">
                Projects
              </Link>
              <Link href="#skills" className="text-gray-300 hover:text-white transition-colors">
                Skills
              </Link>
              <Button
                className="bg-[#5865F2] hover:bg-[#4752C4] text-white discord-button"
                onClick={() => setResumeUnlocked(true)}
              >
                <Lock className="w-4 h-4 mr-2" />
                Unlock Resume
              </Button>
            </div>

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
                  className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white"
                  onClick={() => setResumeUnlocked(true)}
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Unlock Resume
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section - Discord Style */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#5865F2]/20 rounded-full blur-3xl animate-discord-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#9A59B6]/20 rounded-full blur-3xl animate-discord-float" style={{ animationDelay: "3s" }} />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            {/* Main Heading */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-6"
            >
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-4 leading-tight">
                ENGINEERING{" "}
                <span className="text-gradient">SOLUTIONS</span>
                <br />
                THAT SCALE
              </h1>
            </motion.div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
            >
              {resumeData.personal.tagline}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Button
                size="lg"
                className="bg-[#5865F2] hover:bg-[#4752C4] text-white px-8 py-6 text-lg discord-button group"
                onClick={() => setResumeUnlocked(true)}
              >
                <Unlock className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                View My Resume
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-gray-600 text-white hover:bg-white/10 px-8 py-6 text-lg"
                asChild
              >
                <Link href="#contact">
                  Let's Connect
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
            >
              {[
                { label: "Years Experience", value: "4+" },
                { label: "Projects Delivered", value: "15+" },
                { label: "Users Impacted", value: "2M+" },
                { label: "Team Members Led", value: "5+" },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-[#5865F2]">{stat.value}</div>
                  <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
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

      {/* About Section */}
      <section id="about" className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
              About <span className="text-[#5865F2]">Me</span>
            </h2>

            <Card className="bg-[#2C2F33]/50 border-gray-700 backdrop-blur-sm discord-card">
              <CardContent className="p-8">
                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                  {resumeData.personal.about}
                </p>

                <div className="grid md:grid-cols-2 gap-6 mt-8">
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-[#5865F2]">Current Role</h3>
                    <div className="space-y-2">
                      <p className="text-white font-medium">{resumeData.personal.title}</p>
                      <p className="text-gray-400">{resumeData.personal.company}</p>
                      <p className="text-gray-500 text-sm">{resumeData.personal.location}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-[#5865F2]">Contact</h3>
                    <div className="space-y-3">
                      <button
                        onClick={copyEmail}
                        className="flex items-center gap-2 text-gray-300 hover:text-[#5865F2] transition-colors group"
                      >
                        <Mail className="w-4 h-4" />
                        <span>{resumeData.personal.email}</span>
                        {copiedEmail ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                      </button>
                      <Link
                        href={resumeData.personal.github}
                        target="_blank"
                        className="flex items-center gap-2 text-gray-300 hover:text-[#5865F2] transition-colors"
                      >
                        <Github className="w-4 h-4" />
                        <span>GitHub</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                      <Link
                        href={resumeData.personal.linkedin}
                        target="_blank"
                        className="flex items-center gap-2 text-gray-300 hover:text-[#5865F2] transition-colors"
                      >
                        <Linkedin className="w-4 h-4" />
                        <span>LinkedIn</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Experience Timeline */}
      <section id="experience" className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">
              Work <span className="text-[#5865F2]">Experience</span>
            </h2>

            <div className="space-y-8">
              {resumeData.experience.map((exp, index) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="bg-[#2C2F33]/50 border-gray-700 backdrop-blur-sm discord-card hover:bg-[#2C2F33]/70 transition-all">
                    <CardHeader>
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                          <CardTitle className="text-xl text-white">{exp.role}</CardTitle>
                          <CardDescription className="text-[#5865F2] mt-1">
                            {exp.company} • {exp.location}
                          </CardDescription>
                        </div>
                        <Badge
                          variant={exp.current ? "default" : "secondary"}
                          className={exp.current ? "bg-[#3BA55D] text-white" : ""}
                        >
                          {exp.period}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {exp.highlights.map((highlight, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-gray-300">
                            <ChevronRight className="w-4 h-4 text-[#5865F2] mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">
              Featured <span className="text-[#5865F2]">Projects</span>
            </h2>

            <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
              {resumeData.projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="bg-[#2C2F33]/50 border-gray-700 backdrop-blur-sm h-full discord-card hover:bg-[#2C2F33]/70 transition-all">
                    <CardHeader>
                      <CardTitle className="text-xl text-white">{project.title}</CardTitle>
                      <CardDescription className="text-gray-300">
                        {project.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech) => (
                          <Badge key={tech} variant="secondary" className="bg-[#5865F2]/20 text-[#5865F2] border-[#5865F2]/30">
                            {tech}
                          </Badge>
                        ))}
                      </div>

                      <div className="pt-4 border-t border-gray-700">
                        <p className="text-sm text-[#3BA55D] font-medium mb-3">Impact:</p>
                        <p className="text-gray-300">{project.impact}</p>

                        {project.metrics && (
                          <div className="grid grid-cols-3 gap-2 mt-4">
                            {Object.entries(project.metrics).slice(0, 3).map(([key, value]) => (
                              <div key={key} className="text-center p-2 bg-[#23272A]/50 rounded">
                                <div className="text-[#5865F2] font-semibold">{value}</div>
                                <div className="text-xs text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">
              Technical <span className="text-[#5865F2]">Skills</span>
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(resumeData.skills).map(([category, skills], index) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="bg-[#2C2F33]/50 border-gray-700 backdrop-blur-sm h-full discord-card">
                    <CardHeader>
                      <CardTitle className="text-lg text-[#5865F2] capitalize">
                        {category === 'ai' ? 'AI & ML' : category}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {skills.map((skill: string) => (
                          <Badge
                            key={skill}
                            variant="secondary"
                            className="bg-[#23272A] text-gray-300 border-gray-600"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Resume Unlock Modal */}
      <AnimatePresence>
        {resumeUnlocked && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setResumeUnlocked(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#2C2F33] rounded-xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-white">Resume Unlocked!</h3>
                <button
                  onClick={() => setResumeUnlocked(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="bg-[#23272A] rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-[#5865F2] mb-4">Quick Summary</h4>
                  <div className="space-y-3 text-gray-300">
                    <p><strong>Current Role:</strong> {resumeData.personal.title} at {resumeData.personal.company}</p>
                    <p><strong>Experience:</strong> 4+ years in Full-Stack Development</p>
                    <p><strong>Specialization:</strong> Scalable Web Applications, AI Integration, Frontend Architecture</p>
                    <p><strong>Education:</strong> {resumeData.education.degree}</p>
                  </div>
                </div>

                <div className="bg-[#23272A] rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-[#5865F2] mb-4">Key Achievements</h4>
                  <ul className="space-y-2">
                    {resumeData.achievements.map((achievement, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-gray-300">
                        <Trophy className="w-4 h-4 text-[#FEE75C] mt-0.5 flex-shrink-0" />
                        <span>{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-4">
                  <Button
                    className="flex-1 bg-[#5865F2] hover:bg-[#4752C4] text-white"
                    asChild
                  >
                    <a href="/resume.pdf" download>
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 border-gray-600 text-white hover:bg-white/10"
                    onClick={copyEmail}
                  >
                    {copiedEmail ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Mail className="w-4 h-4 mr-2" />
                        Contact Me
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contact Section */}
      <section id="contact" className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
              Let's <span className="text-[#5865F2]">Connect</span>
            </h2>

            <p className="text-gray-300 mb-8">
              I'm always open to discussing new opportunities, interesting projects, or just having a chat about technology.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-[#5865F2] hover:bg-[#4752C4] text-white discord-button"
                onClick={copyEmail}
              >
                {copiedEmail ? (
                  <>
                    <Check className="w-5 h-5 mr-2" />
                    Email Copied!
                  </>
                ) : (
                  <>
                    <Mail className="w-5 h-5 mr-2" />
                    Copy Email
                  </>
                )}
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="border-gray-600 text-white hover:bg-white/10"
                asChild
              >
                <Link href={resumeData.personal.linkedin} target="_blank">
                  <Linkedin className="w-5 h-5 mr-2" />
                  LinkedIn
                </Link>
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="border-gray-600 text-white hover:bg-white/10"
                asChild
              >
                <Link href={resumeData.personal.github} target="_blank">
                  <Github className="w-5 h-5 mr-2" />
                  GitHub
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-800">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} Piyush Raj. Built with Next.js & Tailwind CSS.
          </p>
        </div>
      </footer>
    </div>
  )
}