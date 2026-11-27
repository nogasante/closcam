import type { Metadata } from "next";
import { CallRoom } from "@/components/live/CallRoom";

export const metadata: Metadata = {
  title: "Live call",
};

export default function CallPage() {
  return <CallRoom />;
}
