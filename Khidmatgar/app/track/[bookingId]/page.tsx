'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Phone, MapPin, Clock, CheckCircle, Star, MessageSquare } from 'lucide-react';

const STAGES = [
  { key: 'booked', label: 'Booked', icon: '📋', desc: 'Booking confirmed by system' },
  { key: 'confirmed', label: 'Confirmed', icon: '✅', desc: 'Provider accepted the job' },
  { key: 'en_route', label: 'En Route', icon: '🚗', desc: 'Provider is on the way' },
  { key: 'arrived', label: 'Arrived', icon: '📍', desc: 'Provider arrived at location' },
  { key: 'completed', label: 'Completed', icon: '⭐', desc: 'Service completed successfully' },
];

export default function TrackPage() {
  const params = useParams();
  const bookingId = params?.bookingId as string || 'KHD-20260520-DEMO';
  const [stageIndex, setStageIndex] = useState(0);
  const [eta, setEta] = useState(23);
  const [showFeedback, setShowFeedback] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  // Auto-advance through stages for demo
  useEffect(() => {
    if (stageIndex >= STAGES.length - 1) return;
    const delays = [3000, 5000, 8000, 12000];
    const timer = setTimeout(() => setStageIndex(s => s + 1), delays[stageIndex] || 5000);
    return () => clearTimeout(timer);
  }, [stageIndex]);

  // ETA countdown
  useEffect(() => {
    if (stageIndex >= 3) return;
    const timer = setInterval(() => setEta(e => Math.max(0, e - 1)), 60000);
    return () => clearInterval(timer);
  }, [stageIndex]);

  useEffect(() => {
    if (stageIndex === STAGES.length - 1) setTimeout(() => setShowFeedback(true), 2000);
  }, [stageIndex]);

  return (
    <div className="min-h-screen p-4 max-w-lg mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/"><button className="p-2 glass rounded-xl hover:bg-white/10 transition-colors"><ArrowLeft className="w-5 h-5" /></button></Link>
        <div>
          <h1 className="text-lg font-bold text-white">Live Tracking</h1>
          <p className="text-xs font-mono text-primary">{bookingId}</p>
        </div>
      </div>

      {/* Map Placeholder */}
      <div className="glass rounded-2xl border border-white/10 overflow-hidden mb-6 relative" style={{ height: 200 }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-2 animate-bounce">📍</div>
            <p className="text-white/50 text-sm">Provider Location — G-13 Area</p>
            <p className="text-xs text-white/30 mt-1">Live GPS tracking simulation</p>
          </div>
        </div>
        {/* Animated provider dot */}
        <motion.div animate={{ x: [0, 20, 40, 60, 80], y: [0, -10, 5, -5, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          className="absolute top-1/2 left-1/4 w-6 h-6 rounded-full bg-primary flex items-center justify-center text-xs shadow-neon-blue">
          🔧
        </motion.div>
      </div>

      {/* ETA Card */}
      {stageIndex < 3 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-5 border border-primary/30 mb-6 text-center">
          <div className="text-xs text-white/50 mb-1">Provider arrives in</div>
          <div className="text-4xl font-extrabold text-primary">{eta} min</div>
          <div className="text-sm text-white/50 mt-1">Hassan Plumbing · En route to G-13</div>
        </motion.div>
      )}

      {/* Status Timeline */}
      <div className="glass rounded-2xl border border-white/10 p-5 mb-6">
        <h3 className="font-bold text-white mb-4">Booking Status</h3>
        <div className="space-y-4 relative">
          <div className="absolute left-5 top-4 bottom-4 w-0.5 bg-white/10" />
          {STAGES.map((stage, i) => {
            const done = i < stageIndex;
            const active = i === stageIndex;
            return (
              <motion.div key={stage.key} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }} className="flex items-start gap-4 relative z-10">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0 transition-all duration-500 ${
                  done ? 'bg-secondary/20 border-2 border-secondary' : active ? 'bg-primary/20 border-2 border-primary animate-pulse' : 'bg-white/5 border border-white/10'
                }`}>
                  {done ? '✓' : stage.icon}
                </div>
                <div className="pt-2">
                  <div className={`font-semibold text-sm ${done ? 'text-secondary' : active ? 'text-primary' : 'text-white/40'}`}>
                    {stage.label} {active && <span className="text-xs animate-pulse">(current)</span>}
                  </div>
                  <div className="text-xs text-white/40">{stage.desc}</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Provider Info */}
      <div className="glass rounded-2xl border border-white/10 p-5 mb-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-xl">🔧</div>
          <div>
            <div className="font-bold text-white">Hassan Plumbing</div>
            <div className="flex items-center gap-1 text-warning text-sm">★★★★★ <span className="text-white/50 text-xs ml-1">(145 reviews)</span></div>
          </div>
        </div>
        <div className="flex gap-3">
          <a href="tel:+923331122445" className="flex-1 py-2 rounded-xl text-center text-sm font-semibold glass border border-primary/30 text-primary hover:bg-primary/10 transition-all">
            <Phone className="w-4 h-4 inline mr-1" />Call
          </a>
          <button className="flex-1 py-2 rounded-xl text-center text-sm font-semibold glass border border-white/20 text-white/70 hover:bg-white/10 transition-all">
            <MessageSquare className="w-4 h-4 inline mr-1" />WhatsApp
          </button>
        </div>
      </div>

      {/* Feedback */}
      {showFeedback && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl border border-secondary/30 p-5">
          <h3 className="font-bold text-white mb-1 flex items-center gap-2"><Star className="w-4 h-4 text-warning" />Rate Your Experience</h3>
          <p className="text-white/50 text-sm mb-4">Service completed! How was Hassan Plumbing?</p>
          <div className="flex gap-2 mb-4 justify-center">
            {[1, 2, 3, 4, 5].map(star => (
              <button key={star} onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)} onMouseLeave={() => setHoverRating(0)}
                className="text-3xl transition-transform hover:scale-125">
                {star <= (hoverRating || rating) ? '⭐' : '☆'}
              </button>
            ))}
          </div>
          {rating > 0 && (
            <Link href={`/feedback/${bookingId}?rating=${rating}`}>
              <button className="w-full py-3 rounded-xl font-bold text-background"
                style={{ background: 'linear-gradient(135deg, #00D4FF, #00FF88)' }}>
                Submit Feedback →
              </button>
            </Link>
          )}
        </motion.div>
      )}
    </div>
  );
}
