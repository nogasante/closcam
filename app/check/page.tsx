import type { Metadata } from "next";
import { Checker } from "@/components/check/Checker";

export const metadata: Metadata = {
  title: "Scam checker",
};

export default function CheckPage() {
  return <Checker />;
}
