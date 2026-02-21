'use client';

import { Activity, Database, HardDrive, Clock } from 'lucide-react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface SystemHealthProps {
    systemHealth: any;
    history: any[];
}

export default function SystemHealth({ systemHealth, history }: SystemHealthProps) {
    if (!systemHealth) {
        return <div className="p-6 bg-zinc-950 border border-zinc-800/50 rounded-xl">Loading System DB...</div>;
    }

    const chartData = history.length > 0 ? history : [{ time: '0', value: 0 }];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            {/* Metric 1 */}
            <div className="bg-zinc-950 border border-zinc-800/50 rounded-xl p-5 relative overflow-visible group">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />

                {/* Custom Tooltip */}
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 w-48">
                    <div className="bg-zinc-800 text-zinc-300 text-[10px] p-2 rounded shadow-xl border border-zinc-700 font-sans leading-tight relative">
                        Aggregates the total number of unique conversational directories inside ~/.gemini/antigravity/brain/
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-zinc-800 border-b border-r border-zinc-700 rotate-45"></div>
                    </div>
                </div>

                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-sm font-medium text-zinc-400">Total Sessions</h3>
                    <Database className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-3xl font-bold text-white font-mono">{systemHealth.sessions.toLocaleString()}</div>
                <div className="text-xs text-emerald-400/80 mt-2 font-mono bg-emerald-500/10 inline-block px-2 py-1 rounded">Active lifetime</div>
            </div>

            {/* Metric 2 */}
            <div className="bg-zinc-950 border border-zinc-800/50 rounded-xl p-5 relative overflow-visible group">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />

                {/* Custom Tooltip */}
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 w-48">
                    <div className="bg-zinc-800 text-zinc-300 text-[10px] p-2 rounded shadow-xl border border-zinc-700 font-sans leading-tight relative">
                        Counts every saved architectural plan, code manipulation, and file read across all tracked local sessions.
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-zinc-800 border-b border-r border-zinc-700 rotate-45"></div>
                    </div>
                </div>

                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-sm font-medium text-zinc-400">Tracked Edits</h3>
                    <Activity className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="text-3xl font-bold text-white font-mono">{systemHealth.tracked_edits.toLocaleString()}</div>
                <div className="text-xs text-indigo-400/80 mt-2 font-mono bg-indigo-500/10 inline-block px-2 py-1 rounded">VibeCode ops</div>
            </div>

            {/* Metric 3 */}
            <div className="bg-zinc-950 border border-zinc-800/50 rounded-xl p-5 relative overflow-visible group">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />

                {/* Custom Tooltip */}
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 w-48">
                    <div className="bg-zinc-800 text-zinc-300 text-[10px] p-2 rounded shadow-xl border border-zinc-700 font-sans leading-tight relative">
                        Sums the total physical megabytes stored inside the telemetry.db SQLite and surrounding system log files.
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-zinc-800 border-b border-r border-zinc-700 rotate-45"></div>
                    </div>
                </div>

                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-sm font-medium text-zinc-400">DB Size</h3>
                    <HardDrive className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-3xl font-bold text-white font-mono">{systemHealth.total_size_mb} <span className="text-base text-zinc-500 ml-1">MB</span></div>
                <div className="text-xs text-amber-400/80 mt-2 font-mono bg-amber-500/10 inline-block px-2 py-1 rounded">Telemetry footprint</div>
            </div>

            {/* Metric 4 (Graph) */}
            <div className="bg-zinc-950 border border-zinc-800/50 rounded-xl p-5 relative overflow-visible group flex flex-col justify-between">
                {/* Custom Tooltip */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 w-48">
                    <div className="bg-zinc-800 text-zinc-300 text-[10px] p-2 rounded shadow-xl border border-zinc-700 font-sans leading-tight relative">
                        Measures the longest continuous execution window of the Antigravity engine without an idle timeout.
                        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-zinc-800 border-t border-l border-zinc-700 rotate-45"></div>
                    </div>
                </div>

                <div className="flex justify-between items-start z-10">
                    <h3 className="text-sm font-medium text-zinc-400">Longest Session</h3>
                    <Clock className="w-4 h-4 text-rose-400" />
                </div>
                <div className="text-3xl font-bold text-white font-mono z-10">{systemHealth.longest_session_min} <span className="text-base text-zinc-500 ml-1">mins</span></div>

                {/* Background sparkline */}
                <div className="absolute inset-x-0 bottom-0 h-16 opacity-30 group-hover:opacity-50 transition-opacity">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <Area type="monotone" dataKey="value" stroke="#f43f5e" fillOpacity={1} fill="url(#colorValue)" strokeWidth={2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
