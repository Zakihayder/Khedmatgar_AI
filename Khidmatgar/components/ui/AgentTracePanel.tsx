'use client';
import { AgentStep, OrchestratorState } from '@/lib/agents/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, CheckCircle2, ChevronDown, ChevronUp, Loader2, AlertTriangle, Download, Zap } from 'lucide-react';
import { useState } from 'react';

const AGENT_META: Record<string, { emoji: string; color: string; desc: string }> = {
  Samajh:     { emoji: '🧠', color: '#7B2FFF', desc: 'Intent & Language Parser' },
  Dhundho:    { emoji: '🔍', color: '#00D4FF', desc: 'Provider Discovery Agent' },
  Chunno:     { emoji: '⚖️', color: '#00FF88', desc: 'Multi-Factor Ranking' },
  Daam:       { emoji: '💰', color: '#FFB800', desc: 'Dynamic Pricing Engine' },
  Waqt:       { emoji: '📅', color: '#00D4FF', desc: 'Schedule Optimizer' },
  'Book Karo':{ emoji: '✅', color: '#00FF88', desc: 'Booking Executor' },
  'Yaad Dilao':{ emoji: '🔔', color: '#FF6B9D', desc: 'Follow-up Automation' },
  Orchestrator:{ emoji: '⚡', color: '#FF3B5C', desc: 'Error Handler' },
};

function statusColor(s: string) {
  if (s === 'SUCCESS') return '#00FF88';
  if (s === 'RUNNING') return '#FFB800';
  if (s === 'FAILED') return '#FF3B5C';
  return 'rgba(255,255,255,0.3)';
}

export function AgentTracePanel({ state, isRunning }: { state: OrchestratorState | null; isRunning: boolean }) {
  const [expanded, setExpanded] = useState<number | null>(null);

  const exportTrace = () => {
    if (!state) return;
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `khedmatgar_trace_${state.request_id}.json`; a.click();
  };

  if (!state) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-black/20">
        <motion.div animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.8, 0.5] }} transition={{ duration: 2, repeat: Infinity }}>
          <Brain className="w-16 h-16 text-primary/40 mb-4 mx-auto" />
        </motion.div>
        <h3 className="text-base font-bold text-white/40">Agent Reasoning — Live</h3>
        <p className="text-xs text-white/25 mt-2 max-w-48">Submit a request to watch the Antigravity engine reason in real-time</p>
        <div className="mt-6 space-y-2 w-full max-w-48">
          {Object.entries(AGENT_META).slice(0, 5).map(([name, meta]) => (
            <div key={name} className="flex items-center gap-2 text-xs text-white/20">
              <span>{meta.emoji}</span>
              <span className="font-mono">{name}</span>
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-white/15">idle</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-black/20 overflow-hidden">
      {/* Header */}
      <div className="p-3 border-b border-white/10 bg-black/30 backdrop-blur-md flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <motion.div animate={isRunning ? { rotate: 360 } : {}} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>
            <Zap className={`w-4 h-4 ${isRunning ? 'text-warning' : 'text-secondary'}`} />
          </motion.div>
          <div>
            <h3 className="font-bold text-xs text-white">Antigravity Engine</h3>
            <p className="text-[10px] text-white/40 font-mono">{state.request_id}</p>
          </div>
          {isRunning && (
            <span className="ml-1 text-[10px] text-warning font-mono animate-pulse px-2 py-0.5 bg-warning/10 rounded-full">
              LIVE
            </span>
          )}
        </div>
        <button onClick={exportTrace} title="Export trace JSON"
          className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-primary transition-all">
          <Download className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Steps */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        <AnimatePresence>
          {state.steps.map((step, idx) => {
            const meta = AGENT_META[step.agent] || { emoji: '🔧', color: '#ffffff60', desc: '' };
            const sColor = statusColor(step.status);
            return (
              <motion.div key={`${step.agent}-${idx}`}
                initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.03 }}
                className="rounded-xl border overflow-hidden"
                style={{ borderColor: `${sColor}30`, background: `${sColor}05` }}>

                {/* Step header */}
                <div className="flex items-start gap-2 p-3">
                  <div className="w-0.5 self-stretch rounded-full shrink-0 mt-0.5" style={{ background: sColor }} />
                  <span className="text-base leading-none mt-0.5">{meta.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-mono font-bold" style={{ color: meta.color }}>[{step.agent}]</span>
                      <span className="text-xs text-white/70">{step.action}</span>
                    </div>
                    {step.reasoning && (
                      <p className="text-[11px] text-white/55 mt-1 leading-relaxed">{step.reasoning}</p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    {step.status === 'RUNNING' && <Loader2 className="w-3 h-3 text-warning animate-spin" />}
                    {step.status === 'SUCCESS' && <CheckCircle2 className="w-3 h-3 text-secondary" />}
                    {step.status === 'FAILED' && <AlertTriangle className="w-3 h-3 text-danger" />}
                    {step.duration_ms && (
                      <span className="text-[9px] text-white/30 font-mono">{step.duration_ms}ms</span>
                    )}
                  </div>
                </div>

                {/* JSON expand */}
                {step.result && (
                  <div className="border-t border-white/5">
                    <button onClick={() => setExpanded(expanded === idx ? null : idx)}
                      className="w-full flex items-center justify-between px-3 py-1.5 text-[10px] text-white/40 hover:text-primary hover:bg-white/5 transition-all">
                      <span className="font-mono">View JSON output</span>
                      {expanded === idx ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                    <AnimatePresence>
                      {expanded === idx && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                          <pre className="px-3 pb-3 text-[10px] font-mono text-secondary overflow-x-auto max-h-40 bg-black/30">
                            {JSON.stringify(step.result, null, 2)}
                          </pre>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Running pulsing dots */}
        {isRunning && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex items-center gap-2 px-3 py-2">
            <div className="flex gap-1">
              {[0, 1, 2].map(i => (
                <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-primary"
                  animate={{ y: [0, -6, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }} />
              ))}
            </div>
            <span className="text-[10px] text-white/40 font-mono">Agent thinking...</span>
          </motion.div>
        )}

        {/* Summary if done */}
        {!isRunning && state.steps.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="rounded-xl p-3 bg-secondary/5 border border-secondary/20 text-[10px] font-mono text-secondary/80 space-y-1">
            <div>✓ {state.steps.filter(s => s.status === 'SUCCESS').length} agents completed</div>
            <div>⏱ Total: {state.steps.reduce((a, s) => a + (s.duration_ms || 0), 0)}ms</div>
            {state.booking_record && <div>📋 Booking: {state.booking_record.booking_id}</div>}
          </motion.div>
        )}
      </div>
    </div>
  );
}
