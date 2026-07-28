import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { ToolFrame } from "@/components/ToolFrame";
import { ImageSplitterTool } from "@/features/split/ImageSplitterTool";
import { ToolSeoContent } from "@/components/ToolSeoContent";

export const metadata: Metadata = {
  title: "Image Splitter — split images into equal tiles",
  description: "Split images into precise grids locally in your browser for social media, print, and design.",
  alternates: { canonical: "/split/" },
};

export default function SplitPage() {
  return <main><SiteHeader locale="en" active="split" /><ToolFrame code="01" name="Image Splitter" summary="Build a grid, adjust the crop, and download tiles as a ZIP or individual files."><ImageSplitterTool /><ToolSeoContent tool="split" /></ToolFrame></main>;
}
