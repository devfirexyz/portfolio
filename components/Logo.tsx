"use client";

import React from "react";

interface LogoProps {
  variant?: "full" | "initials" | "symbol" | "minimal";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  animated?: boolean;
}

export function Logo({
  variant = "full",
  size = "md",
  className = "",
  animated = false
}: LogoProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-24 h-24"
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
    xl: "text-4xl"
  };

  if (variant === "full") {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <span
          className={`font-bold text-white ${textSizes[size]} tracking-tight ${animated ? 'hover:text-blue-400 transition-colors duration-300' : ''}`}
          style={{ fontFamily: "Alan Sans" }}
        >
          Piyush Raj
        </span>
      </div>
    );
  }

  if (variant === "initials") {
    return (
      <div className={`${sizeClasses[size]} bg-gradient-to-br from-[#5865F2] to-[#8B5CF6] rounded-xl flex items-center justify-center text-white font-black ${textSizes[size]} ${className} ${animated ? 'hover:scale-110 transition-transform duration-300' : ''}`}>
        PR
      </div>
    );
  }

  if (variant === "minimal") {
    return (
      <div className={`${sizeClasses[size]} ${className}`}>
        <MinimalLogo size={size} animated={animated} />
      </div>
    );
  }

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <LogoSymbol size={size} animated={animated} />
    </div>
  );
}

// Main geometric logo symbol
function LogoSymbol({ size, animated }: { size: string; animated: boolean }) {
  const strokeWidth = size === "sm" ? "2" : size === "md" ? "2.5" : "3";

  return (
    <svg
      viewBox="0 0 48 48"
      className={`w-full h-full ${animated ? 'hover:rotate-12 transition-transform duration-500' : ''}`}
      fill="none"
    >
      {/* Modern geometric P and R combined */}
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5865F2" />
          <stop offset="50%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#EB459E" />
        </linearGradient>
      </defs>

      {/* P shape - left side */}
      <path
        d="M8 8 L8 40 M8 8 L28 8 Q32 8 32 12 L32 20 Q32 24 28 24 L8 24"
        stroke="url(#logoGradient)"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={animated ? 'animate-pulse' : ''}
      />

      {/* R shape - right side with modern twist */}
      <path
        d="M20 24 L32 40"
        stroke="url(#logoGradient)"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Accent dot */}
      <circle
        cx="36"
        cy="12"
        r="3"
        fill="url(#logoGradient)"
        className={animated ? 'animate-ping' : ''}
      />
    </svg>
  );
}

// Ultra minimal version
function MinimalLogo({ size, animated }: { size: string; animated: boolean }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={`w-full h-full ${animated ? 'hover:scale-110 transition-transform duration-300' : ''}`}
      fill="none"
    >
      <defs>
        <linearGradient id="minimalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5865F2" />
          <stop offset="100%" stopColor="#EB459E" />
        </linearGradient>
      </defs>

      {/* Simple geometric shapes representing P and R */}
      <rect x="4" y="4" width="8" height="24" rx="2" fill="url(#minimalGradient)" />
      <rect x="12" y="4" width="12" height="6" rx="3" fill="url(#minimalGradient)" />
      <rect x="12" y="14" width="8" height="6" rx="3" fill="url(#minimalGradient)" />
      <rect x="20" y="20" width="8" height="8" rx="2" fill="url(#minimalGradient)" />
    </svg>
  );
}

// Alternative circular logo
export function CircularLogo({ size = "md", animated = false }: { size?: string; animated?: boolean }) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-24 h-24"
  };

  return (
    <div className={`${sizeClasses[size]} bg-gradient-to-br from-[#5865F2] via-[#8B5CF6] to-[#EB459E] rounded-full flex items-center justify-center shadow-lg ${animated ? 'hover:scale-110 hover:rotate-6 transition-all duration-300' : ''}`}>
      <svg viewBox="0 0 24 24" className="w-3/5 h-3/5" fill="white">
        <path d="M3 3h8c1.1 0 2 .9 2 2v4c0 1.1-.9 2-2 2H5v6H3V3zm2 2v4h6V5H5zm8 8l4 6h-2.5l-3-4.5h-.5V17h-2v-2h2z"/>
      </svg>
    </div>
  );
}

// Favicon-optimized version (16x16, 32x32 friendly)
export function FaviconLogo() {
  return (
    <svg viewBox="0 0 32 32" className="w-full h-full">
      <defs>
        <linearGradient id="faviconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5865F2" />
          <stop offset="100%" stopColor="#EB459E" />
        </linearGradient>
      </defs>

      {/* High contrast, simple design for small sizes */}
      <rect width="32" height="32" rx="6" fill="url(#faviconGradient)" />
      <text
        x="16"
        y="22"
        textAnchor="middle"
        fill="white"
        fontSize="18"
        fontWeight="900"
        fontFamily="Alan Sans, sans-serif"
      >
        P
      </text>
      <circle cx="24" cy="8" r="2" fill="white" opacity="0.9" />
    </svg>
  );
}