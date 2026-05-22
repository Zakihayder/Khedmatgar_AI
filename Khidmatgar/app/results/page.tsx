'use client';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, MapPin, Star, Clock, Shield, Filter, ChevronDown, Info } from 'lucide-react';
import { mockProviders, Provider } from '@/lib/db/providers';
import { MapView } from '@/components/ui/MapView';

type FilterType = 'all' | 'nearest' | 'rated' | 'cheapest' | 'available';
type SortType = 'match' | 'rating' | 'price' | 'distance';

const CAT_COLOR: Record<string, string> = {
  AC_REPAIR: '#00D4FF', AC_INSTALLATION: '#00D4FF', AC_WASH: '#00D4FF',
  ELECTRICIAN: '#FFB800', WIRING: '#FFB800',
  PLUMBER: '#3B82F6', PIPE_LEAK: '#3B82F6',
  TUTOR: '#7B2FFF', MATH_TUTOR: '#7B2FFF',
  BEAUTICIAN: '#FF6B9D',
  CARPENTER: '#D97706',
  GAS_TECHNICIAN: '#00FF88',
};
const CAT_ICON: Record<string, string> = {
  AC_REPAIR: '❄️', ELECTRICIAN: '⚡', PLUMBER: '🔧', TUTOR: '📚', BEAUTICIAN: '💄', CARPENTER: '🪵',
};

function TrustBadge({ score }: { score: number }) {
  if (score >= 0.85) return <span className="trust-high">✅ Highly Trusted</span>;
  if (score >= 0.65) return <span className="trust-medium">⚠️ Mixed Reviews</span>;
  return <span className="trust-low">🔴 Caution</span>;
}

function MatchRing({ score }: { score: number }) {
  const pct = Math.round(score * 100);
  const r = 18; const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  const color = pct >= 80 ? '#00FF88' : pct >= 60 ? '#FFB800' : '#FF3B5C';
  return (
    <div className="relative w-12 h-12 flex items-center justify-center">
      <svg className="progress-ring absolute inset-0" width="48" height="48">
        <circle cx="24" cy="24" r={r} fill="none" strokeWidth="3" stroke="rgba(255,255,255,0.1)" />
        <circle cx="24" cy="24" r={r} fill="none" strokeWidth="3" stroke={color}
          strokeDasharray={`${dash} ${circ - dash}`} strokeLinecap="round" className="transition-all duration-1000" />
      </svg>
      <span className="text-[10px] font-bold" style={{ color }}>{pct}%</span>
    </div>
  );
}

function computeMatchScore(p: Provider, filter: FilterType): number {
  const distScore = 0.75; // Simulated
  const ratingScore = p.rating / 5;
  const reliabilityScore = p.on_time_score / 100;
  const priceScore = 1 - (p.hourly_rate / 3000);
  const base = distScore * 0.25 + ratingScore * 0.30 + reliabilityScore * 0.25 + priceScore * 0.20;
  if (filter === 'cheapest') return 0.5 + priceScore * 0.5;
  if (filter === 'rated') return 0.4 + ratingScore * 0.6;
  return base;
}

