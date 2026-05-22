'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Play, CheckCircle, X, Clock, Zap, AlertTriangle } from 'lucide-react';

const SCENARIOS = [
  {
    id: 1, title: 'Standard Happy Path', icon: '✅',
    input: 'Mujhe kal subah G-13 mein AC technician chahiye',
    description: 'Complete agentic flow — intent → match → book → followup',
    color: '#00FF88',
  },
  {
    id: 2, title: 'No Provider Available', icon: '⚠️',
    input: '3 AM emergency plumber Bani Gala',
    description: 'No provider found → waitlist offer + 3 alternative slots',
    color: '#FFB800',
  },
  {
    id: 3, title: 'Ambiguous Input', icon: '🤔',
    input: 'kuch theek nahi ho raha ghar mein',
    description: 'Confidence 38% → AI asks clarification in Roman Urdu',
    color: '#7B2FFF',
  },
  {
    id: 4, title: 'Provider Cancels', icon: '❌',
    input: 'AC kharab hai urgent G-9 abhi',
    description: 'After booking, provider cancels → auto-reschedule with discount',
    color: '#FF3B5C',
  },
  {
    id: 5, title: 'Double Booking Conflict', icon: '🔀',
    input: 'Electrician chahiye F-10 kal 9 baje',
    description: 'Same provider same slot → first user confirmed, second offered next slot',
    color: '#00D4FF',
  },
  {
    id: 6, title: 'Dispute Flow', icon: '⚖️',
    input: 'Plumber F-7 kal subah 10 baje',
    description: 'Post-service 1★ rating → dispute classification → auto-resolution',
    color: '#FF6B9D',
  },
];

const METRICS = [
  { label: 'Time to Resolution', simple: '45 min', agentic: '<10 sec', winner: 'agentic' },
  { label: 'User Steps Required', simple: '7 steps', agentic: '1 step', winner: 'agentic' },
  { label: 'Provider Match Accuracy', simple: 'Random', agentic: '94% match', winner: 'agentic' },
  { label: 'Confirmation', simple: 'Uncertain', agentic: 'Guaranteed', winner: 'agentic' },
  { label: 'Live Tracking', simple: '✗ None', agentic: '✓ Real-time', winner: 'agentic' },
  { label: 'Follow-up Automation', simple: '✗ Manual', agentic: '✓ 5 auto events', winner: 'agentic' },
  { label: 'Dispute Resolution', simple: '✗ WhatsApp chaos', agentic: '✓ Auto-classified', winner: 'agentic' },
  { label: 'Multilingual Support', simple: '✗ None', agentic: '✓ Urdu/Roman/EN', winner: 'agentic' },
];

