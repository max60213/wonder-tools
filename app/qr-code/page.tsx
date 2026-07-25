import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { ToolFrame } from "@/components/ToolFrame";
import { QrCodeTool } from "@/features/qr-code/QrCodeTool";
import { ToolSeoContent } from "@/components/ToolSeoContent";

export const metadata: Metadata = {
  title: "QR Code Generator — SVG and PNG downloads",
  description: "Generate QR codes locally in your browser and download print-ready SVG or PNG files.",
  alternates: { canonical: "/qr-code/" },
};

export default function QrCodePage() {
  return <main><SiteHeader active="qr-code" /><ToolFrame code="02" name="QR Code Generator" summary="Create a code, inspect it, and export a clean file for screen or print."><QrCodeTool /><ToolSeoContent tool="qr-code" /></ToolFrame></main>;
}
