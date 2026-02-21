'use client';

import { Cpu, MemoryStick } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface ContextGaugeProps {
    environment: any;
    codeTracker: any;
}

export default function ContextGauge({ environment, codeTracker }: ContextGaugeProps) {
    // If memoryUsage isn't standard because we mocked it, fallback to default props
    const memUsedRaw = environment?.memoryUsage?.heapUsed || 1024 * 1024 * 150;
    const memTotalRaw = environment?.memoryUsage?.heapTotal || 1024 * 1024 * 512;

    const memUsedMB = Math.round(memUsedRaw / 1024 / 1024);
    const memTotalMB = Math.round(memTotalRaw / 1024 / 1024);
    const memPercent = Math.round((memUsedMB / memTotalMB) * 100);

    const activeProjects = codeTracker?.activeSessions || 0;
    const openFiles = codeTracker?.details?.[0]?.openFiles?.length || 0;

    const memData = [
        { name: 'Used', value: memPercent },
        { name: 'Free', value: 100 - memPercent }
    ];

    return (
        <div className="bg-zinc-950 border border-zinc-800/50 rounded-xl p-6 relative shadow-2xl">
            <div className="flex items-center gap-2 mb-6">
                <Cpu className="w-5 h-5 text-purple-400" />
                <h2 className="text-lg font-semibold text-white tracking-tight">Context Window Load</h2>
            </div>

            <div className="grid grid-cols-2 gap-6">
                {/* Memory Gauge */}
                <div className="flex flex-col items-center justify-center relative group">
                    {/* Custom Tooltip */}
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 w-48">
                        <div className="bg-zinc-800 text-zinc-300 text-[10px] p-2 rounded shadow-xl border border-zinc-700 font-sans leading-tight relative text-center">
                            Active Node.js Heap Memory currently utilized by the Antigravity local engine.
                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-zinc-800 border-b border-r border-zinc-700 rotate-45"></div>
                        </div>
                    </div>

                    <div className="h-32 w-32 relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={memData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={40}
                                    outerRadius={55}
                                    startAngle={180}
                                    endAngle={0}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    <Cell fill="#a855f7" />
                                    <Cell fill="#3f3f46" />
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center mt-6">
                            <span className="text-2xl font-bold text-white font-mono">{memPercent}%</span>
                        </div>
                    </div>
                    <div className="text-xs text-zinc-500 font-mono mt-[-20px] bg-zinc-900 border border-zinc-800 px-2 py-1 rounded">
                        {memUsedMB}MB / {memTotalMB}MB
                    </div>
                </div>

                {/* Context Stats */}
                <div className="flex flex-col justify-center space-y-4">
                    <div className="p-3 bg-zinc-900/50 rounded-lg border border-zinc-800/50 flex justify-between items-center relative overflow-visible group">
                        {/* Custom Tooltip */}
                        <div className="absolute top-1/2 -translate-y-1/2 -left-52 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 w-48">
                            <div className="bg-zinc-800 text-zinc-300 text-[10px] p-2 rounded shadow-xl border border-zinc-700 font-sans leading-tight relative">
                                Number of isolated workspaces/directories currently being monitored for changes.
                                <div className="absolute top-1/2 -translate-y-1/2 -right-1 w-2 h-2 bg-zinc-800 border-t border-r border-zinc-700 rotate-45"></div>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Active Sessions</span>
                            <span className="text-lg font-mono text-zinc-200">{activeProjects}</span>
                        </div>
                        <MemoryStick className="w-5 h-5 text-zinc-600" />
                    </div>
                    <div className="p-3 bg-zinc-900/50 rounded-lg border border-zinc-800/50 flex justify-between items-center relative overflow-visible group">
                        {/* Custom Tooltip */}
                        <div className="absolute top-1/2 -translate-y-1/2 -left-52 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 w-48">
                            <div className="bg-zinc-800 text-zinc-300 text-[10px] p-2 rounded shadow-xl border border-zinc-700 font-sans leading-tight relative">
                                Total distinct active files injected into the LLM context window right now.
                                <div className="absolute top-1/2 -translate-y-1/2 -right-1 w-2 h-2 bg-zinc-800 border-t border-r border-zinc-700 rotate-45"></div>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Tracked Files</span>
                            <span className="text-lg font-mono text-zinc-200">{openFiles}</span>
                        </div>
                        <div className="w-5 h-5 flex items-center justify-center rounded-full bg-purple-500/20 text-purple-400 text-xs font-bold">
                            {openFiles}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
