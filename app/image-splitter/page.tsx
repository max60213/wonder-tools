import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { ToolFrame } from "@/components/ToolFrame";
import { ToolSeoContent } from "@/components/ToolSeoContent";
import { ImageSplitterTool } from "@/features/split/ImageSplitterTool";

export const metadata: Metadata = {
  title: "Image Splitter — split images into equal tiles",
  description: "Split images into precise grids locally in your browser for social media, print, and design.",
  alternates: { canonical: "/image-splitter/" },
};

export default function ImageSplitterPage() {
  return <main><SiteHeader locale="en" active="split" /><ToolFrame code="01" name="Image Splitter" summary="Build a grid, adjust the crop, and download every tile in one archive."><ImageSplitterTool /><ToolSeoContent tool="split" /></ToolFrame></main>;
}
