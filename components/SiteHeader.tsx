import Link from "next/link";
import styles from "./SiteHeader.module.css";

const items = [
  ["split", "/split/", "Split"],
  ["qr-code", "/qr-code/", "QR Code"],
  ["raw2dng", "/raw2dng/", "RAW to DNG"],
] as const;

export function SiteHeader({ active }: { active: "home" | (typeof items)[number][0] }) {
  return <header className={`site-header ${styles.header}`}><Link className={`wordmark ${styles.wordmark}`} href="/"><span>WONDER</span><span>TOOLS</span></Link><nav aria-label="Tools">{items.map(([key, href, label]) => <Link key={key} className={active === key ? "is-active" : ""} href={href}>{label}</Link>)}</nav><span className="privacy-mark">LOCAL / PRIVATE</span></header>;
}
