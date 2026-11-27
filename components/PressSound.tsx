"use client";

import { useEffect } from "react";
import { press } from "@/lib/live/sound";

export function PressSound() {
  useEffect(() => {
    function onDown(event: PointerEvent) {
      const node = event.target instanceof Element ? event.target : null;
      if (!node?.closest(".btn-primary, .hw-key, .reply-choice, .hw-round")) return;
      press();
    }
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, []);
  return null;
}
