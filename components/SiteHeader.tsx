import Link from "next/link";
import type { Locale } from "@/i18n/routing";
import styles from "./SiteHeader.module.css";

const items = [
  ["split", "/image-splitter/", "split"],
  ["qr-code", "/qr-code/", "qrCode"],
  ["raw2dng", "/raw2dng/", "raw2dng"],
] as const;

export async function SiteHeader({ locale, active }: { locale: Locale; active: "home" | (typeof items)[number][0] }) {
  const labels = locale === "zh-Hant"
    ? { split: "圖片分割", qrCode: "QR Code", raw2dng: "RAW 轉 DNG", tools: "工具", localPrivate: "本機 / 私密", language: "語言", english: "English", traditionalChinese: "繁體中文" }
    : { split: "Image Splitter", qrCode: "QR Code", raw2dng: "RAW to DNG", tools: "Tools", localPrivate: "LOCAL / PRIVATE", language: "Language", english: "English", traditionalChinese: "繁體中文" };
  const otherLocale = locale === "en" ? "zh-Hant" : "en";
  return <header className={`site-header ${styles.header}`}><Link className={`wordmark ${styles.wordmark}`} href={`/${locale}/`}><span>WONDER</span><span>TOOLS</span></Link><nav aria-label={labels.tools}>{items.map(([key, href, label]) => <Link key={key} className={active === key ? "is-active" : ""} href={`/${locale}${href}`}>{labels[label]}</Link>)}</nav><span className="privacy-mark">{labels.localPrivate}</span><Link className="language-switch" href={`/${otherLocale}/`} hrefLang={otherLocale} aria-label={labels.language}>{otherLocale === "en" ? labels.english : labels.traditionalChinese}</Link></header>;
}
