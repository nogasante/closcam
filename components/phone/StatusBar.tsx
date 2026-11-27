import { BatteryMedium, Signal, Wifi } from "lucide-react";

export function StatusBar() {
  return (
    <div className="flex items-center justify-between bg-black/40 px-4 py-2 text-[12px] font-semibold text-white">
      <span className="mono">14:03</span>
      <span className="h-4 w-24 rounded-full bg-black/70" aria-hidden="true" />
      <span className="flex items-center gap-1">
        <Signal size={14} aria-hidden="true" />
        <Wifi size={14} aria-hidden="true" />
        <BatteryMedium size={16} aria-hidden="true" />
      </span>
    </div>
  );
}
