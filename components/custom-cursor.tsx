"use client"

import { motion, useSpring } from "framer-motion"
import { useEffect, useState } from "react"

interface CustomCursorProps {
  mousePosition: { x: number; y: number }
}

export default function CustomCursor({ mousePosition }: CustomCursorProps) {
  const [cursorVariant, setCursorVariant] = useState("default")

  // Use springs for smooth interpolation
  const springConfig = { damping: 25, stiffness: 300 }
  const cursorX = useSpring(mousePosition.x, springConfig)
  const cursorY = useSpring(mousePosition.y, springConfig)

  // Update spring values when mouse position changes
  useEffect(() => {
    cursorX.set(mousePosition.x)
    cursorY.set(mousePosition.y)
  }, [mousePosition.x, mousePosition.y, cursorX, cursorY])

  useEffect(() => {
    const handleMouseDown = () => setCursorVariant("click")
    const handleMouseUp = () => setCursorVariant("default")

    window.addEventListener("mousedown", handleMouseDown)
    window.addEventListener("mouseup", handleMouseUp)

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === "A" || target.tagName === "BUTTON" || target.closest("a") || target.closest("button")) {
        setCursorVariant("hover")
      } else {
        setCursorVariant("default")
      }
    }

    document.addEventListener("mouseover", handleMouseOver)

    return () => {
      window.removeEventListener("mousedown", handleMouseDown)
      window.removeEventListener("mouseup", handleMouseUp)
      document.removeEventListener("mouseover", handleMouseOver)
    }
  }, [])

  const variants = {
    default: {
      height: 32,
      width: 32,
      backgroundColor: "rgba(139, 92, 246, 0)",
      border: "1.5px solid rgba(139, 92, 246, 0.4)",
      boxShadow: "0 0 10px rgba(139, 92, 246, 0.2)",
      mixBlendMode: "difference" as const,
    },
    hover: {
      height: 48,
      width: 48,
      backgroundColor: "rgba(139, 92, 246, 0.1)",
      border: "1.5px solid rgba(139, 92, 246, 0.8)",
      boxShadow: "0 0 15px rgba(139, 92, 246, 0.3)",
    },
    click: {
      height: 36,
      width: 36,
      backgroundColor: "rgba(139, 92, 246, 0.2)",
      border: "1.5px solid rgba(139, 92, 246, 1)",
      boxShadow: "0 0 20px rgba(139, 92, 246, 0.4)",
    },
  }

  // Create a dot cursor in the center
  const dotVariants = {
    default: {
      height: 4,
      width: 4,
      backgroundColor: "rgba(139, 92, 246, 0.8)",
      opacity: 1,
    },
    hover: {
      height: 6,
      width: 6,
      backgroundColor: "rgba(139, 92, 246, 1)",
      opacity: 1,
    },
    click: {
      height: 8,
      width: 8,
      backgroundColor: "rgba(139, 92, 246, 1)",
      opacity: 1,
    },
  }

  return (
    <>
      {/* Main cursor ring */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-50 hidden md:block backdrop-blur-sm"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        variants={variants}
        animate={cursorVariant}
        transition={{
          type: "spring",
          damping: 25,
          stiffness: 300,
        }}
      />

      {/* Center dot */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-50 hidden md:block"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        variants={dotVariants}
        animate={cursorVariant}
        transition={{
          type: "spring",
          damping: 25,
          stiffness: 300,
        }}
      />
    </>
  )
}
