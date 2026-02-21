import path from 'path';
import fs from 'fs';
import os from 'os';

export interface ConversationEvent {
    id: string;
    type: 'artifact' | 'task_update' | 'resolved';
    timestamp: string;
    data: any;
}

export function getLatestConversationId(): string | null {
    const brainDir = path.join(os.homedir(), '.gemini', 'antigravity', 'brain');
    if (!fs.existsSync(brainDir)) return null;

    try {
        const dirs = fs.readdirSync(brainDir, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => {
                const fullPath = path.join(brainDir, dirent.name);
                const stat = fs.statSync(fullPath);
                return { name: dirent.name, mtime: stat.mtimeMs };
            })
            .sort((a, b) => b.mtime - a.mtime); // Sort purely descending

        return dirs.length > 0 ? dirs[0].name : null;
    } catch (error) {
        console.error('Error finding latest conversation:', error);
        return null;
    }
}

export function getConversationState(conversationId: string) {
    const convoDir = path.join(os.homedir(), '.gemini', 'antigravity', 'brain', conversationId);
    if (!fs.existsSync(convoDir)) return null;

    const state: any = {
        conversationId,
        tasks: [],
        artifacts: [],
        recentActivity: [] // Extracted from .resolved files
    };

    try {
        const files = fs.readdirSync(convoDir);

        // Look for task.md
        if (files.includes('task.md')) {
            state.rawTask = fs.readFileSync(path.join(convoDir, 'task.md'), 'utf-8');
        }

        // Look for resolved files (activity feed)
        const resolvedFiles = files.filter(f => f.includes('.resolved'));
        state.recentActivity = resolvedFiles.map(f => {
            const content = fs.readFileSync(path.join(convoDir, f), 'utf-8');
            return { file: f, content: content.slice(0, 100) + '...' }; // Just a preview for the feed
        });

        // Extract JSON metadata
        const metaFiles = files.filter(f => f.endsWith('.metadata.json'));
        state.artifacts = metaFiles.map(f => {
            try {
                return JSON.parse(fs.readFileSync(path.join(convoDir, f), 'utf-8'));
            } catch (e) { return null; }
        }).filter(Boolean);

        return state;
    } catch (error) {
        console.error(`Error reading context for ${conversationId}:`, error);
        return null;
    }
}
