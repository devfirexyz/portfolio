"use client"

import { useRef, useEffect, type ReactNode } from "react"

interface HorizontalScrollProps {
  children: ReactNode
  className?: string
  scrollSpeed?: number
}

export default function HorizontalScroll({ children, className = "", scrollSpeed = 1.5 }: HorizontalScrollProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current
    if (!scrollContainer) return

    const handleWheel = (e: WheelEvent) => {
      if (scrollContainer) {
        e.preventDefault()
        scrollContainer.scrollLeft += e.deltaY * scrollSpeed
      }
    }

    scrollContainer.addEventListener("wheel", handleWheel, { passive: false })

    return () => {
      scrollContainer.removeEventListener("wheel", handleWheel)
    }
  }, [scrollSpeed])

  return (
    <div ref={scrollContainerRef} className={`${className}`}>
      {children}
    </div>
  )
}
