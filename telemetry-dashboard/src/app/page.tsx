"use client"

import React, { useEffect, useState } from 'react';
import { TelemetryData } from '@/types/telemetry';
import {
  Activity,
  Brain,
  Code2,
  Database,
  FileCode2,
  Video,
  LayoutDashboard,
  Info
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';

export default function Dashboard() {
  const [data, setData] = useState<TelemetryData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/telemetry')
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      });
  }, []);

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-[#0F172A] text-[#F1F5F9] flex items-center justify-center font-mono">
        <div className="flex flex-col items-center border-4 border-[#3B82F6] p-8 shadow-[8px_8px_0px_#3B82F6]">
          <Brain className="w-16 h-16 text-[#3B82F6] mb-4 animate-bounce" />
          <h1 className="text-2xl font-bold uppercase tracking-widest">Loading Telemetry</h1>
        </div>
      </div>
    );
  }

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B'];

  const artifactData = [
    { name: 'Tasks', value: data.artifactsGenerated.tasks },
    { name: 'Plans', value: data.artifactsGenerated.plans },
    { name: 'Walkthroughs', value: data.artifactsGenerated.walkthroughs },
  ];

  return (
    <div className="min-h-screen bg-[#0F172A] text-[#F1F5F9] p-4 md:p-12 font-mono selection:bg-[#3B82F6] selection:text-white pb-24">
      {/* HEADER */}
      <header className="mb-16 border-b-4 border-[#1E293B] pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-4 flex items-center gap-4">
            <LayoutDashboard className="w-12 h-12 text-[#3B82F6]" />
            Meta-Telemetry
          </h1>
          <p className="text-lg text-[#94A3B8] max-w-2xl">
            Raw file-system heuristics. Bypassing opaque protocol buffers to deliver deterministic AI performance tracking.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-[#1E293B] px-6 py-3 border-2 border-[#3B82F6] shadow-[4px_4px_0px_#3B82F6]">
          <span className="relative flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full bg-[#10B981] opacity-75"></span>
            <span className="relative inline-flex h-4 w-4 bg-[#10B981]"></span>
          </span>
          <span className="text-sm font-bold uppercase tracking-widest text-[#10B981]">Live Synced</span>
        </div>
      </header>

      {/* METRICS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 mb-16">

        {/* Metric 1: Conversations */}
        <div className="bg-[#0F172A] border-4 border-[#1E293B] p-6 hover:border-[#3B82F6] transition-colors group relative shadow-[8px_8px_0px_#1E293B] hover:shadow-[12px_12px_0px_#3B82F6]">
          <div className="flex items-start justify-between mb-8">
            <h3 className="text-xl font-bold uppercase text-[#94A3B8] group-hover:text-[#F1F5F9] transition-colors">Sessions</h3>
            <Database className="w-8 h-8 text-[#3B82F6]" />
          </div>
          <div className="mb-4">
            <span className="text-6xl font-black tracking-tighter block mb-2">{data.conversations.count}</span>
            <div className="flex items-center gap-2 text-[#3B82F6] font-bold bg-[#1E293B] py-1 px-3 w-fit">
              <span>{data.conversations.totalSizeInMB} MB</span>
              <span className="text-xs text-[#94A3B8]">Footprint</span>
            </div>
          </div>
          <div className="text-sm text-[#64748B] mt-6 border-t-2 border-[#1E293B] pt-4 flex items-start gap-2 leading-relaxed">
            <Info className="w-4 h-4 mt-0.5 shrink-0" />
            <p>Calculated by counting the active <span className="text-[#F1F5F9]">.pb</span> protocol buffer files in your local antigravity/conversations directory.</p>
          </div>
        </div>

        {/* Metric 2: Code Edit Impact */}
        <div className="bg-[#0F172A] border-4 border-[#1E293B] p-6 hover:border-[#F59E0B] transition-colors group relative shadow-[8px_8px_0px_#1E293B] hover:shadow-[12px_12px_0px_#F59E0B]">
          <div className="flex items-start justify-between mb-8">
            <h3 className="text-xl font-bold uppercase text-[#94A3B8] group-hover:text-[#F1F5F9] transition-colors">Code Impact</h3>
            <Code2 className="w-8 h-8 text-[#F59E0B]" />
          </div>
          <div className="mb-4">
            <span className="text-6xl font-black tracking-tighter block mb-2">{data.trackedFileEdits}</span>
            <div className="flex items-center gap-2 text-[#F59E0B] font-bold bg-[#1E293B] py-1 px-3 w-fit">
              <span>{data.projectsTracked}</span>
              <span className="text-xs text-[#94A3B8]">Projects</span>
            </div>
          </div>
          <div className="text-sm text-[#64748B] mt-6 border-t-2 border-[#1E293B] pt-4 flex items-start gap-2 leading-relaxed">
            <Info className="w-4 h-4 mt-0.5 shrink-0" />
            <p>Monitors the local <span className="text-[#F1F5F9]">code_tracker/active</span> directory to measure exactly how many individual project files the AI has manipulated.</p>
          </div>
        </div>

        {/* Metric 3: Testing */}
        <div className="bg-[#0F172A] border-4 border-[#1E293B] p-6 hover:border-[#10B981] transition-colors group relative shadow-[8px_8px_0px_#1E293B] hover:shadow-[12px_12px_0px_#10B981]">
          <div className="flex items-start justify-between mb-8">
            <h3 className="text-xl font-bold uppercase text-[#94A3B8] group-hover:text-[#F1F5F9] transition-colors">UI Checks</h3>
            <Video className="w-8 h-8 text-[#10B981]" />
          </div>
          <div className="mb-4">
            <span className="text-6xl font-black tracking-tighter block mb-2">{data.browserRecordings}</span>
            <div className="flex items-center gap-2 text-[#10B981] font-bold bg-[#1E293B] py-1 px-3 w-fit">
              <span>Recordings</span>
            </div>
          </div>
          <div className="text-sm text-[#64748B] mt-6 border-t-2 border-[#1E293B] pt-4 flex items-start gap-2 leading-relaxed">
            <Info className="w-4 h-4 mt-0.5 shrink-0" />
            <p>Counts WebP browser recordings generated automatically during Playwright UI verification tasks.</p>
          </div>
        </div>

        {/* Metric 4: Peak Duration */}
        <div className="bg-[#0F172A] border-4 border-[#1E293B] p-6 hover:border-[#EF4444] transition-colors group relative shadow-[8px_8px_0px_#1E293B] hover:shadow-[12px_12px_0px_#EF4444]">
          <div className="flex items-start justify-between mb-8">
            <h3 className="text-xl font-bold uppercase text-[#94A3B8] group-hover:text-[#F1F5F9] transition-colors">Peak Focus</h3>
            <Activity className="w-8 h-8 text-[#EF4444]" />
          </div>
          <div className="mb-4">
            <span className="text-6xl font-black tracking-tighter block mb-2">{data.conversations.longestSessionMinutes}</span>
            <div className="flex items-center gap-2 text-[#EF4444] font-bold bg-[#1E293B] py-1 px-3 w-fit">
              <span>Minutes</span>
            </div>
          </div>
          <div className="text-sm text-[#64748B] mt-6 border-t-2 border-[#1E293B] pt-4 flex items-start gap-2 leading-relaxed">
            <Info className="w-4 h-4 mt-0.5 shrink-0" />
            <p>Derived by measuring the delta between file creation time and last modification time of the longest tracked active session.</p>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

        {/* CHART SECTION */}
        <div className="bg-[#0F172A] border-4 border-[#3B82F6] p-6 xl:col-span-1 shadow-[8px_8px_0px_#3B82F6] flex flex-col h-full">
          <h2 className="text-2xl font-black uppercase mb-2 flex items-center gap-3">
            <FileCode2 className="w-6 h-6 text-[#3B82F6]" />
            Artifact Ratio
          </h2>
          <p className="text-sm text-[#94A3B8] mb-8 pb-4 border-b-2 border-[#1E293B]">Analysis of Planning vs Execution logic artifacts generated in the AI Brain folder.</p>

          <div className="h-48 mb-6 flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={artifactData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={0}
                  dataKey="value"
                  stroke="#0F172A"
                  strokeWidth={4}
                >
                  {artifactData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1E293B', border: '2px solid #3B82F6', borderRadius: '0', fontFamily: 'monospace' }}
                  itemStyle={{ color: '#F1F5F9', fontWeight: 'bold' }}
                />
                <Legend verticalAlign="bottom" />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-auto">
            <div className="border-4 border-[#1E293B] p-2 text-center transition-colors">
              <span className="block mb-1">
                <span className="inline-block w-3 h-3 bg-[#3B82F6] mr-2"></span>
                <span className="text-white font-bold">{data.artifactsGenerated.tasks}</span>
              </span>
              <span className="block text-xs uppercase text-[#94A3B8] font-bold">Tasks</span>
            </div>
            <div className="border-4 border-[#1E293B] p-2 text-center transition-colors">
              <span className="block mb-1">
                <span className="inline-block w-3 h-3 bg-[#10B981] mr-2"></span>
                <span className="text-white font-bold">{data.artifactsGenerated.plans}</span>
              </span>
              <span className="block text-xs uppercase text-[#94A3B8] font-bold">Plans</span>
            </div>
            <div className="border-4 border-[#1E293B] p-2 text-center transition-colors">
              <span className="block mb-1">
                <span className="inline-block w-3 h-3 bg-[#F59E0B] mr-2"></span>
                <span className="text-white font-bold">{data.artifactsGenerated.walkthroughs}</span>
              </span>
              <span className="block text-xs uppercase text-[#94A3B8] font-bold">Walks</span>
            </div>
          </div>
        </div>

        {/* FEED SECTION */}
        <div className="bg-[#0F172A] border-4 border-[#1E293B] p-6 xl:col-span-2 shadow-[8px_8px_0px_#1E293B] h-full flex flex-col">
          <h2 className="text-2xl font-black uppercase mb-2 flex items-center gap-3">
            <Activity className="w-6 h-6 text-[#94A3B8]" />
            Agent Activity Log
          </h2>
          <p className="text-sm text-[#94A3B8] mb-8 border-b-2 border-[#1E293B] pb-4">Chronological feed of isolated file operations and session initiations over the last 7 days.</p>

          <div className="flex-1 overflow-y-auto pr-4 space-y-4 custom-scrollbar lg:max-h-[380px]">
            {data.recentActivity && data.recentActivity.length > 0 ? (
              data.recentActivity.map((activity, idx) => (
                <div key={idx} className="flex flex-col md:flex-row md:items-center gap-4 bg-[#1E293B] p-4 border-l-8 hover:bg-[#334155] cursor-default transition-colors" style={{ borderLeftColor: activity.type === 'Session' ? '#3B82F6' : '#F59E0B' }}>
                  <div className="hidden md:block shrink-0">
                    {activity.type === 'Session' ? <Database className="w-8 h-8 text-[#3B82F6]" /> : <Code2 className="w-8 h-8 text-[#F59E0B]" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-bold text-white mb-1 truncate">{activity.name}</p>
                    <p className="text-xs text-[#94A3B8] uppercase tracking-wider">{new Date(activity.date).toLocaleString()}</p>
                  </div>
                  <div className="shrink-0 text-xs font-bold uppercase tracking-widest px-4 py-2 bg-[#0F172A] text-[#F1F5F9] border-2 border-[#475569]">
                    {activity.type}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 border-2 border-dashed border-[#1E293B] h-full flex flex-col items-center justify-center">
                <Brain className="w-12 h-12 mx-auto mb-4 text-[#1E293B]" />
                <p className="font-bold text-[#94A3B8] uppercase tracking-widest">Awaiting Synapse Activity</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
