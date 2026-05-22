'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Shield, Clock, TrendingUp, Zap, Filter, ArrowLeft, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { mockProviders, Provider } from '@/lib/db/providers';
import { ParticleBackground } from '@/components/ui/ParticleBackground';

const SERVICE_FILTERS = [
  { key: 'ALL', label: 'All Services', color: '#ffffff' },
  { key: 'AC_REPAIR', label: 'AC Repair', color: '#00D4FF' },
  { key: 'ELECTRICIAN', label: 'Electrician', color: '#FFB800' },
  { key: 'PLUMBER', label: 'Plumber', color: '#3B82F6' },
  { key: 'TUTOR', label: 'Tutor', color: '#7B2FFF' },
  { key: 'BEAUTICIAN', label: 'Beautician', color: '#FF6B9D' },
  { key: 'CARPENTER', label: 'Carpenter', color: '#D97706' },
];

const TIER_CONFIG = [
  { rank: 1, icon: '🥇', gradient: 'linear-gradient(135deg,#FFD700,#FF8C00)', glow: 'rgba(255,215,0,0.3)' },
  { rank: 2, icon: '🥈', gradient: 'linear-gradient(135deg,#C0C0C0,#808080)', glow: 'rgba(192,192,192,0.2)' },
  { rank: 3, icon: '🥉', gradient: 'linear-gradient(135deg,#CD7F32,#8B4513)', glow: 'rgba(205,127,50,0.2)' },
];

function ScoreBar({ value, max = 100, color }: { value: number; max?: number; color: string }) {
  return (
    <div className="h-1.5 rounded-full bg-white/10 overflow-hidden w-full">
      <motion.div className="h-full rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${(value / max) * 100}%` }}
        transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
        style={{ background: color }} />
    </div>
  );
}

function ProviderCard({ provider, rank, delay }: { provider: Provider; rank: number; delay: number }) {
  const tier = TIER_CONFIG.find(t => t.rank === rank);
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="relative rounded-2xl p-5 overflow-hidden group"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: tier ? `1px solid ${tier.glow.replace('0.', '0.4 ')}` : '1px solid rgba(255,255,255,0.08)',
        boxShadow: tier ? `0 0 30px ${tier.glow}` : 'none',
      }}>
      {/* Rank badge */}
      <div className="absolute top-4 right-4 flex items-center gap-1.5">
        {tier ? (
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-lg"
            style={{ background: tier.gradient }}>
            {tier.icon}
          </div>
        ) : (
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black text-white/60"
            style={{ background: 'rgba(255,255,255,0.08)' }}>
            #{rank}
          </div>
        )}
      </div>

      {/* Provider info */}
      <div className="flex items-start gap-3 mb-4">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl shrink-0"
          style={{ background: 'rgba(123,47,255,0.15)', border: '1px solid rgba(123,47,255,0.3)' }}>
          {provider.service_types[0]?.includes('AC') ? '❄️' :
           provider.service_types[0]?.includes('ELEC') ? '⚡' :
           provider.service_types[0]?.includes('PLUMB') ? '🔧' :
           provider.service_types[0]?.includes('TUTOR') ? '📚' :
           provider.service_types[0]?.includes('BEAUT') ? '💄' : '🔨'}
        </div>
        <div className="min-w-0 pr-10">
          <h3 className="font-bold text-white text-sm truncate">{provider.name}</h3>
          <p className="text-white/40 text-xs truncate">{provider.area}, {provider.city}</p>
          <div className="flex items-center gap-1 mt-1">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            <span className="text-xs font-bold text-white">{provider.rating}</span>
            <span className="text-white/30 text-xs">({provider.review_count})</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-xs">
          <span className="text-white/40 flex items-center gap-1"><Clock className="w-3 h-3" /> On-Time</span>
          <span className="text-white font-mono">{provider.on_time_score}%</span>
        </div>
        <ScoreBar value={provider.on_time_score} color="#00FF88" />

        <div className="flex items-center justify-between text-xs">
          <span className="text-white/40 flex items-center gap-1"><Shield className="w-3 h-3" /> Trust</span>
          <span className="text-white font-mono">{Math.round(provider.trust_score * 100)}%</span>
        </div>
        <ScoreBar value={provider.trust_score * 100} color="#7B2FFF" />

        <div className="flex items-center justify-between text-xs">
          <span className="text-white/40 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> Jobs</span>
          <span className="text-white font-mono">{provider.total_jobs.toLocaleString()}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {provider.is_verified && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-secondary/15 text-secondary border border-secondary/25">✓ Verified</span>
          )}
          <span className="text-xs text-white/30">PKR {provider.hourly_rate.toLocaleString()}/hr</span>
        </div>
        <motion.button
          onClick={() => router.push(`/request?provider=${provider.id}`)}
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          className="text-xs px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1"
          style={{ background: 'linear-gradient(135deg,#7B2FFF,#00D4FF)' }}>
          <Zap className="w-3 h-3" /> Book
        </motion.button>
      </div>
    </motion.div>
  );
}

