'use client';

import { useState } from 'react';
import { ListTodo, CheckCircle2, CircleDashed, ChevronDown, ChevronUp } from 'lucide-react';

interface TaskTrackerProps {
    conversation: any;
}

export default function TaskTracker({ conversation }: TaskTrackerProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const rawTask = conversation?.rawTask || '';

    // Very rough parsing of the task.md artifact
    const lines = rawTask.split('\n');
    const allTasks = lines.filter((l: string) => l.includes('[ ]') || l.includes('[/]') || l.includes('[x]'));
    const completed = allTasks.filter((l: string) => l.includes('[x]')).length;
    const inProgress = allTasks.filter((l: string) => l.includes('[/]')).length;
    const total = allTasks.length;

    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return (
        <div className="bg-zinc-950 border border-zinc-800/50 rounded-xl p-6 shadow-2xl flex flex-col justify-between">
            <div className="flex justify-between items-center mb-6 relative group overflow-visible">
                {/* Custom Tooltip */}
                <div className="absolute -top-12 left-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 w-64">
                    <div className="bg-zinc-800 text-zinc-300 text-[10px] p-3 rounded shadow-xl border border-zinc-700 font-sans leading-relaxed relative">
                        Parses the hidden <span className="text-zinc-100 font-mono">task.md</span> blueprint generated locally in the active session's <span className="text-zinc-100 font-mono">brain/</span> directory to visually reflect the VibeCoding LLM's exact reasoning and execution checkboxes.
                        <div className="absolute -bottom-1 left-6 w-2 h-2 bg-zinc-800 border-b border-r border-zinc-700 rotate-45"></div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <ListTodo className="w-5 h-5 text-blue-400" />
                    <h2 className="text-lg font-semibold text-white tracking-tight cursor-help">Active Operation</h2>
                </div>
                <span className="text-xs font-mono bg-blue-500/10 text-blue-400 px-2 py-1 rounded-full border border-blue-500/20">
                    {completed}/{total} Steps
                </span>
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-end mb-2">
                    <span className="text-4xl font-bold text-white font-mono tracking-tighter">{percentage}%</span>
                    <span className="text-sm text-zinc-500 mb-1">Completion Protocol</span>
                </div>

                {/* Custom animated progress bar */}
                <div className="w-full h-3 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800/80 relative">
                    <div
                        className="absolute top-0 left-0 h-full bg-blue-500 transition-all duration-1000 ease-in-out relative flex items-center justify-end pr-1"
                        style={{ width: `${Math.max(percentage, 5)}%` }}
                    >
                        <div className="w-1.5 h-1.5 bg-white rounded-full opacity-70 shadow-[0_0_8px_2px_rgba(255,255,255,0.8)]" />
                    </div>
                </div>
            </div>

            <div className={`mt-8 space-y-3 ${isExpanded ? 'overflow-y-auto max-h-[300px] pr-2 no-scrollbar' : ''}`}>
                <h3 className="text-xs text-zinc-500 uppercase tracking-widest font-semibold mb-4 sticky top-0 bg-zinc-950 pb-2 z-10">
                    Current Vector
                </h3>
                {(isExpanded ? allTasks : allTasks.slice(0, 3)).map((task: string, i: number) => {
                    const isDone = task.includes('[x]');
                    const isDoing = task.includes('[/]');
                    const cleanText = task.replace(/\[[ \/x]\]/g, '').trim().replace(/`/g, '');

                    return (
                        <div key={i} className={`flex items-start gap-3 text-sm ${isDone ? 'opacity-50' : 'opacity-100'}`}>
                            {isDone ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                            ) : isDoing ? (
                                <div className="w-4 h-4 rounded-full border-2 border-blue-500 border-t-transparent animate-spin mt-0.5 flex-shrink-0" />
                            ) : (
                                <CircleDashed className="w-4 h-4 text-zinc-600 mt-0.5 flex-shrink-0" />
                            )}
                            <span className={`font-mono leading-tight ${isDone ? 'text-zinc-500 line-through' : isDoing ? 'text-blue-200 font-medium' : 'text-zinc-400'}`}>
                                {cleanText}
                            </span>
                        </div>
                    );
                })}
                {allTasks.length > 3 && (
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="flex items-center gap-1 text-xs text-zinc-500 hover:text-blue-400 font-mono mt-3 ml-7 transition-colors group"
                    >
                        {isExpanded ? (
                            <>
                                <ChevronUp className="w-3 h-3 group-hover:-translate-y-0.5 transition-transform" />
                                Collapse subroutines
                            </>
                        ) : (
                            <>
                                <ChevronDown className="w-3 h-3 group-hover:translate-y-0.5 transition-transform" />
                                ... {allTasks.length - 3} more subroutines
                            </>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}