export default function DemoPage() {
  const [active, setActive] = useState<number | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const runScenario = async (scenario: typeof SCENARIOS[0]) => {
    setActive(scenario.id);
    setResult(null);
    setLoading(true);
    try {
      const res = await fetch('/api/orchestrator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userInput: scenario.input }),
      });
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let finalState: any = null;
      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const parts = buffer.split('\n\n');
          buffer = parts.pop() ?? '';
          for (const part of parts) {
            const line = part.trim();
            if (!line.startsWith('data: ')) continue;
            const data = line.slice(6).trim();
            if (data === '[DONE]') break;
            try { const p = JSON.parse(data); if (p.state) finalState = p.state; } catch {}
          }
        }
      }
      if (finalState?.booking_record) {
        setResult(`✅ Booking confirmed: ${finalState.booking_record.booking_id}`);
      } else if (finalState?.intent?.clarification_needed) {
        setResult(`🤔 Clarification needed: ${finalState.intent.clarification_needed}`);
      } else {
        setResult('⚠️ No booking — see agent trace for details');
      }
    } catch (e: any) {
      setResult(`❌ Error: ${e.message}`);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <button className="p-2 glass rounded-xl hover:bg-white/10 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">Stress Test & Demo</h1>
            <p className="text-white/50 text-sm">Edge case scenarios + baseline comparison</p>
          </div>
        </div>

        {/* Scenarios Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {SCENARIOS.map((s) => (
            <motion.div key={s.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className={`glass rounded-2xl p-5 border cursor-pointer transition-all ${active === s.id ? 'border-opacity-80' : 'border-white/10 hover:border-white/20'}`}
              style={{ borderColor: active === s.id ? s.color : undefined }}>
              <div className="flex items-start justify-between mb-3">
                <span className="text-2xl">{s.icon}</span>
                <span className="text-xs font-mono px-2 py-1 rounded-full" style={{ background: `${s.color}20`, color: s.color }}>
                  Scenario {s.id}
                </span>
              </div>
              <h3 className="font-bold text-white mb-1">{s.title}</h3>
              <p className="text-white/50 text-sm mb-3">{s.description}</p>
              <div className="text-xs font-mono bg-black/30 rounded-lg p-2 text-white/60 mb-4 break-all">"{s.input}"</div>
              <motion.button
                onClick={() => runScenario(s)}
                disabled={loading && active === s.id}
                whileTap={{ scale: 0.97 }}
                className="w-full py-2 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all"
                style={{ background: `${s.color}20`, color: s.color, border: `1px solid ${s.color}40` }}>
                {loading && active === s.id ? (
                  <><span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />Running...</>
                ) : (
                  <><Play className="w-3 h-3" /> Run Scenario</>
                )}
              </motion.button>
              {active === s.id && result && !loading && (
                <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                  className="mt-3 text-xs p-2 rounded-lg bg-black/30 text-white/70 break-all">
                  {result}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Baseline Comparison */}
        <div id="metrics">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-8">
            <span className="text-xs font-mono text-warning uppercase tracking-widest">Judge Evaluation</span>
            <h2 className="text-2xl md:text-3xl font-extrabold mt-2 text-white">
              Simple App vs <span className="text-gradient">Khedmatgar AI</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Simple App */}
            <div className="glass rounded-2xl p-6 border border-danger/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-danger/20 flex items-center justify-center"><X className="w-5 h-5 text-danger" /></div>
                <div><h3 className="font-bold text-white">Without Khedmatgar AI</h3><p className="text-xs text-white/50">WhatsApp-based manual booking</p></div>
              </div>
              <ol className="space-y-2">
                {["User posts in WhatsApp group: 'koi AC wala hai?'","Waits 30+ minutes for replies","Gets 3 random numbers, calls each","2 don't answer, 1 is too expensive","Finally books manually after 45 min","No confirmation, no tracking, no receipt","Follows up manually next day"].map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-white/60">
                    <X className="w-3 h-3 text-danger mt-0.5 shrink-0" />{s}
                  </li>
                ))}
              </ol>
              <div className="mt-4 pt-4 border-t border-white/10 flex gap-4 text-sm">
                <div className="flex items-center gap-1 text-danger"><Clock className="w-4 h-4" />45 min</div>
                <div className="flex items-center gap-1 text-danger"><Zap className="w-4 h-4" />7 manual steps</div>
                <div className="flex items-center gap-1 text-danger"><AlertTriangle className="w-4 h-4" />Uncertain</div>
              </div>
            </div>

            {/* Khedmatgar AI */}
            <div className="glass rounded-2xl p-6 border border-secondary/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center"><CheckCircle className="w-5 h-5 text-secondary" /></div>
                <div><h3 className="font-bold text-white">With Khedmatgar AI</h3><p className="text-xs text-white/50">8-agent automated orchestration</p></div>
              </div>
              <ol className="space-y-2">
                {["User types in Urdu/Roman Urdu/English","Samajh Agent extracts intent in <1 sec","Dhundho Agent finds 8 nearby providers","Chunno Agent ranks by 7 factors in <2 sec","Daam Agent calculates fair price","Waqt Agent confirms best time slot","Booking created, WhatsApp + email sent","Follow-up reminders scheduled automatically"].map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-white/70">
                    <CheckCircle className="w-3 h-3 text-secondary mt-0.5 shrink-0" />{s}
                  </li>
                ))}
              </ol>
              <div className="mt-4 pt-4 border-t border-white/10 flex gap-4 text-sm">
                <div className="flex items-center gap-1 text-secondary"><Clock className="w-4 h-4" />&lt;10 sec</div>
                <div className="flex items-center gap-1 text-secondary"><Zap className="w-4 h-4" />1 user action</div>
                <div className="flex items-center gap-1 text-secondary"><CheckCircle className="w-4 h-4" />Guaranteed</div>
              </div>
            </div>
          </div>

          {/* Metrics Table */}
          <div className="glass rounded-2xl border border-white/10 overflow-hidden">
            <div className="p-4 border-b border-white/10"><h3 className="font-bold text-white">Detailed Metrics Comparison</h3></div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left p-4 text-white/60 font-mono text-xs uppercase">Metric</th>
                    <th className="text-center p-4 text-danger font-semibold">Simple App</th>
                    <th className="text-center p-4 text-secondary font-semibold">Khedmatgar AI</th>
                  </tr>
                </thead>
                <tbody>
                  {METRICS.map((m, i) => (
                    <tr key={i} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                      <td className="p-4 text-white/70">{m.label}</td>
                      <td className="p-4 text-center text-danger/80">{m.simple}</td>
                      <td className="p-4 text-center text-secondary font-semibold">{m.agentic}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
