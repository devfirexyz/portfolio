"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export function MusicPlayer() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showPulse, setShowPulse] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3); // Start at 30% volume
  const [currentTrack, setCurrentTrack] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const pathname = usePathname();

  // Memoized visualizer bar heights for performance
  const visualizerHeights = React.useMemo(
    () => Array.from({ length: 12 }, () => Math.random() * 80 + 20),
    []
  );

  // Enable music on homepage, blog home, and blog posts
  const isMusicPage = pathname === "/" || pathname?.startsWith("/blog");

  // Space ambient music tracks (add these files to /public/music/)
  const tracks = [
    "/music/space-ambient-1.mp3",
    "/music/space-ambient-2.mp3",
    "/music/space-ambient-3.mp3",
  ];

  // Smooth volume fade utility
  const fadeVolume = useCallback((targetVolume: number, duration: number = 1000) => {
    if (!audioRef.current) return;

    const audio = audioRef.current;
    const startVolume = audio.volume;
    const volumeDiff = targetVolume - startVolume;
    const steps = 50;
    const stepDuration = duration / steps;
    const stepSize = volumeDiff / steps;
    let currentStep = 0;

    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
    }

    fadeIntervalRef.current = setInterval(() => {
      currentStep++;
      if (currentStep >= steps) {
        audio.volume = targetVolume;
        if (fadeIntervalRef.current) {
          clearInterval(fadeIntervalRef.current);
        }
      } else {
        audio.volume = startVolume + stepSize * currentStep;
      }
    }, stepDuration);
  }, []);

  // Play audio with smooth fade in
  const playAudio = useCallback(() => {
    if (!audioRef.current) {
      console.log("🎵 No audio ref!");
      return;
    }

    try {
      console.log("🎵 Attempting to play audio...");
      audioRef.current.volume = 0;

      // Call play() synchronously without await to preserve user gesture
      const playPromise = audioRef.current.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log("🎵 Audio playing!");
            setIsPlaying(true);
            fadeVolume(volume, 600); // 0.6 second fade in (faster)
          })
          .catch((error) => {
            console.error("🎵 Autoplay prevented:", error);
          });
      }
    } catch (error) {
      console.error("🎵 Play error:", error);
    }
  }, [volume, fadeVolume]);

  // Pause audio with smooth fade out
  const pauseAudio = useCallback(() => {
    if (!audioRef.current || !isPlaying) return;

    fadeVolume(0, 400); // 0.4 second fade out (faster)
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }, 400);
  }, [isPlaying, fadeVolume]);

  // Handle track end - seamlessly move to next track
  const handleTrackEnd = () => {
    const nextTrack = (currentTrack + 1) % tracks.length;
    setCurrentTrack(nextTrack);
  };

  // Check if user has interacted with the page (required for autoplay)
  useEffect(() => {
    if (hasInteracted) return;

    const handleInteraction = (e: Event) => {
      console.log("🎵 User interaction detected!", e.type);

      if (!audioRef.current) {
        console.log("🎵 No audio ref available");
        return;
      }

      if (hasInteracted) {
        console.log("🎵 Already interacted, skipping");
        return;
      }

      // Mark as interacted immediately
      setHasInteracted(true);

      // Remove all listeners immediately to prevent duplicate calls
      document.removeEventListener("pointerup", handleInteraction);
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("keydown", handleInteraction);

      // Ensure audio element is loaded
      if (audioRef.current.readyState === 0) {
        console.log("🎵 Loading audio...");
        audioRef.current.load();
      }

      // Start playing DIRECTLY within the user gesture handler
      if (isMusicPage) {
        console.log("🎵 Starting music immediately after interaction!");
        console.log("🎵 Audio readyState:", audioRef.current.readyState);

        try {
          audioRef.current.volume = 0;

          // Call play() synchronously without await
          const playPromise = audioRef.current.play();

          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                console.log("🎵 Audio playing successfully!");
                setIsPlaying(true);
                fadeVolume(volume, 600);
              })
              .catch((error) => {
                console.error("🎵 Autoplay prevented:", error.name, error.message);
              });
          }
        } catch (error) {
          console.error("🎵 Play error:", error);
        }
      }
    };

    // Listen for VALID user interactions
    // pointerup is more reliable than touchend for mobile
    document.addEventListener("pointerup", handleInteraction, { once: true, passive: false });
    document.addEventListener("click", handleInteraction, { once: true });
    document.addEventListener("keydown", handleInteraction, { once: true });

    return () => {
      document.removeEventListener("pointerup", handleInteraction);
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("keydown", handleInteraction);
    };
  }, [isMusicPage, volume, fadeVolume, hasInteracted]);

  // Handle navigation away from music pages
  useEffect(() => {
    console.log("🎵 Navigation check:", { isMusicPage, isPlaying });

    if (!isMusicPage && isPlaying) {
      console.log("🎵 Pausing music (left music page)");
      pauseAudio();
    }
  }, [isMusicPage, isPlaying, pauseAudio]);

  // Handle track changes
  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.load();
      playAudio();
    }
  }, [currentTrack]);

  // Load state from localStorage
  useEffect(() => {
    const savedExpanded = localStorage.getItem("musicPlayerExpanded");
    const savedVolume = localStorage.getItem("musicPlayerVolume");

    if (savedExpanded !== null) {
      setIsExpanded(savedExpanded === "true");
    }
    if (savedVolume !== null) {
      setVolume(parseFloat(savedVolume));
    }
  }, []);

  // Save state to localStorage
  useEffect(() => {
    localStorage.setItem("musicPlayerExpanded", isExpanded.toString());
  }, [isExpanded]);

  useEffect(() => {
    localStorage.setItem("musicPlayerVolume", volume.toString());
    if (audioRef.current && isPlaying) {
      fadeVolume(volume, 500);
    }
  }, [volume]);

  // Hide pulsing animation after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPulse(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  // Toggle play/pause
  const togglePlayPause = () => {
    if (isPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  };

  return (
    <>
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={tracks[currentTrack]}
        onEnded={handleTrackEnd}
        preload="metadata"
        playsInline
        crossOrigin="anonymous"
      />

      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence mode="wait">
          {!isExpanded ? (
            // Minimized floating button
            <motion.button
              key="minimized"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              onClick={() => setIsExpanded(true)}
              className="group relative w-16 h-16 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 rounded-full shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-110"
            >
              {/* Pulsing ring animation */}
              {showPulse ? (
                <motion.span
                  className="absolute inset-0 rounded-full bg-purple-400 opacity-20"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0, 0.2] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", type: "tween" }}
                />
              ) : (
                <motion.span
                  className="absolute inset-0 rounded-full bg-purple-400/5"
                  animate={{ opacity: [0.05, 0.15, 0.05] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", type: "tween" }}
                />
              )}

              {/* Music note icon with playing animation */}
              <div className="relative flex items-center justify-center w-full h-full">
                <motion.svg
                  className="w-7 h-7 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
                  transition={{
                    duration: 3,
                    repeat: isPlaying ? Infinity : 0,
                    ease: "linear"
                  }}
                >
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                </motion.svg>
              </div>

              {/* Tooltip */}
              <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap shadow-xl">
                  {!hasInteracted && isMusicPage ? "👆 Click to start music" : "🌌 Space Ambient"}
                  <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                </div>
              </div>
            </motion.button>
          ) : (
            // Expanded player
            <motion.div
              key="expanded"
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ duration: 0.4, type: "spring", bounce: 0.3 }}
              className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-purple-500/20 overflow-hidden"
              style={{ width: "280px" }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-purple-500/20">
                <div className="flex items-center gap-2">
                  <motion.div
                    className="w-2 h-2 bg-purple-500 rounded-full"
                    animate={{ opacity: isPlaying ? [0.5, 1, 0.5] : 0.3 }}
                    transition={{ duration: 2, repeat: isPlaying ? Infinity : 0, ease: "easeInOut" }}
                  />
                  <span className="text-white font-medium text-sm">🌌 Space Ambient</span>
                </div>

                {/* Minimize button */}
                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors group"
                  title="Minimize"
                >
                  <svg
                    className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>

              {/* Player Controls */}
              <div className="p-6 space-y-6">
                {/* Visualizer bars */}
                <div className="flex items-end justify-center gap-1 h-20">
                  {visualizerHeights.map((height, i) => (
                    <motion.div
                      key={i}
                      className="w-2 bg-gradient-to-t from-purple-600 to-blue-500 rounded-full"
                      animate={
                        isPlaying
                          ? {
                              height: ["20%", `${height}%`, "20%"],
                            }
                          : { height: "20%" }
                      }
                      transition={{
                        duration: 0.8 + (height / 100) * 0.4,
                        repeat: isPlaying ? Infinity : 0,
                        ease: "easeInOut",
                        delay: i * 0.1,
                        type: "tween"
                      }}
                    />
                  ))}
                </div>

                {/* Track info */}
                <div className="text-center">
                  <p className="text-sm text-gray-400">
                    Track {currentTrack + 1} of {tracks.length}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Deep space ambient music
                  </p>
                </div>

                {/* Play/Pause button */}
                <div className="flex justify-center">
                  <motion.button
                    onClick={togglePlayPause}
                    className="w-14 h-14 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center hover:shadow-lg hover:shadow-purple-500/50 transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isPlaying ? (
                      <svg
                        className="w-6 h-6 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                      </svg>
                    ) : (
                      <svg
                        className="w-6 h-6 text-white ml-1"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    )}
                  </motion.button>
                </div>

                {/* Volume control */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>Volume</span>
                    <span>{Math.round(volume * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, rgb(147, 51, 234) 0%, rgb(147, 51, 234) ${
                        volume * 100
                      }%, rgb(55, 65, 81) ${volume * 100}%, rgb(55, 65, 81) 100%)`,
                    }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          background: linear-gradient(135deg, #a855f7, #3b82f6);
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(168, 85, 247, 0.4);
        }

        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          background: linear-gradient(135deg, #a855f7, #3b82f6);
          border-radius: 50%;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 8px rgba(168, 85, 247, 0.4);
        }
      `}</style>
    </>
  );
}
