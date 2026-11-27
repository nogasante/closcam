"use client";

import { useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { useSyncExternalStore } from "react";
import { HeroPhone } from "./HeroPhone";

function useWide(): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const query = window.matchMedia("(min-width: 1024px)");
      query.addEventListener("change", onChange);
      return () => query.removeEventListener("change", onChange);
    },
    () => window.matchMedia("(min-width: 1024px)").matches,
    () => false,
  );
}

function useSaveData(): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const connection = (navigator as Navigator & { connection?: EventTarget }).connection;
      connection?.addEventListener("change", onChange);
      return () => connection?.removeEventListener("change", onChange);
    },
    () => Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData),
    () => false,
  );
}

export function HeroStage() {
  const wide = useWide();
  const reduce = useReducedMotion();
  const saveData = useSaveData();
  const quiet = Boolean(reduce || saveData);
  const [playing, setPlaying] = useState(false);
  const layer = useRef<HTMLDivElement>(null);

  function onMove(event: React.PointerEvent<HTMLDivElement>) {
    if (quiet || !layer.current) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 14;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 8;
    layer.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  }

  function onLeave() {
    if (layer.current) layer.current.style.transform = "translate3d(0, 0, 0)";
  }

  return (
    <div className="hero-slot">
      <div className="hero-drawn">
        <HeroPhone />
      </div>
      <div
        className="hero-stage relative w-full overflow-hidden"
        onPointerMove={onMove}
        onPointerLeave={onLeave}
      >
        <div ref={layer} className="hero-parallax absolute inset-0">
          <div className={quiet ? "absolute inset-0" : "hero-float absolute inset-0"}>
            {/* The poster is already a small webp, and it has to be in the first HTML. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/hero/phones-poster.webp"
              alt="Two phones on concrete steps. One shows a chat. The other shows an incoming call."
              className="hero-still absolute inset-0 h-full w-full object-cover"
              fetchPriority="high"
              decoding="async"
            />
            {wide && !quiet ? (
              <video
                className={`hero-film absolute inset-0 h-full w-full object-cover${playing ? " is-on" : ""}`}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                poster="/hero/phones-poster.webp"
                onPlaying={() => setPlaying(true)}
                aria-hidden="true"
              >
                <source src="/hero/phones.webm" type="video/webm" />
                <source src="/hero/phones.mp4" type="video/mp4" />
              </video>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
