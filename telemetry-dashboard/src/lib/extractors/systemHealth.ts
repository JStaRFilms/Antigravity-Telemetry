import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import os from 'os';

export interface SystemHealthSnapshot {
    id: number;
    timestamp: string;
    sessions: number;
    total_size_mb: number;
    tracked_edits: number;
    projects: number;
    recordings: number;
    tasks: number;
    plans: number;
    walkthroughs: number;
    longest_session_min: number;
}

export function getSystemHealth(): SystemHealthSnapshot | null {
    const homeDir = os.homedir();
    const dbPath = path.join(homeDir, '.gemini', 'antigravity', 'telemetry.db');

    if (!fs.existsSync(dbPath)) {
        return null;
    }

    try {
        const db = new Database(dbPath, { readonly: true, timeout: 5000 });
        // Get the most recent snapshot
        const stmt = db.prepare('SELECT * FROM snapshots ORDER BY id DESC LIMIT 1');
        const row = stmt.get();
        db.close();
        return row as SystemHealthSnapshot;
    } catch (error) {
        console.error('Error extracting system health:', error);
        return null;
    }
}
