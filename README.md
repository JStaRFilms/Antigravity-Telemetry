<div align="center">

# ⚛️ Antigravity Telemetry

**Real-time visual abstraction of raw internal VibeCoding states, bypassing protocol buffers to stream live LLM operations via Server-Sent Events.**

![Dashboard Preview](docs/dashboard-preview.png)

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![SQLite](https://img.shields.io/badge/SQLite-WAL-003B57?logo=sqlite)](https://www.sqlite.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss)](https://tailwindcss.com)
[![PM2](https://img.shields.io/badge/PM2-Daemon-2B037A?logo=pm2)](https://pm2.keymetrics.io)

</div>

---

## What Is This?

Antigravity Telemetry is a **local-first monitoring dashboard** for the [Antigravity AI Engine](https://github.com/JStaRFilms/Antigravity-Telemetry). It works by passively observing the AI engine's filesystem artifacts — conversation logs, task files, protocol buffers, and internal databases — then rendering them as a real-time dashboard on `localhost:9999`.

**Zero coupling.** The dashboard never injects code into the AI loop. It reads from disk, watches for changes, and pushes state to the browser over SSE. If the dashboard dies, the AI keeps running. If the AI dies, the dashboard gracefully shows stale data.

---

## ✨ Features

| Feature | Description |
|---|---|
| **🔴 Live SSE Stream** | Real-time push updates via `EventSource` — no polling lag |
| **📊 System Health Cards** | Total sessions, tracked edits, DB size, and longest session at a glance |
| **🍩 Context Window Load** | Circular gauge showing active sessions and tracked file count |
| **📋 Active Operation Tracker** | Step-by-step progress of the current AI task with completion percentage |
| **📡 Internal Stream Feed** | Terminal-style live feed of resolved implementation plans and task mutations |
| **📈 Historical Sparklines** | SQLite-backed timeline of telemetry snapshots rendered as sparkline charts |
| **🔄 Auto-Reconnect** | SSE auto-reconnects natively; 5s polling fallback ensures zero downtime |

---

## 🏗️ Architecture

```
┌─────────────────────────┐
│   Antigravity AI Engine │
│   (writes to disk)      │
└────────┬────────────────┘
         │  ~/.gemini/antigravity/brain/
         ▼
┌─────────────────────────────────────────────────┐
│              Telemetry Dashboard                │
│                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐  │
│  │ Chokidar │  │ Polling  │  │  Extractors  │  │
│  │ Watcher  │  │ Fallback │  │              │  │
│  └────┬─────┘  └────┬─────┘  │ • systemHlth │  │
│       │              │        │ • codeTrack  │  │
│       ▼              ▼        │ • convoLogs  │  │
│  ┌─────────┐  ┌──────────┐   │ • environ    │  │
│  │ SSE API │  │ REST API │   └──────┬───────┘  │
│  │ /stream │  │ /telem.  │          │           │
│  └────┬────┘  └────┬─────┘   ┌──────▼───────┐  │
│       │             │        │  telemetry.db │  │
│       │             │        │  (SQLite WAL) │  │
│       ▼             ▼        └───────────────┘  │
│  ┌──────────────────────────────────────────┐   │
│  │         React 19 Dashboard UI            │   │
│  │  SystemHealth · ContextGauge · LiveFeed  │   │
│  │         TaskTracker · Sparklines         │   │
│  └──────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

### Data Pipeline

1. **Extractors** (`src/lib/extractors/`) parse the AI engine's brain directory:
   - `systemHealth.ts` — session count, total DB size, tracked edits
   - `codeTracker.ts` — code file mutations and project tracking
   - `conversationLogs.ts` — task steps, implementation plans, resolved items
   - `environment.ts` — runtime environment metadata

2. **SSE Stream** (`/api/telemetry/stream`) uses [Chokidar](https://github.com/paulmillr/chokidar) to watch the brain directory and push state changes instantly.

3. **Polling Fallback** (`/api/telemetry`) provides a REST endpoint that the frontend hits every 5 seconds when SSE disconnects.

4. **SQLite History** (`telemetry.db`) stores periodic snapshots for historical sparkline charts via [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) in WAL mode.

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** ≥ 18
- **pnpm** (recommended) or npm
- The [Antigravity AI Engine](https://github.com/JStaRFilms/Antigravity-Telemetry) running locally (writes to `~/.gemini/antigravity/brain/`)

### Install & Run

```bash
# Clone the repo
git clone https://github.com/JStaRFilms/Antigravity-Telemetry.git
cd Antigravity-Telemetry/telemetry-dashboard

# Install dependencies
pnpm install

# Start development server on port 9999
pnpm dev
```

Open **[http://localhost:9999](http://localhost:9999)** — the dashboard auto-connects to the live SSE stream.

### Production (PM2)

```bash
# Build for production
pnpm build

# Start with PM2 daemon (auto-restart, 1GB memory limit)
pm2 start ecosystem.config.js

# Check status
pm2 status antigravity-dashboard
```

Or use the bundled batch script:

```bash
start_dashboard.bat
```

---

## 📁 Project Structure

```
telemetry-dashboard/
├── src/
│   ├── app/
│   │   ├── page.tsx                   # Main dashboard (client component)
│   │   ├── layout.tsx                 # Root layout with Geist font
│   │   ├── globals.css                # Tailwind + custom styles
│   │   └── api/telemetry/
│   │       ├── route.ts               # REST polling endpoint
│   │       ├── stream/route.ts        # SSE real-time stream
│   │       └── history/route.ts       # SQLite history endpoint
│   ├── components/telemetry/
│   │   ├── SystemHealth.tsx           # Stat cards + sparkline
│   │   ├── ContextGauge.tsx           # Circular progress gauge
│   │   ├── TaskTracker.tsx            # Active operation stepper
│   │   └── LiveFeed.tsx               # Terminal-style event log
│   ├── lib/
│   │   ├── db.ts                      # SQLite connection + queries
│   │   └── extractors/                # Brain directory parsers
│   └── types/
├── docs/features/                     # Architecture documentation
├── server.js                          # Custom Node.js production server
├── ecosystem.config.js                # PM2 configuration
├── start_dashboard.bat                # Windows quick-start script
└── package.json
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org) (App Router) |
| **UI** | [React 19](https://react.dev) + [Tailwind CSS 4](https://tailwindcss.com) |
| **Charts** | [Recharts 3](https://recharts.org) |
| **Icons** | [Lucide React](https://lucide.dev) |
| **Database** | [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) (WAL mode) |
| **File Watching** | [Chokidar 5](https://github.com/paulmillr/chokidar) |
| **Process Manager** | [PM2](https://pm2.keymetrics.io) |
| **Runtime** | Node.js 18+ on Windows |

---

## 🔧 Configuration

| Environment Variable | Default | Description |
|---|---|---|
| `PORT` | `9999` | Dashboard port |
| `NODE_ENV` | `production` | Runtime mode |

The brain directory is auto-detected at `~/.gemini/antigravity/brain/`. No configuration needed — plug and play.

---

## 📄 License

This project is part of the Antigravity ecosystem. See the repository root for license details.

---

<div align="center">
<sub>Built with ⚡ by <a href="https://github.com/JStaRFilms">J-Star Films</a> — VibeCoding at the speed of thought.</sub>
</div>
