# Telemetry Frontend UI

## Overview
The frontend is a strict, single-page dashboard built with Next.js App Router and React 19 Client Components. It follows the Premium VibeCoding aesthetic (dark mode, glassmorphism, Recharts).

## Architecture
- **Framework:** Next.js
- **Styling:** Tailwind CSS + Lucide React
- **Visualization:** Recharts
- **Live Sync:** React Server-Sent Events (SSE) `EventSource`

## Key Components

### `LiveFeed.tsx`
A streaming, auto-scrolling terminal window displaying the literal `.resolved` files from the LLM's active operation stream. It features an intelligent scroll-lock (it stops auto-scrolling if the user scrolls up to read history).

### `TaskTracker.tsx`
The primary indicator of the AI's current strategic path. It parses the hidden markdown blueprint (`task.md`) and calculates percentage completion based on `[x]` vs `[ ]` checkboxes. It features an expandable "Current Vector" UI subroutine dropdown.

### `SystemHealth.tsx`
The global metrics display (Total Sessions, Tracked Edits, File Sizes). It also integrates with the internal SQLite database to construct a Recharts-powered sparkline showing the velocity of codebase interventions over time. Includes detailed info tooltips on hover.

### `ContextGauge.tsx`
A pair of concentric pie charts rendering the literal RAM limits inside the `node.js` environment alongside the active tracker ratios.

## Features
- **Scroll-Free Layout:** The main grid flex height is pinned to `100vh` via CSS, with internal custom scrollbars deliberately hidden (`no-scrollbar`) to simulate a native application frame.
- **Auto-Fallback:** If the SSE Stream is dropped by the browser, `page.tsx` gracefully degrades into a rapid 5-second HTTP polling loop to pull state until connection is restored.
