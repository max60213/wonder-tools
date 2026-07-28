import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { ToolFrame } from "@/components/ToolFrame";
import { ResolutionCalculator } from "@/features/resolution/ResolutionCalculator";

export const metadata: Metadata = { title: "Match Ratio — match physical ratios to pixels", description: "Find a practical pixel resolution that exactly matches a physical ratio, locally in your browser.", alternates: { canonical: "/match-ratio/" } };

export default function MatchRatioPage() { return <main><SiteHeader locale="en" active="resolution" /><ToolFrame code="02" name="Match Ratio" summary="Match a real-world ratio to the closest practical pixel dimensions for print, screens, and exports."><ResolutionCalculator locale="en" /></ToolFrame></main>; }
