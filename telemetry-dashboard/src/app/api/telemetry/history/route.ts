import { NextResponse } from 'next/server';
import { getHistory } from '@/lib/db';

export async function GET() {
    try {
        const rows = getHistory(100);
        // Reverse so oldest is first (for charts)
        const timeline = rows.reverse().map(row => ({
            timestamp: row.timestamp,
            sessions: row.sessions,
            totalSizeMB: row.total_size_mb,
            trackedEdits: row.tracked_edits,
            projects: row.projects,
            recordings: row.recordings,
            tasks: row.tasks,
            plans: row.plans,
            walkthroughs: row.walkthroughs,
        }));
        return NextResponse.json(timeline);
    } catch (error) {
        console.error('History API error:', error);
        return NextResponse.json([], { status: 500 });
    }
}
