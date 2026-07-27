import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { ToolCard } from "@/components/ToolCard";

export const metadata: Metadata = {
  title: "Private browser tools for creators",
  description: "Split images, generate QR codes, and convert camera RAW files locally in your browser.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return <main><SiteHeader locale="en" active="home" />
    <section className="landing-hero">
      <p className="kicker">WONDER TOOLS / LOCAL BY DEFAULT</p>
      <h1>Useful tools.<br /><em>Nothing leaves your device.</em></h1>
      <p>Three focused utilities for creators working with images, print assets, and camera files. No accounts, no uploads, no waiting room.</p>
    </section>
    <section className="tool-index" aria-label="Available tools">
      <ToolCard locale="en" code="01" href="/image-splitter/" title="Image Splitter" description="Turn a single image into precise grid tiles for social, print, and layouts." accent="signal" />
      <ToolCard locale="en" code="02" href="/qr-code/" title="QR Code Generator" description="Create crisp SVG and PNG codes for links, print pieces, Wi‑Fi, and contact details." accent="amber" />
      <ToolCard locale="en" code="03" href="/raw2dng/" title="RAW to DNG" description="Convert camera RAW files privately, directly in your browser." accent="violet" />
    </section>
  </main>;
}
