'use client';

import React, { useEffect, useState } from 'react';
import { LayoutDashboard, Radio } from 'lucide-react';
import SystemHealth from '@/components/telemetry/SystemHealth';
import ContextGauge from '@/components/telemetry/ContextGauge';
import TaskTracker from '@/components/telemetry/TaskTracker';
import LiveFeed from '@/components/telemetry/LiveFeed';

export default function Dashboard() {
  const [systemHealth, setSystemHealth] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [conversation, setConversation] = useState<any>(null);
  const [codeTracker, setCodeTracker] = useState<any>(null);
  const [environment, setEnvironment] = useState<any>(null);
  const [connected, setConnected] = useState(false);

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/telemetry/history');
      const data = await res.json();
      const formatted = data.map((item: any) => ({
        time: new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        value: item.longestSessionMin || item.tasks || 0
      }));
      setHistory(formatted);
    } catch (e) {
      console.error("Failed to fetch history:", e);
    }
  };

  useEffect(() => {
    // Connect to the new SSE Stream 
    const evtSource = new EventSource('/api/telemetry/stream');

    evtSource.onopen = () => {
      setConnected(true);
    };

    evtSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        switch (data.type) {
          case 'FULL_STATE':
            setSystemHealth(data.systemHealth);
            setConversation(data.conversation);
            setCodeTracker(data.codeTracker);
            setEnvironment(data.environment);
            break;
          case 'SYSTEM_HEALTH_UPDATE':
            setSystemHealth(data.systemHealth);
            break;
          case 'CONVERSATION_UPDATE':
            setConversation(data.conversation);
            break;
          case 'PING':
            setEnvironment(data.environment);
            break;
        }
      } catch (e) {
        console.error("Failed to parse SSE data", e);
      }
    };

    evtSource.onerror = (error) => {
      console.error("EventSource failed:", error);
      setConnected(false);
      // EventSource auto-reconnects natively
    };

    fetchHistory();
    // Fallback manual poll every 5s if SSE is being weird or disconnected
    const pollInterval = setInterval(() => {
      fetchHistory();
      if (!connected) {
        console.log("SSE Disconnected. Attempting manual state poll...");
        fetch('/api/telemetry').then(r => r.json()).then(data => {
          setSystemHealth(data.systemHealth);
          setConversation(data.conversation);
          setCodeTracker(data.codeTracker);
          setEnvironment(data.environment);
        }).catch(e => console.error("Poll failed", e));
      }
    }, 5000);

    return () => {
      evtSource.close();
      clearInterval(pollInterval);
    };
  }, [connected]);

  return (
    <div className="h-screen overflow-hidden bg-zinc-950 text-zinc-100 p-4 font-sans selection:bg-emerald-500/30 flex flex-col">
      {/* HEADER */}
      <header className="shrink-0 mb-4 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-800/80 pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2 flex items-center gap-3">
            <LayoutDashboard className="w-8 h-8 text-emerald-400" />
            Antigravity Telemetry
          </h1>
          <p className="text-sm text-zinc-400 max-w-2xl leading-relaxed">
            Real-time visual abstraction of raw internal VibeCoding states, bypassing protocol buffers to stream live LLM operations via Server-Sent Events.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-zinc-900/50 px-4 py-2 rounded-lg border border-zinc-800 backdrop-blur-sm">
          <Radio className={`w-4 h-4 ${connected ? 'text-emerald-400 animate-pulse' : 'text-rose-500'}`} />
          <span className={`text-xs font-mono uppercase tracking-widest font-semibold ${connected ? 'text-emerald-400' : 'text-rose-500'}`}>
            {connected ? 'Live Feed Connected' : 'Reconnecting...'}
          </span>
        </div>
      </header>

      {/* MAIN DASHBOARD GRID */}
      <div className="flex-1 flex flex-col xl:flex-row gap-4 min-h-0">

        {/* LEFT COLUMN: Metrics & Task Control */}
        <div className="w-full xl:w-7/12 flex flex-col gap-4">
          {/* Top row: System Health spans full width of this column */}
          <SystemHealth systemHealth={systemHealth} history={history} />

          {/* Bottom row: split between Context Gauge and Task Tracker */}
          <div className="flex flex-col md:flex-row gap-4 flex-1 min-h-0">
            <div className="w-full md:w-1/2 flex flex-col">
              <ContextGauge environment={environment} codeTracker={codeTracker} />
            </div>
            <div className="w-full md:w-1/2 flex flex-col">
              <TaskTracker conversation={conversation} />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Terminal Live Feed */}
        <div className="w-full xl:w-5/12 h-full min-h-0 flex flex-col">
          <LiveFeed activity={conversation?.recentActivity || []} />
        </div>

      </div>
    </div>
  );
}