function ResultsContent() {
  const searchParams = useSearchParams();
  const serviceParam = searchParams?.get('service') || '';
  const [filter, setFilter] = useState<FilterType>('all');
  const [sort, setSort] = useState<SortType>('match');
  const [selected, setSelected] = useState<string | null>(null);
  const [compare, setCompare] = useState<string[]>([]);
  const [expandedReason, setExpandedReason] = useState<string | null>(null);

  const filtered = mockProviders
    .filter(p => p.is_active && !p.is_blacklisted)
    .filter(p => filter === 'available' ? Object.keys(p.availability).includes('ASAP') : true)
    .map(p => ({ ...p, matchScore: computeMatchScore(p, filter) }))
    .sort((a, b) => {
      if (sort === 'rating') return b.rating - a.rating;
      if (sort === 'price') return a.hourly_rate - b.hourly_rate;
      if (sort === 'match') return b.matchScore - a.matchScore;
      return 0;
    });

  const toggleCompare = (id: string) => {
    setCompare(prev => prev.includes(id) ? prev.filter(x => x !== id) : prev.length < 3 ? [...prev, id] : prev);
  };

  const FILTERS: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'All' }, { key: 'nearest', label: 'Nearest' },
    { key: 'rated', label: 'Best Rated' }, { key: 'cheapest', label: 'Cheapest' },
    { key: 'available', label: 'Available Now' },
  ];

  const hasApiKey = !!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Map Header */}
      <div className="relative h-56 md:h-72 glass-dark border-b border-white/10 overflow-hidden shrink-0">
        {hasApiKey ? (
          <MapView
            providers={filtered}
            selectedProviderId={selected}
            onSelectProvider={(id) => setSelected(id)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="absolute inset-0 opacity-20"
              style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, #00D4FF 0%, transparent 40%), radial-gradient(circle at 70% 30%, #7B2FFF 0%, transparent 40%)' }} />
            <div className="relative text-center">
              <div className="text-4xl mb-2">🗺️</div>
              <p className="text-white/50 text-sm">Google Maps — Islamabad Providers</p>
              <p className="text-white/30 text-xs mt-1">Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to enable live map</p>
            </div>
            {/* Mock provider dots */}
            {filtered.slice(0, 6).map((p, i) => {
              const x = 15 + (i % 3) * 30 + Math.sin(i) * 5;
              const y = 20 + Math.floor(i / 3) * 40 + Math.cos(i) * 8;
              const color = CAT_COLOR[p.service_types[0]] || '#fff';
              return (
                <motion.div key={p.id}
                  className="absolute w-8 h-8 rounded-full flex items-center justify-center text-xs cursor-pointer font-bold border-2"
                  style={{ left: `${x}%`, top: `${y}%`, background: `${color}30`, borderColor: color, color }}
                  whileHover={{ scale: 1.4, zIndex: 10 }}
                  onClick={() => setSelected(p.id)}>
                  {CAT_ICON[p.service_types[0]] || '📍'}
                </motion.div>
              );
            })}
          </div>
        )}
        <div className="absolute bottom-3 left-3 z-10">
          <div className="glass rounded-xl px-3 py-1.5 flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-white/60">Your location: G-13</span>
          </div>
        </div>
      </div>


      {/* Results List */}
      <div className="flex-1 p-4 max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
          <div className="flex items-center gap-3">
            <Link href="/"><button className="p-2 glass rounded-xl hover:bg-white/10 transition-colors"><ArrowLeft className="w-4 h-4" /></button></Link>
            <div>
              <h1 className="font-bold text-white">Nearby Providers</h1>
              <p className="text-xs text-white/40">{filtered.length} providers found · Islamabad</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/40">Sort:</span>
            <select value={sort} onChange={e => setSort(e.target.value as SortType)}
              className="text-xs bg-black/30 border border-white/20 rounded-lg px-2 py-1.5 text-white focus:outline-none focus:border-primary/50">
              <option value="match">Match Score</option>
              <option value="rating">Rating</option>
              <option value="price">Price</option>
            </select>
          </div>
        </div>

        {/* Filter chips */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1 scrollbar-hide">
          {FILTERS.map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                filter === f.key ? 'bg-primary text-background shadow-neon-blue' : 'glass border border-white/10 text-white/60 hover:border-primary/30 hover:text-primary'
              }`}>{f.label}</button>
          ))}
        </div>

        {/* Provider Cards */}
        <div className="space-y-3">
          {filtered.map((p, i) => {
            const color = CAT_COLOR[p.service_types[0]] || '#fff';
            const isSelected = selected === p.id;
            const isComparing = compare.includes(p.id);
            const isTop = i === 0;
            return (
              <motion.div key={p.id}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className={`glass rounded-2xl border overflow-hidden card-3d transition-all ${isSelected ? 'border-primary/60' : 'border-white/10 hover:border-white/20'}`}>
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 font-bold"
                      style={{ background: `${color}20`, color }}>
                      {p.name.charAt(0)}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-bold text-white text-sm">{p.name}</h3>
                            {p.is_verified && <Shield className="w-3.5 h-3.5 text-secondary" />}
                            {isTop && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-warning/20 text-warning font-bold">🏆 AI Pick</span>}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium" style={{ background: `${color}15`, color }}>
                              {CAT_ICON[p.service_types[0]]} {p.service_types[0].replace('_', ' ')}
                            </span>
                            <span className="text-xs text-white/40 flex items-center gap-1">
                              <MapPin className="w-3 h-3" />{p.area}
                            </span>
                          </div>
                        </div>
                        <MatchRing score={p.matchScore} />
                      </div>

                      <div className="flex items-center gap-4 mt-2 flex-wrap">
                        <div className="flex items-center gap-1 text-warning text-xs">
                          <Star className="w-3 h-3 fill-warning" />
                          <span className="font-bold">{p.rating}</span>
                          <span className="text-white/40">({p.review_count})</span>
                        </div>
                        <TrustBadge score={p.trust_score} />
                        <span className="text-xs text-white/50 flex items-center gap-1">
                          <Clock className="w-3 h-3" />{p.on_time_score}% on-time
                        </span>
                        <span className="text-xs font-bold text-white">PKR {p.hourly_rate}/hr</span>
                      </div>

                      {/* Why recommended */}
                      <div className="mt-2">
                        <button onClick={() => setExpandedReason(expandedReason === p.id ? null : p.id)}
                          className="text-[10px] text-primary hover:text-white transition-colors flex items-center gap-1">
                          <Info className="w-3 h-3" /> Why Recommended
                          <ChevronDown className={`w-3 h-3 transition-transform ${expandedReason === p.id ? 'rotate-180' : ''}`} />
                        </button>
                        <AnimatePresence>
                          {expandedReason === p.id && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden">
                              <div className="mt-1.5 text-xs text-white/50 bg-black/20 rounded-lg p-2">
                                <strong className="text-white/70">AI Reasoning:</strong> {p.name} ranked{i === 0 ? ' #1' : ` #${i+1}`} based on {p.rating}★ rating,
                                {p.on_time_score}% reliability, and {p.years_exp} years experience.
                                {p.trust_score >= 0.85 ? ' High trust score from verified reviews.' : ''}
                                {p.cancellation_rate < 5 ? ' Exceptionally low cancellation rate.' : ''}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-3 pt-3 border-t border-white/5">
                    <button onClick={() => setSelected(isSelected ? null : p.id)}
                      className="flex-1 py-2 rounded-xl text-xs font-semibold glass border border-white/10 text-white/60 hover:border-primary/30 hover:text-primary transition-all">
                      {isSelected ? '✓ On Map' : 'View Map'}
                    </button>
                    <button onClick={() => toggleCompare(p.id)}
                      className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
                        isComparing ? 'bg-accent/20 border border-accent/50 text-accent' : 'glass border border-white/10 text-white/60 hover:border-accent/30 hover:text-accent'
                      }`}>
                      {isComparing ? '✓ Comparing' : 'Compare'}
                    </button>
                    <Link href={`/book/${p.id}`} className="flex-1">
                      <button className="w-full py-2 rounded-xl text-xs font-bold text-background transition-all hover:opacity-90"
                        style={{ background: `linear-gradient(135deg, ${color}, ${color}aa)` }}>
                        Book Now
                      </button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Compare Tray */}
      <AnimatePresence>
        {compare.length >= 2 && (
          <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }}
            className="fixed bottom-20 left-4 right-4 z-40 glass-dark rounded-2xl border border-accent/30 p-4 max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-white text-sm">Comparing {compare.length} Providers</h3>
              <button onClick={() => setCompare([])} className="text-white/40 hover:text-white text-xs">Clear</button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {compare.map(id => {
                const p = mockProviders.find(x => x.id === id);
                if (!p) return null;
                return (
                  <div key={id} className="glass rounded-xl p-2 text-center">
                    <div className="font-bold text-xs text-white">{p.name}</div>
                    <div className="text-warning text-xs">{p.rating}★</div>
                    <div className="text-white/50 text-[10px]">PKR {p.hourly_rate}/hr</div>
                    <TrustBadge score={p.trust_score} />
                  </div>
                );
              })}
            </div>
            <Link href={`/book/${compare[0]}`}>
              <button className="w-full mt-3 py-2 rounded-xl text-xs font-bold text-background"
                style={{ background: 'linear-gradient(135deg, #00D4FF, #7B2FFF)' }}>
                Book Best Option →
              </button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-white/60 text-sm">Loading providers map and list...</p>
        </div>
      </div>
    }>
      <ResultsContent />
    </Suspense>
  );
}
