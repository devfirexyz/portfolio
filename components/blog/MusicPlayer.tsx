"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { clearPauseTimeout, schedulePauseTimeout } from "@/lib/pause-timeout";

const TRACKS = [
  "/music/space-ambient-1.mp3",
  "/music/space-ambient-2.mp3",
  "/music/space-ambient-3.mp3",
];
const EXPANDED_STORAGE_KEY = "musicPlayerExpanded";
const VOLUME_STORAGE_KEY = "musicPlayerVolume";
const PLAYING_STORAGE_KEY = "musicPlayerPlaying";

export function MusicPlayer() {
  const pathname = usePathname();
  const isMusicPage = pathname === "/" || pathname.startsWith("/blog");

  const [isExpanded, setIsExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [shouldPlay, setShouldPlay] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [currentTrack, setCurrentTrack] = useState(0);

  const audioRef = useRef<HTMLAudioElement>(null);
  const volumeFadeRef = useRef<NodeJS.Timeout | null>(null);
  const pauseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasInteractedRef = useRef(false);

  const visualizerHeights = useMemo(
    () => [28, 42, 56, 38, 64, 48, 58, 44, 62, 50, 36, 46],
    []
  );

  const fadeVolume = useCallback((target: number, duration = 600) => {
    if (!audioRef.current) return;
    const audio = audioRef.current;
    const start = audio.volume;
    const delta = target - start;
    const steps = 20;
    const stepDuration = duration / steps;
    const stepValue = delta / steps;
    let step = 0;

    if (volumeFadeRef.current) clearInterval(volumeFadeRef.current);

    volumeFadeRef.current = setInterval(() => {
      step += 1;
      if (step >= steps) {
        audio.volume = target;
        if (volumeFadeRef.current) clearInterval(volumeFadeRef.current);
        return;
      }
      audio.volume = start + stepValue * step;
    }, stepDuration);
  }, []);

  const playAudio = useCallback(() => {
    if (!audioRef.current) return;
    clearPauseTimeout(pauseTimeoutRef);
    audioRef.current.volume = 0;
    const playPromise = audioRef.current.play();
    if (playPromise) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          fadeVolume(volume, 500);
        })
        .catch(() => {
          setIsPlaying(false);
        });
    }
  }, [fadeVolume, volume]);

  const pauseAudio = useCallback(() => {
    if (!audioRef.current || !isPlaying) return;
    clearPauseTimeout(pauseTimeoutRef);
    fadeVolume(0, 300);
    schedulePauseTimeout(pauseTimeoutRef, () => {
      if (!audioRef.current) return;
      audioRef.current.pause();
      setIsPlaying(false);
    }, 300);
  }, [fadeVolume, isPlaying]);

  useEffect(() => {
    const savedExpanded = localStorage.getItem(EXPANDED_STORAGE_KEY);
    const savedVolume = localStorage.getItem(VOLUME_STORAGE_KEY);
    const savedPlaying = localStorage.getItem(PLAYING_STORAGE_KEY);

    if (savedExpanded !== null) setIsExpanded(savedExpanded === "true");
    if (savedVolume !== null) setVolume(Number(savedVolume));
    if (savedPlaying !== null) {
      setShouldPlay(savedPlaying === "true");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(EXPANDED_STORAGE_KEY, String(isExpanded));
  }, [isExpanded]);

  useEffect(() => {
    localStorage.setItem(VOLUME_STORAGE_KEY, String(volume));
    if (audioRef.current && isPlaying) {
      fadeVolume(volume, 300);
    }
  }, [fadeVolume, isPlaying, volume]);

  useEffect(() => {
    localStorage.setItem(PLAYING_STORAGE_KEY, String(shouldPlay));
  }, [shouldPlay]);

  useEffect(() => {
    if (!isMusicPage && isPlaying) {
      pauseAudio();
    }
  }, [isMusicPage, isPlaying, pauseAudio]);

  useEffect(() => {
    if (!isPlaying || !audioRef.current) return;
    audioRef.current.load();
    playAudio();
  }, [currentTrack, isPlaying, playAudio]);

  useEffect(() => {
    const onInteract = () => {
      if (hasInteractedRef.current || !isMusicPage || !shouldPlay) return;
      hasInteractedRef.current = true;
      playAudio();
    };

    document.addEventListener("pointerup", onInteract, { once: true });
    document.addEventListener("keydown", onInteract, { once: true });

    return () => {
      document.removeEventListener("pointerup", onInteract);
      document.removeEventListener("keydown", onInteract);
    };
  }, [isMusicPage, playAudio, shouldPlay]);

  useEffect(() => {
    return () => {
      if (volumeFadeRef.current) clearInterval(volumeFadeRef.current);
      clearPauseTimeout(pauseTimeoutRef);
    };
  }, []);

  return (
    <>
      <audio
        ref={audioRef}
        src={TRACKS[currentTrack]}
        preload="none"
        playsInline
        onEnded={() => setCurrentTrack((prev) => (prev + 1) % TRACKS.length)}
      />

      <div className="fixed bottom-6 right-6 z-50">
        {!isExpanded ? (
          <button
            type="button"
            onClick={() => setIsExpanded(true)}
            className="relative h-14 w-14 border-2 border-[var(--nb-border)] bg-[var(--nb-accent)] shadow-[6px_6px_0px_0px_var(--nb-shadow-color)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--nb-accent)]"
            aria-label="Open music player"
          >
            <div className="flex h-full w-full items-center justify-center">
              <svg className="h-6 w-6 text-[var(--nb-foreground-inverse)]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
              </svg>
            </div>
          </button>
        ) : (
          <div className="w-[300px] overflow-hidden border-2 border-[var(--nb-border)] bg-[var(--nb-surface)] shadow-[10px_10px_0px_0px_var(--nb-shadow-color)]">
            <div className="flex items-center justify-between border-b-2 border-[var(--nb-border)] bg-[var(--nb-surface-alt)] p-4">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-[var(--nb-accent)]" />
                <span className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--nb-foreground)]">
                  Space Ambient
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="border-2 border-[var(--nb-border)] bg-[var(--nb-surface)] p-1.5 text-[var(--nb-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--nb-accent)]"
                aria-label="Minimize player"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            <div className="space-y-6 p-6">
              <div className="flex h-20 items-end justify-center gap-1">
                {visualizerHeights.map((height, index) => (
                  <div
                    key={index}
                    className="w-2 bg-gradient-to-t from-[var(--nb-accent)] to-[var(--nb-surface-strong)]"
                    style={{ height: isPlaying ? `${height}%` : "20%" }}
                  />
                ))}
              </div>

              <div className="text-center">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--nb-foreground-muted)]">
                  Track {currentTrack + 1} of {TRACKS.length}
                </p>
                <p className="mt-1 text-[11px] text-[var(--nb-foreground-subtle)]">Focus soundtrack</p>
              </div>

              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    if (isPlaying) {
                      setShouldPlay(false);
                      pauseAudio();
                      return;
                    }
                    setShouldPlay(true);
                    playAudio();
                  }}
                  className="flex h-14 w-14 items-center justify-center border-2 border-[var(--nb-border)] bg-[var(--nb-accent)] text-[var(--nb-foreground-inverse)] shadow-[4px_4px_0px_0px_var(--nb-shadow-color)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--nb-accent)]"
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? (
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                    </svg>
                  ) : (
                    <svg className="ml-1 h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </button>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--nb-foreground-muted)]">
                  <span>Volume</span>
                  <span>{Math.round(volume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={(event) => setVolume(Number(event.target.value))}
                  className="slider h-1 w-full cursor-pointer appearance-none rounded-lg bg-[var(--nb-surface-muted)]"
                  style={{
                    background: `linear-gradient(to right, var(--nb-accent) 0%, var(--nb-accent) ${
                      volume * 100
                    }%, var(--nb-surface-muted) ${volume * 100}%, var(--nb-surface-muted) 100%)`,
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 14px;
          height: 14px;
          background: var(--nb-accent);
          border: 2px solid var(--nb-border);
          border-radius: 0;
          cursor: pointer;
        }

        .slider::-moz-range-thumb {
          width: 14px;
          height: 14px;
          background: var(--nb-accent);
          border: 2px solid var(--nb-border);
          border-radius: 0;
          cursor: pointer;
        }
      `}</style>
    </>
  );
}
