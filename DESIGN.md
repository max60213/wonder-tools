---
version: alpha
name: Wonder Tools
description: A privacy-first visual system for focused, browser-based creative utilities.
colors:
  primary: "#14211D"
  secondary: "#5C6B66"
  surface: "#EDF2EE"
  panel: "#FFFFFF"
  line: "#C9D3CD"
  signal: "#FF5638"
  amber: "#E7A200"
  violet: "#7659E8"
  success: "#23915D"
  on-primary: "#FFFFFF"
  on-surface: "#14211D"
typography:
  display:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: 3.6rem
    fontWeight: 700
    lineHeight: 0.86
    letterSpacing: -0.075em
  heading:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: 1.5rem
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: -0.04em
  body:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "ui-monospace, monospace"
    fontSize: 0.72rem
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: 0.12em
rounded:
  sm: 10px
  md: 12px
  lg: 18px
  pill: 999px
spacing:
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  2xl: 28px
  3xl: 42px
  4xl: 52px
components:
  button-primary:
    backgroundColor: "{colors.signal}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.sm}"
    padding: 15px 20px
  button-quiet:
    backgroundColor: transparent
    textColor: "{colors.primary}"
    rounded: "{rounded.sm}"
    padding: 10px 13px
  card:
    backgroundColor: "{colors.panel}"
    rounded: "{rounded.lg}"
    padding: 28px
  card-hover:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
  input:
    backgroundColor: "#F8FAF8"
    textColor: "{colors.primary}"
    rounded: "{rounded.sm}"
    padding: 14px
  status-ready:
    backgroundColor: "{colors.success}"
  status-error:
    backgroundColor: "{colors.signal}"
---

## Overview

Wonder Tools is an editorial utility kit: direct, calm, and practical. The interface should feel like a well-made studio tool rather than a consumer platform—clear typography, generous empty space, thin structural rules, and a small set of purposeful colour signals.

Privacy is a product promise and a visual principle. The layouts should feel self-contained and dependable: no advertising-like chrome, artificial urgency, decorative gradients used as branding, or visual noise. Let the workflow and the user's content carry the page.

Use a wide, fluid desktop canvas with a constrained content width (`min(1180px, 90vw)`). On small screens, reflow multi-column workbenches into a single readable sequence rather than compressing their controls.

## Colors

The palette is rooted in a deep forest ink and soft sage-tinted neutrals. It is intentionally warmer and quieter than a conventional black-and-white productivity interface.

- **Primary (`#14211D`):** the deep ink for headings, core text, dark panels, and strong hover states.
- **Secondary (`#5C6B66`):** restrained copy, metadata, outlines, and supporting information.
- **Surface (`#EDF2EE`):** the page canvas; use it in preference to stark white.
- **Panel (`#FFFFFF`):** raised work areas, cards, and form containers.
- **Line (`#C9D3CD`):** thin structural dividers and input borders.
- **Signal (`#FF5638`):** the single default action colour. Use for primary actions, emphasis in display copy, active ranges, and error status—not for decoration.
- **Amber (`#E7A200`) and Violet (`#7659E8`):** reserved tool identity accents. Do not replace the primary action colour with these.
- **Success (`#23915D`):** a compact readiness/completion signal.

Maintain WCAG AA contrast for text. Primary actions use white text on Signal; muted text belongs on pale surfaces, never on a dark primary panel.

## Typography

Use Inter (with the system sans-serif fallback stack) for all interface and editorial copy. Its confident, tight display treatment gives the product its studio-like character.

Display headings are large, bold, and compact: use a negative letter spacing (`-0.075em`) with line-height near `0.86–0.95`. On landing pages, favour short statements broken across intentional lines. Emphasise one phrase in Signal rather than using multiple type weights or colours.

Body copy is quiet and comfortably readable at `1rem–1.08rem` with `1.5–1.6` line-height. Use the mono label style for kickers, numbered tools, status text, and compact metadata; set it in uppercase or uppercase-like wording with measured tracking.

## Layout

Use large, deliberate vertical rhythm. Landing heroes have ample top padding, followed by concise supporting copy. Keep introductory copy to a readable measure (roughly 520–740px) even when the page is wide.

Workbenches are bordered panels with distinct control and preview regions. Their grid columns should express task hierarchy: controls remain stable and readable, while preview space gets the larger share when needed. Use 1px Line borders to divide regions instead of adding shadows or extra containers.

At viewport widths below 760px, change grids to a single column. Preserve the logical order: status, primary input/workflow, queue or details, then supporting facts. Navigation may scroll horizontally, but never wrap into a crowded second row.

## Elevation & Depth

The system is mostly flat. Panel separation comes from Surface versus Panel, 1px Line borders, and spacing. Avoid drop shadows on cards and containers.

The only normal exception is a user-generated image or canvas preview, where a subtle, soft shadow helps distinguish the asset from its pale preview field. Hover elevation is restrained: interactive tool cards may move up by 4px while switching to a Primary background.

## Shapes

Use `18px` corners for large workbenches and grouped card systems. Use `10–12px` for inputs, buttons, uploads, and task rows. Pills are reserved for compact navigation, language controls, and state badges.

Borders should be thin and quiet. Dashed borders are for drop targets only; do not use them as a general decorative motif. Icons should be simple text symbols or minimal geometry, never glossy or illustrative.

## Components

**Site header:** a low, bordered bar with the spaced uppercase wordmark on the left, compact pill navigation beside it, and a small privacy assurance aligned right. Active navigation uses Primary with white text. Keep the header uncluttered.

**Tool cards:** arrange tool choices as a shared bordered grid. Each card has its numerical mono label, a concise title and description, and a directional arrow aligned at the lower right. On hover, the entire card becomes Primary; supporting copy shifts to a low-contrast pale green rather than pure white.

**Forms:** labels are bold, tracked, and uppercase. Inputs are pale, visibly bordered, and spacious; error copy uses Signal in a text treatment, not a red alert box. A primary button is full-width in conventional forms, or content-width when it acts as the sole call to action in a drop zone.

**Drop targets:** use a dashed Secondary border, a small outlined circular plus mark, and centered instructional text. On hover or drag-over, move the border to Signal and tint the background a very pale coral.

**Status and queue:** status uses a small coloured dot plus clear text. Queue rows are compact bordered cards with mono state badges, quiet metadata, and a 6px progress track in Signal. Completion uses Success; errors use Signal and explain the failure in plain language.

**Dark facts panel:** use Primary as a dense visual anchor for technical facts and privacy claims. Text is white, with muted pale-green labels and translucent white dividers.

## Do's and Don'ts

Do make the interface feel local, useful, and unhurried. Do use Signal sparingly to identify the next meaningful action. Do preserve whitespace and clear distinctions between input, output, and supporting facts.

Do not introduce account prompts, marketing banners, dense dashboards, decorative illustrations, glass effects, or rainbow gradients. Do not use pure black, harsh grey backgrounds, heavy shadows, or more than one accent colour within a single workflow. Do not make users infer where their files go: surface the local-processing and privacy promise plainly.
