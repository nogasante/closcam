import type { Metadata } from "next";
import { Developers } from "@/components/developers/Developers";

export const metadata: Metadata = {
  title: "Developers",
};

export default function DevelopersPage() {
  return <Developers />;
}
