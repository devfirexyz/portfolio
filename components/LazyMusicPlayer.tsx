"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const MusicPlayer = dynamic(
  () => import("@/components/blog/MusicPlayer").then((mod) => mod.MusicPlayer),
  { ssr: false }
);

export function LazyMusicPlayer() {
  const pathname = usePathname();
  const isMusicRoute = pathname === "/" || pathname.startsWith("/blog");
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (!isMusicRoute) {
      setShouldLoad(false);
      return;
    }

    const loadPlayer = () => setShouldLoad(true);
    const timer = window.setTimeout(loadPlayer, 1400);

    window.addEventListener("pointerdown", loadPlayer, { once: true, passive: true });
    window.addEventListener("keydown", loadPlayer, { once: true });

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("pointerdown", loadPlayer);
      window.removeEventListener("keydown", loadPlayer);
    };
  }, [isMusicRoute]);

  if (!isMusicRoute || !shouldLoad) {
    return null;
  }

  return <MusicPlayer />;
}
