import type { Metadata, Viewport } from "next";
import "@fontsource/nunito/latin-700.css";
import "@fontsource/nunito/latin-800.css";
import "@fontsource/source-sans-3/latin-400.css";
import "@fontsource/source-sans-3/latin-600.css";
import "@fontsource/ibm-plex-mono/latin-500.css";
import "./globals.css";
import { PressSound } from "@/components/PressSound";

export const metadata: Metadata = {
  title: {
    default: "CloScam",
    template: "%s - CloScam",
  },
  description:
    "An in-app training simulator that walks Ghana mobile money users through realistic scam texts, chats and calls. No real messages. No personal data.",
  applicationName: "CloScam",
};

export const viewport: Viewport = {
  themeColor: "#1a1d21",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-full flex-col antialiased">
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-card focus:px-3 focus:py-2"
        >
          Skip to content
        </a>
        <PressSound />
        {children}
      </body>
    </html>
  );
}
