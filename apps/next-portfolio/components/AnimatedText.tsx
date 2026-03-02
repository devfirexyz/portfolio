"use client";

import React from "react";

interface AnimatedTextProps {
  text: string;
  className?: string;
  animationType?: "reveal" | "clip" | "flip" | "bounce" | "slide";
  staggerDelay?: number;
  startDelay?: number;
  style?: React.CSSProperties;
  enableGlow?: boolean;
}

export function AnimatedText({
  text,
  className = "",
  animationType = "reveal",
  staggerDelay = 50,
  startDelay = 0,
  style = {},
  enableGlow = false,
}: AnimatedTextProps) {
  const characters = text.split("");

  return (
    <span className={className} style={style}>
      {characters.map((char, index) => {
        const delay = startDelay + index * staggerDelay;

        if (char === " ") {
          return (
            <span key={index} className="inline-block w-[0.3em]">
              &nbsp;
            </span>
          );
        }

        return (
          <span
            key={index}
            className={`char char-clip ${
              animationType === "reveal" ? "animate-char-reveal" :
              animationType === "clip" ? "animate-char-clip" :
              animationType === "flip" ? "animate-char-flip" :
              animationType === "bounce" ? "animate-char-bounce" :
              animationType === "slide" ? "animate-char-slide" :
              "animate-char-reveal"
            } ${enableGlow ? "animate-char-glow" : ""}`}
            style={{
              animationDelay: `${delay}ms`,
              animationFillMode: 'both',
            }}
          >
            <span className="char-inner">
              {char}
            </span>
          </span>
        );
      })}
    </span>
  );
}