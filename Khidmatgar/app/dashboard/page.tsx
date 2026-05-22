'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Activity, Users, Clock, Star, TrendingUp, Zap } from 'lucide-react';
import { mockProviders } from '@/lib/db/providers';

const LIVE_EVENTS = [
  { user: 'Ahmed R.', service: 'AC Repair', area: 'G-13', provider: 'Ali AC Services', status: 'En Route', time: '2 min ago', color: '#00D4FF' },
  { user: 'Sara M.', service: 'Tutoring', area: 'F-7', provider: 'Home Tutors Network', status: 'Completed', time: '5 min ago', color: '#00FF88' },
  { user: 'Bilal K.', service: 'Plumber', area: 'I-8', provider: 'Hassan Plumbing', status: 'Confirmed', time: '8 min ago', color: '#3B82F6' },
  { user: 'Fatima A.', service: 'Electrician', area: 'E-7', provider: 'Ustad Farooq', status: 'Booked', time: '12 min ago', color: '#FFB800' },
  { user: 'Usman T.', service: 'Carpenter', area: 'G-9', provider: 'Khan Carpentry', status: 'Completed', time: '18 min ago', color: '#D97706' },
];

const AGENT_LOG = [
  { time: '21:02:34', agent: 'Samajh', action: 'Parsed "AC kharab hai G-13" — confidence 0.91' },
  { time: '21:02:35', agent: 'Dhundho', action: 'Found 4 AC providers in G-11, G-13, G-9' },
  { time: '21:02:36', agent: 'Chunno', action: 'Ranked: Ali AC (94%) > Shah Brothers (90%) > Bilal AC (87%)' },
  { time: '21:02:37', agent: 'Daam', action: 'Price: PKR 1,850 (base 1500 + dist 200 + urgency 150)' },
  { time: '21:02:38', agent: 'Book Karo', action: 'Booking KHD-20260520-0347 created & confirmed' },
  { time: '21:02:38', agent: 'Yaad Dilao', action: '4 follow-up events scheduled' },
  { time: '21:07:11', agent: 'Samajh', action: 'Parsed "Bijli ka masla hai" — ELECTRICIAN, urgency=ASAP' },
  { time: '21:07:13', agent: 'Dhundho', action: 'Found 5 electricians — Ustad Farooq highest trust' },
];

const CAT_COLORS: Record<string, string> = { AC_REPAIR: '#00D4FF', ELECTRICIAN: '#FFB800', PLUMBER: '#3B82F6', TUTOR: '#7B2FFF', BEAUTICIAN: '#FF6B9D', CARPENTER: '#D97706' };

