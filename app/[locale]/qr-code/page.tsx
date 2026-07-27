import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { ToolFrame } from "@/components/ToolFrame";
import { QrCodeTool } from "@/features/qr-code/QrCodeTool";
import { ToolSeoContent } from "@/components/ToolSeoContent";
import type { Locale } from "@/i18n/routing";

import { getMessages } from "@/i18n/messages";
export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> { const { locale } = await params; const t = getMessages(locale).qr; return { title: t.metadataTitle, description: t.metadataDescription, alternates: { canonical: `/${locale}/qr-code/` } }; }
export default async function QrCodePage({ params }: { params: Promise<{ locale: Locale }> }) { const { locale } = await params; const t = getMessages(locale).tools; return <main><SiteHeader locale={locale} active="qr-code" /><ToolFrame code="02" name={t.qrName} summary={t.qrSummary}><QrCodeTool /><ToolSeoContent tool="qr-code" locale={locale} /></ToolFrame></main>; }
