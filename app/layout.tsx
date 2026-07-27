import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import messages from "@/messages/en.json";
import "./globals.css";
import "./stepper.css";
import "./seo-content.css";
import "./raw2dng-layout.css";
import "./typography-overrides.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://tools.wonderstudio.tw"),
  title: { default: "Wonder Tools", template: "%s · Wonder Tools" },
  description: "Private, browser-based utilities for image, print and camera workflows.",
  openGraph: { type: "website", siteName: "Wonder Tools", images: [{ url: "/og/wonder-tools.svg", width: 1200, height: 630, alt: "Wonder Tools — private browser tools" }] },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><NextIntlClientProvider locale="en" messages={messages}>{children}</NextIntlClientProvider></body></html>;
}
