import Link from "next/link";

export function ToolCard({ code, href, title, description, accent }: { code: string; href: string; title: string; description: string; accent: string }) {
  return <Link className={`tool-card ${accent}`} href={href}><span>{code}</span><div><h2>{title}</h2><p>{description}</p></div><b aria-hidden="true">↗</b></Link>;
}