export default function DashboardPage() {
  const [feed, setFeed] = useState(LIVE_EVENTS);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 8000);
    return () => clearInterval(interval);
  }, []);

  // Compute stats
  const activeProviders = mockProviders.filter(p => p.is_active).length;
  const avgRating = (mockProviders.reduce((a, p) => a + p.rating, 0) / mockProviders.length).toFixed(1);

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Link href="/"><button className="p-2 glass rounded-xl hover:bg-white/10 transition-colors"><ArrowLeft className="w-5 h-5" /></button></Link>
            <div>
              <h1 className="text-2xl font-bold text-white">Live Dashboard</h1>
              <div className="flex items-center gap-2 text-xs text-white/50 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                Real-time · Admin View
              </div>
            </div>
          </div>
          <Link href="/request">
            <button className="px-5 py-2 rounded-xl font-semibold text-sm text-background"
              style={{ background: 'linear-gradient(135deg, #00D4FF, #00FF88)' }}>
              + New Booking
            </button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Today's Bookings", value: '47', icon: <Activity className="w-5 h-5 text-secondary" />, color: '#00FF88' },
            { label: 'Providers Active', value: String(activeProviders), icon: <Users className="w-5 h-5 text-primary" />, color: '#00D4FF' },
            { label: 'Avg Response Time', value: '8.3s', icon: <Clock className="w-5 h-5 text-warning" />, color: '#FFB800' },
            { label: 'Avg Rating', value: `${avgRating}★`, icon: <Star className="w-5 h-5 text-warning" />, color: '#FFB800' },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl p-5 border border-white/10">
              <div className="flex items-center justify-between mb-3">{s.icon}<span className="text-xs text-white/40 font-mono">LIVE</span></div>
              <div className="text-3xl font-extrabold" style={{ color: s.color }}>{s.value}</div>
              <div className="text-xs text-white/50 mt-1">{s.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Live Feed */}
          <div className="lg:col-span-2 glass rounded-2xl border border-white/10 overflow-hidden">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <h3 className="font-bold text-white flex items-center gap-2"><Activity className="w-4 h-4 text-secondary" />Live Booking Feed</h3>
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            </div>
            <div className="divide-y divide-white/5">
              {feed.map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3 p-4 hover:bg-white/3 transition-colors">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                    style={{ background: `${item.color}20`, color: item.color }}>{item.user[0]}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-white truncate">
                      <span className="font-semibold">{item.user}</span> · {item.service} in {item.area}
                    </div>
                    <div className="text-xs text-white/40">via {item.provider}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs px-2 py-1 rounded-full font-medium"
                      style={{ background: item.status === 'Completed' ? '#00FF8820' : item.status === 'En Route' ? '#00D4FF20' : '#FFB80020',
                               color: item.status === 'Completed' ? '#00FF88' : item.status === 'En Route' ? '#00D4FF' : '#FFB800' }}>
                      {item.status}
                    </div>
                    <div className="text-xs text-white/30 mt-1">{item.time}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Agent Log */}
          <div className="glass rounded-2xl border border-white/10 overflow-hidden">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <h3 className="font-bold text-white flex items-center gap-2"><Zap className="w-4 h-4 text-primary" />Agent Activity</h3>
            </div>
            <div className="p-3 space-y-2 overflow-y-auto max-h-96">
              {AGENT_LOG.map((log, i) => (
                <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                  className="text-xs font-mono">
                  <span className="text-white/30">{log.time} </span>
                  <span className="text-primary">[{log.agent}]</span>
                  <span className="text-white/60"> {log.action}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Provider Leaderboard */}
        <div className="mt-6 glass rounded-2xl border border-white/10 overflow-hidden">
          <div className="p-4 border-b border-white/10">
            <h3 className="font-bold text-white flex items-center gap-2"><TrendingUp className="w-4 h-4 text-warning" />Top Providers Leaderboard</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  {['#', 'Provider', 'Area', 'Service', 'Rating', 'Trust', 'Jobs', 'Status'].map(h => (
                    <th key={h} className="text-left p-3 text-white/40 font-mono text-xs uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mockProviders.sort((a, b) => b.trust_score - a.trust_score).slice(0, 8).map((p, i) => (
                  <tr key={p.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                    <td className="p-3 text-white/40 font-mono text-xs">{i + 1}</td>
                    <td className="p-3">
                      <div className="font-semibold text-white text-sm">{p.name}</div>
                      <div className="text-xs text-white/40">{p.phone}</div>
                    </td>
                    <td className="p-3 text-white/60 text-xs">{p.area}</td>
                    <td className="p-3">
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${CAT_COLORS[p.service_types[0]] || '#fff'}20`, color: CAT_COLORS[p.service_types[0]] || '#fff' }}>
                        {p.service_types[0]}
                      </span>
                    </td>
                    <td className="p-3 text-warning font-mono text-xs">{p.rating}★</td>
                    <td className="p-3 text-xs">
                      <span className={p.trust_score > 0.85 ? 'trust-high' : p.trust_score > 0.6 ? 'trust-medium' : 'trust-low'}>
                        {p.trust_score > 0.85 ? '✅ High' : p.trust_score > 0.6 ? '⚠️ Mid' : '🔴 Low'}
                      </span>
                    </td>
                    <td className="p-3 text-white/60 text-xs font-mono">{p.total_jobs}</td>
                    <td className="p-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${p.is_active ? 'bg-secondary/20 text-secondary' : 'bg-white/10 text-white/40'}`}>
                        {p.is_active ? 'Active' : 'Offline'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
