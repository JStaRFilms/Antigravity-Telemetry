import { NextRequest } from 'next/server';
import chokidar from 'chokidar';
import os from 'os';
import path from 'path';
import { getSystemHealth } from '@/lib/extractors/systemHealth';
import { getLatestConversationId, getConversationState } from '@/lib/extractors/conversationLogs';
import { getCodeTrackerState } from '@/lib/extractors/codeTracker';
import { getEnvironmentState } from '@/lib/extractors/environment';

// To keep connection alive and enforce Edge runtime constraints, although chokidar requires Node.js runtime.
// We must force dynamic rendering and nodejs runtime.
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
    const encoder = new TextEncoder();
    const brainDir = path.join(os.homedir(), '.gemini', 'antigravity');

    // We set up a ReadableStream
    const stream = new ReadableStream({
        async start(controller) {
            // Helper to enqueue a formatted SSE standard string
            const sendEvent = (eventData: any) => {
                const payload = `data: ${JSON.stringify(eventData)}\n\n`;
                controller.enqueue(encoder.encode(payload));
            };

            // 1. Send the initial full state dump immediately upon connection
            const sendFullState = () => {
                const latestConvoId = getLatestConversationId();
                sendEvent({
                    type: 'FULL_STATE',
                    systemHealth: getSystemHealth(),
                    conversation: latestConvoId ? getConversationState(latestConvoId) : null,
                    codeTracker: getCodeTrackerState(),
                    environment: getEnvironmentState()
                });
            };
            sendFullState();

            // 2. Initialize Chokidar to watch the Antigravity Brain folder
            // We watch telemetry.db for high-level events, and the latest conversation folder for live steps.
            // Ignoring temp files and node_modules to save memory.
            const watcher = chokidar.watch([
                path.join(brainDir, 'telemetry.db'),
                path.join(brainDir, 'telemetry.db-wal'),
                path.join(brainDir, 'brain')
            ], {
                ignored: /(^|[\/\\])\../, // ignore dotfiles usually, though we want .resolved...
                persistent: true,
                ignoreInitial: true, // we already sent initial state
                depth: 3 // don't go too deep into history
            });

            watcher.on('all', (event, filePath) => {
                // If telemetry databases change, blast out System Health update
                if (filePath.includes('telemetry.db')) {
                    sendEvent({
                        type: 'SYSTEM_HEALTH_UPDATE',
                        systemHealth: getSystemHealth()
                    });
                }

                // If conversation logs change (new artifacts or resolved states)
                if (filePath.includes('brain') && (filePath.endsWith('.resolved') || filePath.endsWith('.json') || filePath.endsWith('.md'))) {
                    const latestConvoId = getLatestConversationId();
                    if (latestConvoId && filePath.includes(latestConvoId)) { // Ensure it's the current session
                        sendEvent({
                            type: 'CONVERSATION_UPDATE',
                            conversation: getConversationState(latestConvoId)
                        });
                    }
                }
            });

            // 3. Keep-alive ping to prevent browser killing the SSE stream
            const keepAlive = setInterval(() => {
                sendEvent({ type: 'PING', environment: getEnvironmentState() });
            }, 30000);

            req.signal.addEventListener('abort', () => {
                clearInterval(keepAlive);
                watcher.close();
                controller.close();
            });
        }
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache, no-transform',
            'Connection': 'keep-alive',
        },
    });
}
