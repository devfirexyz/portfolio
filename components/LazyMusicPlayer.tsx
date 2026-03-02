"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useCurrentPathname } from "@/lib/use-current-pathname";

const MusicPlayer = dynamic(
  () => import("@/components/blog/MusicPlayer").then((mod) => mod.MusicPlayer),
  { ssr: false }
);

export function LazyMusicPlayer() {
  const pathname = useCurrentPathname();
  const isMusicRoute = pathname === "/" || pathname.startsWith("/blog");
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (!isMusicRoute) {
      setShouldLoad(false);
      return;
    }

    const loadPlayer = () => setShouldLoad(true);

    try {
      const hasSavedState =
        localStorage.getItem("musicPlayerPlaying") === "true" ||
        localStorage.getItem("musicPlayerExpanded") === "true";
      if (hasSavedState) {
        loadPlayer();
        return;
      }
    } catch {
      // Ignore storage failures.
    }

    window.addEventListener("pointerdown", loadPlayer, { once: true, passive: true });
    window.addEventListener("keydown", loadPlayer, { once: true });
    window.addEventListener("touchstart", loadPlayer, { once: true, passive: true });
    window.addEventListener("wheel", loadPlayer, { once: true, passive: true });

    return () => {
      window.removeEventListener("pointerdown", loadPlayer);
      window.removeEventListener("keydown", loadPlayer);
      window.removeEventListener("touchstart", loadPlayer);
      window.removeEventListener("wheel", loadPlayer);
    };
  }, [isMusicRoute]);

  if (!isMusicRoute || !shouldLoad) {
    return null;
  }

  return <MusicPlayer />;
}
