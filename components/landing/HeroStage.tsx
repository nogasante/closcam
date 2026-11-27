"use client";

import Image from "next/image";
import { useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { useSyncExternalStore } from "react";
import poster from "@/public/hero/phones-poster.webp";
import { HeroPhone } from "./HeroPhone";

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
  const reduce = useReducedMotion();
  const saveData = useSaveData();
  const quiet = reduce || saveData;
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
    <>
      <div className="lg:hidden">
        <HeroPhone />
      </div>
      <div
        className="hero-stage relative hidden w-full overflow-hidden bg-[#2D2E32] lg:block"
        onPointerMove={onMove}
        onPointerLeave={onLeave}
      >
        <div ref={layer} className="hero-parallax absolute inset-0">
          <div className={quiet ? "absolute inset-0" : "hero-float absolute inset-0"}>
            <Image
              src={poster}
              alt="Two phones on concrete steps. One shows a chat. The other shows an incoming call."
              fill
              priority
              placeholder="blur"
              sizes="(max-width: 1023px) 32px, 640px"
              className="hero-still object-cover"
            />
            {quiet ? null : (
              <video
                className="hero-film absolute inset-0 h-full w-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                poster="/hero/phones-poster.webp"
                aria-hidden="true"
              >
                <source src="/hero/phones.webm" type="video/webm" />
                <source src="/hero/phones.mp4" type="video/mp4" />
              </video>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