export default function LeaderboardPage() {
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [sortedProviders, setSortedProviders] = useState<Provider[]>([]);

  useEffect(() => {
    const filtered = activeFilter === 'ALL'
      ? [...mockProviders]
      : mockProviders.filter(p => p.service_types.some(s => s.includes(activeFilter)));

    const scored = filtered.map(p => ({
      ...p,
      score: p.trust_score * 40 + (p.rating / 5) * 30 + (p.on_time_score / 100) * 20 + Math.min(p.total_jobs / 1000, 1) * 10,
    }));
    scored.sort((a, b) => b.score - a.score);
    setSortedProviders(scored.slice(0, 12));
  }, [activeFilter]);

  const filterColor = SERVICE_FILTERS.find(f => f.key === activeFilter)?.color ?? '#ffffff';

  return (
    <main className="min-h-screen relative overflow-hidden">
      <ParticleBackground />
      <div className="fixed top-0 left-0 w-96 h-96 bg-yellow-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Link href="/">
            <button className="flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-6 text-sm">
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </button>
          </Link>
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Trophy className="w-8 h-8 text-yellow-400" />
                <h1 className="text-3xl md:text-4xl font-extrabold text-white">Provider Leaderboard</h1>
              </div>
              <p className="text-white/40">Islamabad ke best service providers — live rankings</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full glass border border-secondary/30">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              <span className="text-xs text-white/60 font-mono">Live rankings</span>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
          <Filter className="w-4 h-4 text-white/30 shrink-0" />
          {SERVICE_FILTERS.map(f => (
            <motion.button key={f.key} onClick={() => setActiveFilter(f.key)}
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              className="px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all"
              style={{
                background: activeFilter === f.key ? `${f.color}20` : 'rgba(255,255,255,0.05)',
                border: activeFilter === f.key ? `1px solid ${f.color}60` : '1px solid rgba(255,255,255,0.1)',
                color: activeFilter === f.key ? f.color : 'rgba(255,255,255,0.5)',
                boxShadow: activeFilter === f.key ? `0 0 15px ${f.color}30` : 'none',
              }}>
              {f.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Top 3 Podium */}
        {sortedProviders.length >= 3 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="grid grid-cols-3 gap-4 mb-8">
            {[sortedProviders[1], sortedProviders[0], sortedProviders[2]].map((p, i) => {
              const rank = i === 0 ? 2 : i === 1 ? 1 : 3;
              const tier = TIER_CONFIG.find(t => t.rank === rank)!;
              return (
                <motion.div key={p.id}
                  initial={{ opacity: 0, y: rank === 1 ? 40 : 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className={`rounded-2xl p-4 text-center relative ${rank === 1 ? 'md:-mt-4' : ''}`}
                  style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${tier.glow.replace('0.', '0.4 ')}`, boxShadow: `0 0 40px ${tier.glow}` }}>
                  <div className="text-3xl mb-2">{tier.icon}</div>
                  <p className="font-bold text-white text-xs truncate">{p.name}</p>
                  <p className="text-white/40 text-xs">{p.area}</p>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs font-bold text-white">{p.rating}</span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Grid */}
        <AnimatePresence mode="wait">
          <motion.div key={activeFilter}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {sortedProviders.map((p, i) => (
              <ProviderCard key={p.id} provider={p} rank={i + 1} delay={i * 0.05} />
            ))}
          </motion.div>
        </AnimatePresence>

        {sortedProviders.length === 0 && (
          <div className="text-center py-20 text-white/30">
            <p className="text-4xl mb-3">🔍</p>
            <p>Is category mein koi provider nahi mila.</p>
          </div>
        )}
      </div>
    </main>
  );
}
