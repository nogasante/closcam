"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useState, useSyncExternalStore } from "react";
import { HeroPhone } from "./HeroPhone";

const SCENE = "https://prod.spline.design/2Q27OEI4ECSYhOld/scene.splinecode";

function subscribeSpline(onChange: () => void) {
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const width = window.matchMedia("(max-width: 1023px)");
  motion.addEventListener("change", onChange);
  width.addEventListener("change", onChange);
  return () => {
    motion.removeEventListener("change", onChange);
    width.removeEventListener("change", onChange);
  };
}

const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
  loading: () => null,
});

function splineAllowed(): boolean {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  if (window.matchMedia("(max-width: 1023px)").matches) return false;
  const connection = (navigator as Navigator & {
    connection?: { saveData?: boolean; effectiveType?: string };
  }).connection;
  const slow =
    Boolean(connection?.saveData) ||
    connection?.effectiveType === "slow-2g" ||
    connection?.effectiveType === "2g";
  return !slow;
}

export function HeroStage() {
  const allow = useSyncExternalStore(subscribeSpline, splineAllowed, () => false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!allow || ready) return;
    const timer = window.setTimeout(() => setFailed(true), 12000);
    return () => window.clearTimeout(timer);
  }, [allow, ready]);

  if (!allow || failed) return <HeroPhone />;

  return (
    <div className="hero-stage relative w-full overflow-hidden bg-[#2D2E32]">
      <Image
        src="/hero-poster.png"
        alt=""
        fill
        priority
        className={`object-cover ${ready ? "invisible" : ""}`}
      />
      {ready ? null : (
        <div className="relative z-10 flex h-full items-center justify-center">
          <HeroPhone />
        </div>
      )}
      <Spline
        scene={SCENE}
        htmlContentMode="sandbox"
        onLoad={() => setReady(true)}
        className={`absolute inset-0 h-full w-full ${ready ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
}
