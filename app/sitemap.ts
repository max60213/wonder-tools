import type { MetadataRoute } from "next";
import { locales } from "@/i18n/routing";

export const dynamic = "force-static";

const origin = "https://tools.wonderstudio.tw";

export default function sitemap(): MetadataRoute.Sitemap {
  const localized = locales.flatMap((locale) => [
    { url: `${origin}/${locale}/`, changeFrequency: "monthly" as const, priority: 1 },
    { url: `${origin}/${locale}/image-splitter/`, changeFrequency: "monthly" as const, priority: 0.9 },
    { url: `${origin}/${locale}/qr-code/`, changeFrequency: "monthly" as const, priority: 0.9 },
    { url: `${origin}/${locale}/raw2dng/`, changeFrequency: "monthly" as const, priority: 0.9 },
  ]);
  return [
    { url: `${origin}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${origin}/image-splitter/`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${origin}/qr-code/`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${origin}/raw2dng/`, changeFrequency: "monthly", priority: 0.9 },
    ...localized,
  ];
}
