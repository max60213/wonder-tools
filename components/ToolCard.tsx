import Link from "next/link";
import type { Locale } from "@/i18n/routing";

export function ToolCard({ locale, code, href, title, description, accent }: { locale: Locale; code: string; href: string; title: string; description: string; accent: string }) {
  return <Link className={`tool-card ${accent}`} href={`/${locale}${href}`}><span>{code}</span><div><h2>{title}</h2><p>{description}</p></div><b aria-hidden="true">↗</b></Link>;
}
