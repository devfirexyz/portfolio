"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  autoPlay = false,
  autoPlayInterval = 5000,
  showDots = true,
  showArrows = true,
  className = "",
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const totalSlides = children.length;

  const goToSlide = useCallback(
    (index: number) => {
      if (totalSlides === 0) return;
      setCurrentIndex(index);
    },
    [totalSlides]
  );

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  useEffect(() => {
    if (!autoPlay || totalSlides <= 1) return;
    autoPlayRef.current = setInterval(goToNext, autoPlayInterval);

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [autoPlay, autoPlayInterval, goToNext, totalSlides]);

  const onDragStart = (clientX: number) => {
    setIsDragging(true);
    setStartX(clientX);
    setCurrentX(clientX);
  };

  const onDragMove = (clientX: number) => {
    if (!isDragging) return;
    setCurrentX(clientX);
  };

  const onDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const diff = startX - currentX;
    const threshold = 50;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) goToNext();
      if (diff < 0) goToPrevious();
    }
  };

  const handleMouseDown = (event: React.MouseEvent) => {
    event.preventDefault();
    onDragStart(event.clientX);
  };

  const handleTouchStart = (event: React.TouchEvent) => {
    onDragStart(event.touches[0].clientX);
  };

  const handleTouchMove = (event: React.TouchEvent) => {
    onDragMove(event.touches[0].clientX);
  };

  const ariaLabelByIndex = useMemo(
    () => children.map((_, index) => `Go to slide ${index + 1}`),
    [children]
  );

  return (
    <div className={`relative w-full overflow-x-hidden pt-20 sm:h-[900px] sm:pt-40 ${className}`}>
      <div
        className="relative"
        onMouseDown={handleMouseDown}
        onMouseMove={isDragging ? (event) => onDragMove(event.clientX) : undefined}
        onMouseUp={onDragEnd}
        onMouseLeave={onDragEnd}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={onDragEnd}
        style={{ cursor: isDragging ? "grabbing" : "grab" }}
      >
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {children.map((child, index) => (
            <div key={index} className="w-full flex-shrink-0" style={{ userSelect: "none" }}>
              {child}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:mt-10 sm:flex-row sm:gap-6">
        {showArrows && totalSlides > 1 && (
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={goToPrevious}
              className="rounded-full border border-purple-500/30 bg-gradient-to-r from-purple-600/20 to-blue-600/20 p-3 backdrop-blur-xl transition-transform duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 sm:p-4"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-4 w-4 text-white sm:h-5 sm:w-5" />
            </button>

            <button
              onClick={goToNext}
              className="rounded-full border border-blue-500/30 bg-gradient-to-r from-blue-600/20 to-purple-600/20 p-3 backdrop-blur-xl transition-transform duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 sm:p-4"
              aria-label="Next slide"
            >
              <ChevronRight className="h-4 w-4 text-white sm:h-5 sm:w-5" />
            </button>
          </div>
        )}

        {showDots && totalSlides > 1 && (
          <div className="flex items-center gap-2 sm:gap-3">
            {children.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`rounded-full ${
                  index === currentIndex
                    ? "h-2.5 w-8 bg-gradient-to-r from-purple-400 to-blue-400 sm:h-3 sm:w-10"
                    : "h-2.5 w-2.5 bg-white/30 sm:h-3 sm:w-3"
                } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80`}
                aria-label={ariaLabelByIndex[index]}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function ResponsiveCarousel({
  children,
  className = "",
  ...props
}: CarouselProps) {
  return (
    <div className={`w-full ${className}`}>
      <div className="block sm:hidden">
        <ModernCarousel {...props}>{children}</ModernCarousel>
      </div>
      <div className="hidden sm:block">
        <ModernCarousel {...props}>{children}</ModernCarousel>
      </div>
    </div>
  );
}
