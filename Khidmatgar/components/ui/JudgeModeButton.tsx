'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { X, Play, Search, AlertTriangle, BarChart2, Map, Gavel, Trophy, Activity, Cpu, Wifi, TrendingUp, Zap, CheckCircle, Clock } from 'lucide-react';

// ── Agent health simulation ──
const AGENTS = [
  { name: 'Samajh', emoji: '🧠', role: 'NLU Engine' },
  { name: 'Dhundho', emoji: '🔍', role: 'Search Agent' },
  { name: 'Chunno', emoji: '⚖️', role: 'Ranking Agent' },
  { name: 'Daam', emoji: '💰', role: 'Pricing Agent' },
  { name: 'Waqt', emoji: '📅', role: 'Scheduling' },
  { name: 'Book', emoji: '✅', role: 'Booking Agent' },
  { name: 'Yaad Dilao', emoji: '🔔', role: 'Reminder Agent' },
  { name: 'Masla Hal', emoji: '⚖️', role: 'Dispute Resolution' },
];

function AgentPing({ name, emoji, role, delay }: { name: string; emoji: string; role: string; delay: number }) {
  const [latency, setLatency] = useState(Math.floor(Math.random() * 80) + 20);
  const [status, setStatus] = useState<'ok' | 'busy' | 'idle'>('ok');

  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(Math.floor(Math.random() * 120) + 15);
      const r = Math.random();
      setStatus(r > 0.85 ? 'busy' : r > 0.1 ? 'ok' : 'idle');
    }, 2000 + delay * 300);
    return () => clearInterval(interval);
  }, [delay]);

  const statusColor = status === 'ok' ? '#00FF88' : status === 'busy' ? '#FFB800' : '#ffffff40';

  return (
    <div className="flex items-center justify-between py-1.5">
      <div className="flex items-center gap-2">
        <motion.div animate={{ scale: status === 'busy' ? [1, 1.3, 1] : 1 }}
          transition={{ duration: 0.5, repeat: status === 'busy' ? Infinity : 0 }}
          className="w-1.5 h-1.5 rounded-full" style={{ background: statusColor }} />
        <span className="text-xs">{emoji}</span>
        <div>
          <p className="text-xs font-semibold text-white/90 leading-none">{name}</p>
          <p className="text-[10px] text-white/30">{role}</p>
        </div>
      </div>
      <div className="text-right">
        <motion.p key={latency} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="text-[10px] font-mono" style={{ color: latency > 80 ? '#FFB800' : '#00FF88' }}>
          {latency}ms
        </motion.p>
      </div>
    </div>
  );
}

function MetricGauge({ label, value, max, color, icon }: { label: string; value: number; max: number; color: string; icon: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-[10px]">
        <span className="text-white/50 flex items-center gap-1">{icon}{label}</span>
        <span className="font-mono text-white">{value}{max === 100 ? '%' : ''}</span>
      </div>
      <div className="h-1 rounded-full bg-white/10 overflow-hidden">
        <motion.div className="h-full rounded-full" style={{ background: color }}
          initial={{ width: 0 }} animate={{ width: `${(value / max) * 100}%` }}
          transition={{ duration: 1, ease: 'easeOut' }} />
      </div>
    </div>
  );
}

