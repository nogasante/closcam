"use client";

import type { Spot } from "./JunctionScene";

export function JunctionFlat({ onSelect }: { onSelect: (spot: Spot) => void }) {
  return (
    <div className="junction-flat" aria-label="Junction, side view">
      <div className="lamp" />
      <div className="ground" />
      <button type="button" className="spot spot-kiosk" onClick={() => onSelect("kiosk")}>
        <span>Stall</span>
      </button>
      <button type="button" className="spot spot-phone" onClick={() => onSelect("phone")}>
        <span>Phone</span>
      </button>
      <button type="button" className="spot spot-booth" onClick={() => onSelect("booth")}>
        <span>Booth</span>
      </button>
    </div>
  );
}
