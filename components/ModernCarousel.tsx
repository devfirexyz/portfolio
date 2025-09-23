"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarouselProps {
  children: React.ReactNode[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showDots?: boolean;
  showArrows?: boolean;
  className?: string;
}

export function ModernCarousel({
  children,
  autoPlay = true,
  autoPlayInterval = 5000,
  showDots = true,
  showArrows = true,
  className = "",
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<NodeJS.Timeout>(null);

  const totalSlides = children.length;

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying && totalSlides > 1) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % totalSlides);
      }, autoPlayInterval);

      return () => {
        if (autoPlayRef.current) {
          clearInterval(autoPlayRef.current);
        }
      };
    }
  }, [isAutoPlaying, totalSlides, autoPlayInterval]);

  // Navigation functions
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(autoPlay), 3000);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(autoPlay), 3000);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(autoPlay), 3000);
  };

  // Touch/Mouse drag handlers
  const handleStart = (clientX: number) => {
    setIsDragging(true);
    setStartX(clientX);
    setCurrentX(clientX);
    setIsAutoPlaying(false);
  };

  const handleMove = (clientX: number) => {
    if (!isDragging) return;
    setCurrentX(clientX);
  };

  const handleEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const diff = startX - currentX;
    const threshold = 50;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        goToNext();
      } else {
        goToPrevious();
      }
    }

    setTimeout(() => setIsAutoPlaying(autoPlay), 3000);
  };

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleStart(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleMove(e.clientX);
  };

  const handleMouseUp = () => {
    handleEnd();
  };

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    handleStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    handleEnd();
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        goToPrevious();
      } else if (e.key === "ArrowRight") {
        goToNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className={`relative w-full overflow-x-hidden sm:h-[900px] ${className} pt-20 sm:pt-40`}>
      {/* Main Carousel Container */}
      <div
        ref={carouselRef}
        className="relative"
        onMouseDown={handleMouseDown}
        onMouseMove={isDragging ? handleMouseMove : undefined}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ cursor: isDragging ? "grabbing" : "grab" }}
      >
        {/* Slides Container */}
        <div
          className="flex transition-transform duration-700 ease-out"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
            willChange: "transform",
          }}
        >
          {children.map((child, index) => (
            <div
              key={index}
              className="w-full flex-shrink-0"
              style={{ userSelect: "none" }}
            >
              {child}
            </div>
          ))}
        </div>

      </div>

      {/* Bottom Controls Container */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mt-8 sm:mt-10">
        {/* Navigation Arrows */}
        {showArrows && totalSlides > 1 && (
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={goToPrevious}
              className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-xl hover:from-purple-500/30 hover:to-blue-500/30 border border-purple-500/30 rounded-full p-3 sm:p-4 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-purple-500/25 group"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-white group-hover:text-purple-300 transition-colors" />
            </button>

            <button
              onClick={goToNext}
              className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-xl hover:from-blue-500/30 hover:to-purple-500/30 border border-blue-500/30 rounded-full p-3 sm:p-4 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/25 group"
              aria-label="Next slide"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-white group-hover:text-blue-300 transition-colors" />
            </button>
          </div>
        )}

        {/* Dots Indicator */}
        {showDots && totalSlides > 1 && (
          <div className="flex items-center gap-2 sm:gap-3">
            {children.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`relative transition-all duration-500 rounded-full ${
                  index === currentIndex
                    ? "w-8 sm:w-10 h-2.5 sm:h-3 bg-gradient-to-r from-purple-400 to-blue-400"
                    : "w-2.5 sm:w-3 h-2.5 sm:h-3 bg-white/30 hover:bg-white/50 hover:scale-125"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              >
                {/* Active indicator glow */}
                {index === currentIndex && (
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full blur-md animate-pulse opacity-60" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes progressBar {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0%);
          }
        }
      `}</style>
    </div>
  );
}

// Responsive carousel wrapper
export function ResponsiveCarousel({
  children,
  className = "",
  ...props
}: CarouselProps) {
  return (
    <div className={`w-full ${className}`}>
      {/* Mobile: Single column */}
      <div className="block sm:hidden">
        <ModernCarousel {...props}>
          {children}
        </ModernCarousel>
      </div>

      {/* Tablet and Desktop: Show carousel */}
      <div className="hidden sm:block">
        <ModernCarousel {...props}>
          {children}
        </ModernCarousel>
      </div>
    </div>
  );
}