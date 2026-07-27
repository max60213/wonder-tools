import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { ToolFrame } from "@/components/ToolFrame";
import { Raw2DngTool } from "@/features/raw2dng/Raw2DngTool";
import { ToolSeoContent } from "@/components/ToolSeoContent";

export const metadata: Metadata = {
  title: "RAW to DNG Converter — private and browser-based",
  description: "Convert supported camera RAW files to DNG locally in your browser without uploading your photos.",
  alternates: { canonical: "/raw2dng/" },
};

export default function Raw2DngPage() {
  return <main><SiteHeader locale="en" active="raw2dng" /><ToolFrame code="03" name="RAW to DNG" summary="Convert supported camera RAW files to DNG without uploading them anywhere."><Raw2DngTool /><ToolSeoContent tool="raw2dng" /></ToolFrame></main>;
}
