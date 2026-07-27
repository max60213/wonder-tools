import type { Metadata } from "next";
import { getMessages } from "@/i18n/messages";
import { type Locale } from "@/i18n/routing";
import { SiteHeader } from "@/components/SiteHeader";
import { ToolFrame } from "@/components/ToolFrame";
import { ToolSeoContent } from "@/components/ToolSeoContent";
import { ImageSplitterTool } from "@/features/split/ImageSplitterTool";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = getMessages(locale).split;
  return { title: t.metadataTitle, description: t.metadataDescription, alternates: { canonical: `/${locale}/image-splitter/` } };
}

export default async function ImageSplitterPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = getMessages(locale).tools;
  return <main><SiteHeader locale={locale} active="split" /><ToolFrame code="01" name={t.splitName} summary={t.splitSummary}><ImageSplitterTool /><ToolSeoContent tool="split" locale={locale} /></ToolFrame></main>;
}
