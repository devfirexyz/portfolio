"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const Lottie = dynamic(() => import("lottie-react"), {
  ssr: false,
  loading: () => null,
});

function LottieFallback() {
  return (
    <div className="relative h-[260px] w-full overflow-hidden rounded-md bg-[linear-gradient(180deg,#111e33_0%,#0b1423_100%)] sm:h-[320px]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.22),transparent_38%),radial-gradient(circle_at_80%_70%,rgba(45,212,191,0.22),transparent_42%)]" />
      <div className="absolute left-6 right-6 top-10 h-24 rounded-lg border border-cyan-300/30 bg-black/25" />
      <div className="absolute left-8 top-[172px] h-3 w-[72%] rounded-full bg-cyan-200/30" />
      <div className="absolute left-8 top-[192px] h-3 w-[56%] rounded-full bg-emerald-200/30" />
      <div className="absolute bottom-6 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-cyan-300/50 to-transparent" />
    </div>
  );
}

export function LazyFooterLottie() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isActivated, setIsActivated] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [animationData, setAnimationData] = useState<object | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setPrefersReducedMotion(media.matches);
    onChange();
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const activate = () => setIsActivated(true);

    window.addEventListener("pointerdown", activate, { once: true, passive: true });
    window.addEventListener("keydown", activate, { once: true });
    window.addEventListener("touchstart", activate, { once: true, passive: true });
    window.addEventListener("wheel", activate, { once: true, passive: true });

    return () => {
      window.removeEventListener("pointerdown", activate);
      window.removeEventListener("keydown", activate);
      window.removeEventListener("touchstart", activate);
      window.removeEventListener("wheel", activate);
    };
  }, []);

  useEffect(() => {
    if (!isActivated) {
      return;
    }

    const node = containerRef.current;
    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        const visible = Boolean(entry?.isIntersecting);
        setIsInView(visible);
        if (visible) {
          setShouldLoad(true);
        }
      },
      {
        root: null,
        rootMargin: "220px 0px",
        threshold: 0.1,
      }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [isActivated]);

  useEffect(() => {
    if (!shouldLoad || animationData) {
      return;
    }

    let cancelled = false;
    fetch("/lottie/my-character.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load Lottie animation.");
        }
        return response.json();
      })
      .then((data: object) => {
        if (!cancelled) {
          setAnimationData(data);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setAnimationData(null);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [animationData, shouldLoad]);

  const canRenderLottie = shouldLoad && isInView && animationData;

  return (
    <div ref={containerRef} className="relative">
      {canRenderLottie ? (
        <div className="relative h-[260px] w-full overflow-hidden rounded-md bg-[linear-gradient(180deg,#111e33_0%,#0b1423_100%)] sm:h-[320px]">
          <Lottie
            animationData={animationData}
            loop={!prefersReducedMotion}
            autoplay={!prefersReducedMotion}
            className="h-full w-full"
            rendererSettings={{ preserveAspectRatio: "xMidYMid meet" }}
          />
        </div>
      ) : (
        <LottieFallback />
      )}
    </div>
  );
}
