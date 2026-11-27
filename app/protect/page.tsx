import type { Metadata } from "next";
import { ProtectDrill } from "@/components/protect/ProtectDrill";

export const metadata: Metadata = {
  title: "Protection",
};

export default function ProtectPage() {
  return <ProtectDrill />;
}
