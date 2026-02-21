import Database from 'better-sqlite3';
import path from 'path';
import os from 'os';

const DB_PATH = path.join(os.homedir(), '.gemini', 'antigravity', 'telemetry.db');

let db: Database.Database | null = null;

function getDb(): Database.Database {
    if (!db) {
        db = new Database(DB_PATH);
        db.pragma('journal_mode = WAL');
        db.exec(`
      CREATE TABLE IF NOT EXISTS snapshots (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp TEXT NOT NULL DEFAULT (datetime('now')),
        sessions INTEGER NOT NULL,
        total_size_mb REAL NOT NULL,
        tracked_edits INTEGER NOT NULL,
        projects INTEGER NOT NULL,
        recordings INTEGER NOT NULL,
        tasks INTEGER NOT NULL,
        plans INTEGER NOT NULL,
        walkthroughs INTEGER NOT NULL,
        longest_session_min INTEGER NOT NULL
      )
    `);
    }
    return db;
}

export interface SnapshotRow {
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

export function insertSnapshot(data: {
    sessions: number;
    totalSizeMB: number;
    trackedEdits: number;
    projects: number;
    recordings: number;
    tasks: number;
    plans: number;
    walkthroughs: number;
    longestSessionMin: number;
}): void {
    const stmt = getDb().prepare(`
    INSERT INTO snapshots (sessions, total_size_mb, tracked_edits, projects, recordings, tasks, plans, walkthroughs, longest_session_min)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
    stmt.run(
        data.sessions,
        data.totalSizeMB,
        data.trackedEdits,
        data.projects,
        data.recordings,
        data.tasks,
        data.plans,
        data.walkthroughs,
        data.longestSessionMin
    );
}

export function getHistory(limit = 50): SnapshotRow[] {
    const stmt = getDb().prepare(`
    SELECT * FROM snapshots ORDER BY timestamp DESC LIMIT ?
  `);
    return stmt.all(limit) as SnapshotRow[];
}

export function getLastSnapshot(): SnapshotRow | undefined {
    const stmt = getDb().prepare(`
    SELECT * FROM snapshots ORDER BY id DESC LIMIT 1
  `);
    return stmt.get() as SnapshotRow | undefined;
}
