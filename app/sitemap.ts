import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const origin = "https://tools.wonderstudio.tw";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${origin}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${origin}/split/`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${origin}/qr-code/`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${origin}/raw2dng/`, changeFrequency: "monthly", priority: 0.9 },
  ];
}
