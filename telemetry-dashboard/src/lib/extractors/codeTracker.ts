import path from 'path';
import fs from 'fs';
import os from 'os';

export function getCodeTrackerState() {
    const activeTrackerDir = path.join(os.homedir(), '.gemini', 'antigravity', 'code_tracker', 'active');
    if (!fs.existsSync(activeTrackerDir)) return { activeSessions: 0, details: [] };

    try {
        const projects = fs.readdirSync(activeTrackerDir);
        const details = projects.map(proj => {
            const projDir = path.join(activeTrackerDir, proj);
            const files = fs.readdirSync(projDir);
            return {
                projectId: proj,
                openFiles: files,
                // Next iteration: connect to tracker.db if it exists, right now just grabbing stats
                lastModified: fs.statSync(projDir).mtime
            };
        });

        return {
            activeSessions: projects.length,
            details
        };
    } catch (error) {
        console.error('Error extracting code tracker state:', error);
        return { activeSessions: 0, details: [] };
    }
}
