const fs = require('fs');
const path = require('path');

const ROOT = 'C:\\Users\\johno\\.gemini\\antigravity';

const summary = {
    conversations: { count: 0, totalSizeInMB: 0, longestSessionMinutes: 0 },
    projectsTracked: 0,
    trackedFileEdits: 0,
    browserRecordings: 0,
    artifactsGenerated: { tasks: 0, plans: 0, walkthroughs: 0 }
};

// 1. Conversations
const convDir = path.join(ROOT, 'conversations');
if (fs.existsSync(convDir)) {
    const files = fs.readdirSync(convDir).filter(f => f.endsWith('.pb'));
    summary.conversations.count = files.length;

    files.forEach(f => {
        const stat = fs.statSync(path.join(convDir, f));
        summary.conversations.totalSizeInMB += stat.size / (1024 * 1024);
        // Approximate duration by using birthtime vs mtime
        const durationMins = (stat.mtime - stat.birthtime) / (1000 * 60);
        if (durationMins > summary.conversations.longestSessionMinutes) {
            summary.conversations.longestSessionMinutes = durationMins;
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
            summary.trackedFileEdits += fs.readdirSync(pPath).length;
        }
    });
}

// 3. Browser Recordings
const brDir = path.join(ROOT, 'browser_recordings');
if (fs.existsSync(brDir)) {
    summary.browserRecordings = fs.readdirSync(brDir).length;
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

console.log(JSON.stringify(summary, null, 2));
