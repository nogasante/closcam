import type { Metadata } from "next";
import { DisclaimerView } from "@/components/DisclaimerView";

export const metadata: Metadata = {
  title: "Before you start",
};

export default function DisclaimerPage() {
  return <DisclaimerView />;
}
