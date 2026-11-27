import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "CloScam",
    short_name: "CloScam",
    description:
      "Training simulator for Ghana mobile money scams. No real messages. No personal data.",
    start_url: "/",
    display: "standalone",
    background_color: "#f3efe4",
    theme_color: "#0c6b4d",
    lang: "en",
  };
}
