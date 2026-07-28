import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { ToolFrame } from "@/components/ToolFrame";
import { ResolutionCalculator } from "@/features/resolution/ResolutionCalculator";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const zh = locale === "zh-Hant";
  return {
    title: zh
      ? "Match Ratio — 依實際比例換算像素"
      : "Match Ratio — match physical ratios to pixels",
    description: zh
      ? "在瀏覽器本機找出完全符合實際比例且最接近原圖的像素尺寸。"
      : "Find a practical pixel resolution that exactly matches a physical ratio, locally in your browser.",
    alternates: { canonical: `/${locale}/match-ratio/` },
  };
}

export default async function MatchRatioPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const zh = locale === "zh-Hant";
  return (
    <main>
      <SiteHeader locale={locale} active="resolution" />
      <ToolFrame
        code="02"
        name="Match Ratio"
        summary={
          zh
            ? "依照實際尺寸比例，找出最接近原圖且符合像素偏好的輸出尺寸。"
            : "Match a real-world ratio to the closest practical pixel dimensions for print, screens, and exports."
        }
      >
        <ResolutionCalculator locale={locale} />
      </ToolFrame>
    </main>
  );
}
