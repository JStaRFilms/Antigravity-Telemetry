import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Safely resolve the root directory without hardcoding the exact path if possible, 
// but since this is a local tool specifically for this user's machine:
const ROOT = 'C:\\Users\\johno\\.gemini\\antigravity';

export async function GET() {
    try {
        const summary = {
            conversations: { count: 0, totalSizeInMB: 0, longestSessionMinutes: 0 },
            projectsTracked: 0,
            trackedFileEdits: 0,
            browserRecordings: 0,
            artifactsGenerated: { tasks: 0, plans: 0, walkthroughs: 0 },
            recentActivity: [] as { type: string, name: string, date: string }[]
        };

        // 1. Conversations
        const convDir = path.join(ROOT, 'conversations');
        if (fs.existsSync(convDir)) {
            const files = fs.readdirSync(convDir).filter(f => f.endsWith('.pb'));
            summary.conversations.count = files.length;

            files.forEach(f => {
                const stat = fs.statSync(path.join(convDir, f));
                summary.conversations.totalSizeInMB += stat.size / (1024 * 1024);

                const durationMins = (stat.mtimeMs - stat.birthtimeMs) / (1000 * 60);
                if (durationMins > summary.conversations.longestSessionMinutes) {
                    summary.conversations.longestSessionMinutes = durationMins;
                }

                // Add to recent activity if within last 7 days
                if (Date.now() - stat.mtimeMs < 7 * 24 * 60 * 60 * 1000) {
                    summary.recentActivity.push({
                        type: 'Session',
                        name: `Session ${f.substring(0, 8)}`,
                        date: stat.mtime.toISOString()
                    })
                }
            });
        }

        // 2. Code Tracker
        const ctDir = path.join(ROOT, 'code_tracker', 'active');
        if (fs.existsSync(ctDir)) {
            const projects = fs.readdirSync(ctDir);
            summary.projectsTracked = projects.length;
            projects.forEach(p => {
                const pPath = path.join(ctDir, p);
                if (fs.statSync(pPath).isDirectory()) {
                    const files = fs.readdirSync(pPath);
                    summary.trackedFileEdits += files.length;

                    files.slice(0, 5).forEach(f => {
                        const stat = fs.statSync(path.join(pPath, f));
                        // Add to recent activity if within last 7 days
                        if (Date.now() - stat.mtimeMs < 7 * 24 * 60 * 60 * 1000) {
                            summary.recentActivity.push({
                                type: 'Code Edit',
                                name: `${p.substring(0, 15)}.../${f.substring(33, 45)}...`, // Truncated for UI
                                date: stat.mtime.toISOString()
                            })
                        }
                    })
                }
            });
        }

        // 3. Browser Recordings
        const brDir = path.join(ROOT, 'browser_recordings');
        if (fs.existsSync(brDir)) {
            const records = fs.readdirSync(brDir);
            summary.browserRecordings = records.length;
        }

        // 4. Brain Artifacts
        const brainDir = path.join(ROOT, 'brain');
        if (fs.existsSync(brainDir)) {
            const sessions = fs.readdirSync(brainDir);
            sessions.forEach(s => {
                const sPath = path.join(brainDir, s);
                if (fs.statSync(sPath).isDirectory()) {
                    const files = fs.readdirSync(sPath);
                    if (files.includes('task.md')) summary.artifactsGenerated.tasks++;
                    if (files.includes('implementation_plan.md')) summary.artifactsGenerated.plans++;
                    if (files.includes('walkthrough.md')) summary.artifactsGenerated.walkthroughs++;
                }
            });
        }

        // Sort recent activity
        summary.recentActivity.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        summary.recentActivity = summary.recentActivity.slice(0, 20); // Keep top 20

        // Round MB
        summary.conversations.totalSizeInMB = Math.round(summary.conversations.totalSizeInMB * 100) / 100;
        summary.conversations.longestSessionMinutes = Math.round(summary.conversations.longestSessionMinutes * 10) / 10;

        return NextResponse.json(summary);
    } catch (error) {
        console.error("Telemetry Error:", error);
        return NextResponse.json({ error: 'Failed to aggregate telemetry' }, { status: 500 });
    }
}
