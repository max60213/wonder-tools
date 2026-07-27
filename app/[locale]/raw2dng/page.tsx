import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { ToolFrame } from "@/components/ToolFrame";
import { Raw2DngTool } from "@/features/raw2dng/Raw2DngTool";
import { ToolSeoContent } from "@/components/ToolSeoContent";
import type { Locale } from "@/i18n/routing";

import { getMessages } from "@/i18n/messages";
export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> { const { locale } = await params; const t = getMessages(locale).raw; return { title: t.metadataTitle, description: t.metadataDescription, alternates: { canonical: `/${locale}/raw2dng/` } }; }
export default async function Raw2DngPage({ params }: { params: Promise<{ locale: Locale }> }) { const { locale } = await params; const t = getMessages(locale).tools; return <main><SiteHeader locale={locale} active="raw2dng" /><ToolFrame code="03" name={t.rawName} summary={t.rawSummary}><Raw2DngTool /><ToolSeoContent tool="raw2dng" locale={locale} /></ToolFrame></main>; }
