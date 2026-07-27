import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { ToolCard } from "@/components/ToolCard";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = (await import("@/i18n/messages")).getMessages(locale).home;
  return { title: t.metadataTitle, description: t.metadataDescription, alternates: { canonical: `/${locale}/` } };
}

export default async function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = (await import("@/i18n/messages")).getMessages(locale).home;
  const site = (await import("@/i18n/messages")).getMessages(locale).site;
  return <main><SiteHeader locale={locale} active="home" />
    <section className="landing-hero"><p className="kicker">{t.kicker}</p><h1>{t.title}<br /><em>{t.titleEmphasis}</em></h1><p>{t.intro}</p></section>
    <section className="tool-index" aria-label={site.availableTools}>
      <ToolCard locale={locale} code="01" href="/image-splitter/" title={t.splitTitle} description={t.splitDescription} accent="signal" />
      <ToolCard locale={locale} code="02" href="/qr-code/" title={t.qrTitle} description={t.qrDescription} accent="amber" />
      <ToolCard locale={locale} code="03" href="/raw2dng/" title={t.rawTitle} description={t.rawDescription} accent="violet" />
    </section>
  </main>;
}
