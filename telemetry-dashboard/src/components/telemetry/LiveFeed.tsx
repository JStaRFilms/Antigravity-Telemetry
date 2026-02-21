'use client';

import { Terminal, Activity } from 'lucide-react';
import { useEffect, useRef } from 'react';

export default function LiveFeed({ activity = [] }: { activity: any[] }) {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [activity]);

    return (
        <div className="flex flex-col h-full bg-zinc-950 border border-zinc-800/50 rounded-xl overflow-hidden shadow-2xl relative group">
            {/* Glass header */}
            <div className="absolute top-0 w-full h-12 bg-zinc-900/80 backdrop-blur-md border-b border-zinc-800/80 flex items-center px-4 justify-between z-10">
                <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm font-medium text-zinc-100 font-mono tracking-tight">Antigravity Internal Stream</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Live</span>
                </div>
            </div>

            {/* Scrolling body */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto pt-16 pb-4 px-4 space-y-3 font-mono text-xs text-zinc-400 no-scrollbar"
            >
                {activity.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-zinc-600 gap-3 opacity-50">
                        <Activity className="w-8 h-8 animate-pulse" />
                        <p>Awaiting engine ignition...</p>
                    </div>
                ) : (
                    activity.map((item, i) => (
                        <div key={i} className="flex gap-3 hover:bg-zinc-900/50 p-2 rounded-md transition-colors border border-transparent hover:border-zinc-800/50">
                            <span className="text-zinc-600 flex-shrink-0">
                                {new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                            </span>
                            <div className="flex flex-col">
                                <span className="text-emerald-500/80 font-semibold">{item.file}</span>
                                <span className="text-zinc-300 leading-relaxed mt-1 line-clamp-3">{item.content}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Fade out bottom overlay */}
            <div className="absolute bottom-0 w-full h-8 bg-gradient-to-t from-zinc-950 to-transparent pointer-events-none" />
        </div>
    );
}
