"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"

interface TextRevealProps {
  text: string
  className?: string
  highlightColor?: string
}

export default function TextReveal({ text, className, highlightColor = "text-purple-500" }: TextRevealProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })

  const words = text.split(" ")

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.04 * i },
    }),
  }

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={container}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {words.map((word, index) => (
        <motion.span key={index} variants={child} className="inline-block mr-2">
          {word.includes("John") || word.includes("Doe") ? <span className={highlightColor}>{word}</span> : word}
        </motion.span>
      ))}
    </motion.div>
  )
}
