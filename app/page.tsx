import { Landing } from "@/components/landing/Landing";

export default function HomePage() {
  return (
    <>
      <link
        rel="preload"
        as="image"
        href="/hero/phones-poster.webp"
        media="(min-width: 1024px)"
        fetchPriority="high"
      />
      <Landing />
    </>
  );
}