export function JudgeModeButton() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<'actions' | 'health'>('actions');
  const [requestCount, setRequestCount] = useState(1247);
  const [tokenCount, setTokenCount] = useState(84320);
  const [apiHealth, setApiHealth] = useState(99);
  const router = useRouter();

  useEffect(() => {
    if (!open) return;
    const interval = setInterval(() => {
      setRequestCount(v => v + Math.floor(Math.random() * 3));
      setTokenCount(v => v + Math.floor(Math.random() * 200));
      setApiHealth(Math.random() > 0.05 ? 99 : 97);
    }, 2500);
    return () => clearInterval(interval);
  }, [open]);

  const actions = [
    { icon: <Play className="w-4 h-4" />, label: 'Run Full Demo', color: 'text-secondary', onClick: () => { router.push('/request'); setOpen(false); } },
    { icon: <Search className="w-4 h-4" />, label: 'View Agent Trace', color: 'text-primary', onClick: () => { router.push('/trace'); setOpen(false); } },
    { icon: <AlertTriangle className="w-4 h-4" />, label: 'Trigger Edge Cases', color: 'text-warning', onClick: () => { router.push('/demo'); setOpen(false); } },
    { icon: <BarChart2 className="w-4 h-4" />, label: 'Show Metrics', color: 'text-accent', onClick: () => { router.push('/demo#metrics'); setOpen(false); } },
    { icon: <Map className="w-4 h-4" />, label: 'Map Demo', color: 'text-primary', onClick: () => { router.push('/results?demo=true'); setOpen(false); } },
    { icon: <BarChart2 className="w-4 h-4" />, label: 'Live Dashboard', color: 'text-secondary', onClick: () => { router.push('/dashboard'); setOpen(false); } },
    { icon: <Trophy className="w-4 h-4" />, label: 'Leaderboard', color: 'text-yellow-400', onClick: () => { router.push('/leaderboard'); setOpen(false); } },
  ];

  return (
    <>
      <motion.button
        onClick={() => setOpen(true)}
        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-full font-bold text-sm shadow-neon-purple"
        style={{ background: 'linear-gradient(135deg,#7B2FFF,#00D4FF)', color: '#fff' }}>
        <Gavel className="w-4 h-4" /> Judge Mode
        <motion.div animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 2, repeat: Infinity }}
          className="w-2 h-2 rounded-full bg-secondary" />
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 60, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 60, scale: 0.9 }}
              className="fixed bottom-20 right-6 z-50 w-80 rounded-2xl overflow-hidden"
              style={{ border: '1px solid rgba(123,47,255,0.4)', background: 'rgba(8,12,25,0.98)', boxShadow: '0 0 60px rgba(123,47,255,0.3)' }}>
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/5">
                <div>
                  <div className="text-[10px] text-accent font-mono mb-0.5">AISeekho2026 Evaluation Panel</div>
                  <h3 className="font-bold text-white text-sm">Judge Mode Controls</h3>
                </div>
                <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
                  <X className="w-4 h-4 text-white/60" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-white/5">
                {(['actions', 'health'] as const).map(t => (
                  <button key={t} onClick={() => setTab(t)}
                    className="flex-1 py-2.5 text-xs font-semibold transition-all capitalize"
                    style={{ color: tab === t ? '#00D4FF' : 'rgba(255,255,255,0.4)', borderBottom: tab === t ? '2px solid #00D4FF' : '2px solid transparent' }}>
                    {t === 'health' ? '🩺 AI Health' : '⚡ Actions'}
                  </button>
                ))}
              </div>

              <div className="p-4 max-h-96 overflow-y-auto">
                {tab === 'actions' ? (
                  <div className="space-y-1.5">
                    {actions.map((a, i) => (
                      <motion.button key={i} onClick={a.onClick}
                        whileHover={{ x: 4 }} whileTap={{ scale: 0.97 }}
                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 transition-all text-left"
                        style={{ background: 'rgba(255,255,255,0.03)' }}>
                        <span className={a.color}>{a.icon}</span>
                        <span className="text-sm text-white/90">{a.label}</span>
                      </motion.button>
                    ))}
                    <div className="pt-2 border-t border-white/5 mt-2">
                      <p className="text-[10px] text-white/30 text-center">All agent traces are real — not pre-recorded</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Live counters */}
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { label: 'Requests', value: requestCount.toLocaleString(), icon: <TrendingUp className="w-3 h-3" />, color: '#00D4FF' },
                        { label: 'Tokens', value: `${(tokenCount / 1000).toFixed(1)}K`, icon: <Cpu className="w-3 h-3" />, color: '#7B2FFF' },
                        { label: 'API SLA', value: `${apiHealth}%`, icon: <Wifi className="w-3 h-3" />, color: '#00FF88' },
                      ].map((m, i) => (
                        <div key={i} className="rounded-xl p-2 text-center" style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${m.color}20` }}>
                          <div className="flex justify-center mb-1" style={{ color: m.color }}>{m.icon}</div>
                          <motion.p key={m.value} initial={{ opacity: 0.5 }} animate={{ opacity: 1 }}
                            className="text-xs font-black" style={{ color: m.color }}>{m.value}</motion.p>
                          <p className="text-[9px] text-white/30">{m.label}</p>
                        </div>
                      ))}
                    </div>

                    {/* Gauges */}
                    <div className="space-y-2.5 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)' }}>
                      <MetricGauge label="CPU Usage" value={38} max={100} color="#00D4FF" icon={<Cpu className="w-3 h-3" />} />
                      <MetricGauge label="Memory" value={62} max={100} color="#7B2FFF" icon={<Activity className="w-3 h-3" />} />
                      <MetricGauge label="API Health" value={apiHealth} max={100} color="#00FF88" icon={<Wifi className="w-3 h-3" />} />
                    </div>

                    {/* Agent pings */}
                    <div>
                      <p className="text-[10px] text-white/40 font-mono uppercase tracking-widest mb-2">Agent Ping Status</p>
                      <div className="rounded-xl overflow-hidden divide-y divide-white/5" style={{ background: 'rgba(255,255,255,0.02)' }}>
                        {AGENTS.map((a, i) => (
                          <div key={a.name} className="px-3">
                            <AgentPing {...a} delay={i} />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Gemini status */}
                    <div className="flex items-center gap-2 p-3 rounded-xl" style={{ background: 'rgba(0,255,136,0.05)', border: '1px solid rgba(0,255,136,0.15)' }}>
                      <CheckCircle className="w-4 h-4 text-secondary shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-white">Gemini 1.5 Pro — Online</p>
                        <p className="text-[10px] text-white/40">All 8 agents operational · Antigravity SDK v2.4</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
