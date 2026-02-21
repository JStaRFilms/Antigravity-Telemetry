# Antigravity Data Extractors

## Overview
Because the Telemetry Dashboard is a decoupled "observer" rather than a participant in the AI loop, it requires specialized parsing functions to make sense of the raw data scattered across the user's hard drive.

## Architecture
- **Location:** `src/lib/extractors/`
- **Dependencies:** `fs`, `path`, `os`, `better-sqlite3`

## Key Extractors

### `systemHealth.ts`
Scans the `brain/` directory to calculate the exact number of active conversational folders. It also calculates the cumulative size of memory footprints and tracks the longest ongoing session.

### `conversationLogs.ts`
Parses the current active conversation UUID. It reads the hidden `task.md` file to count checkboxes (`[ ]`, `[/]`, `[x]`) for the Completion Protocol widget. It also reads the `.resolved` log files to populate the real-time scrolling terminal feed.

### `codeTracker.ts`
Examines the `~/.gemini/antigravity/code_tracker/active/` directory to deduce which coding projects the AI is currently modifying and how many files have been touched.

### `environment.ts`
Hooks into standard Node.js `os` APIs to fetch real-time memory usage (RAM), system uptime, and platform architecture stats.

### `db.ts` (SQLite Wrapper)
Manages the connection to the internal `telemetry.db`. 
- **Operations:** `insertSnapshot()` for recording state every 5 seconds. `getHistory()` for pulling the last 50 data points to render the UI sparkline graphs.
