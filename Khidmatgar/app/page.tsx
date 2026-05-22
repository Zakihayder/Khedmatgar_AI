'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Zap, Droplet, Wind, BookOpen, Scissors, Hammer, Star, CheckCircle, Clock, Users, TrendingUp, ChevronRight } from 'lucide-react';
import { ParticleBackground } from '@/components/ui/ParticleBackground';
import { TypewriterText } from '@/components/ui/TypewriterText';
import { StatCounter } from '@/components/ui/StatCounter';

const SERVICE_ICONS = [
  { Icon: Zap, label: 'Electrician', color: '#FFB800', angle: 0 },
  { Icon: Droplet, label: 'Plumber', color: '#3B82F6', angle: 60 },
  { Icon: Wind, label: 'AC Repair', color: '#00D4FF', angle: 120 },
  { Icon: BookOpen, label: 'Tutor', color: '#7B2FFF', angle: 180 },
  { Icon: Scissors, label: 'Beautician', color: '#FF6B9D', angle: 240 },
  { Icon: Hammer, label: 'Carpenter', color: '#D97706', angle: 300 },
];

const STEPS = [
  { num: '01', title: 'Bolein', urdu: 'بولیں', desc: 'Type or speak in Urdu, Roman Urdu, or English', icon: '🎤' },
  { num: '02', title: 'AI Samjhe', urdu: 'سمجھے', desc: 'Antigravity engine extracts intent & location', icon: '🧠' },
  { num: '03', title: 'Best Match', urdu: 'بہترین', desc: 'Multi-factor ranking finds your ideal provider', icon: '⚡' },
  { num: '04', title: 'Ho Gaya!', urdu: '✓', desc: 'Booked, confirmed, tracked — all automated', icon: '✅' },
];

const LIVE_FEED = [
  { name: 'Ahmed R.', service: 'AC Repair', area: 'G-13', time: '2 min ago', color: '#00D4FF' },
  { name: 'Sara M.', service: 'Tutoring', area: 'F-7', time: '5 min ago', color: '#7B2FFF' },
  { name: 'Bilal K.', service: 'Plumber', area: 'I-8', time: '8 min ago', color: '#3B82F6' },
  { name: 'Fatima A.', service: 'Electrician', area: 'E-7', time: '12 min ago', color: '#FFB800' },
  { name: 'Usman T.', service: 'Carpenter', area: 'G-9', time: '15 min ago', color: '#D97706' },
];

const FEATURES = [
  { icon: '🧠', title: '8 Specialized Agents', desc: 'Samajh → Dhundho → Chunno → Daam → Waqt → Book → Yaad Dilao → Masla Hal' },
  { icon: '📊', title: 'Live Reasoning Trace', desc: 'Watch the AI think in real-time with full transparency' },
  { icon: '🗺️', title: 'Google Maps Integration', desc: 'Real distances, routes, and provider locations on map' },
  { icon: '💰', title: 'Dynamic Pricing Engine', desc: 'Fair, transparent pricing with urgency and demand factors' },
  { icon: '🔔', title: 'Follow-up Automation', desc: 'Reminders, en-route alerts, feedback — all automated' },
  { icon: '⚖️', title: 'Dispute Resolution AI', desc: 'Auto-resolves complaints, escalates when needed' },
  { icon: '🌐', title: 'Multilingual NLU', desc: 'Urdu, Roman Urdu, English — even mixed code-switching' },
  { icon: '📱', title: 'WhatsApp Simulation', desc: 'Mock notifications just like real Pakistani users expect' },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      <ParticleBackground />

      {/* Ambient blobs */}
      <div className="fixed top-0 left-0 w-1/2 h-1/2 bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-1/2 h-1/2 bg-accent/5 rounded-full blur-[150px] pointer-events-none" />

      {/* ── HERO ── */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 pt-20 pb-16">
        {/* Badge */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/30 mb-8 text-sm">
          <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
          <span className="text-white/70">Pakistan&apos;s 1st</span>
          <span className="text-primary font-semibold">Agentic Service Network</span>
          <span className="text-white/40">·</span>
          <span className="text-white/50 text-xs">AISeekho2026</span>
        </motion.div>

        {/* Headline */}
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-center mb-4 leading-tight">
          <span className="text-white">Apni Zaroorat Batao</span>
          <br />
          <span className="text-gradient animate-shimmer bg-[length:200%_auto]">Baaki Hum Karein.</span>
        </motion.h1>

        {/* Urdu tagline */}
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          className="text-xl text-white/40 font-urdu mb-2">اپنی ضرورت بتائیں — باقی ہم کریں</motion.p>

        {/* Typewriter */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="text-lg md:text-xl mb-10 h-8 flex items-center">
          <TypewriterText />
        </motion.div>

        {/* CTA Buttons */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center gap-4 mb-16">
          <Link href="/request">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
              className="px-8 py-4 font-bold rounded-full flex items-center gap-2 text-background text-lg shadow-neon-blue"
              style={{ background: 'linear-gradient(135deg, #00D4FF, #00FF88)' }}>
              Apni Service Request Karein <ArrowRight className="w-5 h-5" />
            </motion.button>
          </Link>
          <Link href="/demo">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
              className="px-8 py-4 font-semibold rounded-full glass border border-white/20 text-white/80 hover:text-white hover:border-primary/50 transition-all">
              Live Demo Dekhein →
            </motion.button>
          </Link>
        </motion.div>

        {/* Orbiting service icons */}
        <div className="relative w-72 h-72 mx-auto mb-16">
          <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.7 }}
            className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full glass border-2 border-primary/30 flex items-center justify-center shadow-neon-blue">
              <span className="text-3xl">خ</span>
            </div>
          </motion.div>
          {SERVICE_ICONS.map(({ Icon, label, color, angle }, i) => {
            const rad = (angle * Math.PI) / 180;
            const x = Math.cos(rad) * 120;
            const y = Math.sin(rad) * 120;
            return (
              <motion.div key={i}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 + i * 0.1 }}
                className="absolute flex flex-col items-center"
                style={{ left: `calc(50% + ${x}px - 28px)`, top: `calc(50% + ${y}px - 28px)` }}>
                <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
                  className="w-14 h-14 rounded-2xl glass border flex items-center justify-center"
                  style={{ borderColor: `${color}40` }}>
                  <Icon className="w-6 h-6" style={{ color }} />
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}
          className="grid grid-cols-3 gap-6 w-full max-w-2xl">
          {[
            { value: 1247, suffix: '+', label: 'Bookings Today', icon: <CheckCircle className="w-5 h-5 text-secondary" /> },
            { value: 342, suffix: '', label: 'Providers Active', icon: <Users className="w-5 h-5 text-primary" /> },
            { value: 4.8, suffix: '★', label: 'Avg Rating', decimals: 1, icon: <Star className="w-5 h-5 text-warning" /> },
          ].map((s, i) => (
            <div key={i} className="glass rounded-2xl p-4 text-center border border-white/10">
              <div className="flex justify-center mb-2">{s.icon}</div>
              <div className="text-2xl font-extrabold text-white">
                <StatCounter target={s.value} suffix={s.suffix} decimals={s.decimals} />
              </div>
              <div className="text-xs text-white/50 mt-1">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="relative z-10 py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-16">
            <span className="text-xs font-mono text-primary uppercase tracking-widest">How It Works</span>
            <h2 className="text-3xl md:text-4xl font-extrabold mt-2 text-white">4 Steps. <span className="text-gradient">Seconds.</span></h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {STEPS.map((step, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                className="glass rounded-2xl p-6 text-center relative card-3d border border-white/10">
                <div className="text-4xl mb-3">{step.icon}</div>
                <div className="text-xs font-mono text-primary mb-1">{step.num}</div>
                <h3 className="font-bold text-white text-lg">{step.title}</h3>
                <p className="text-white/50 text-sm mt-2">{step.desc}</p>
                {i < STEPS.length - 1 && (
                  <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                    <ChevronRight className="w-5 h-5 text-primary/40" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="relative z-10 py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-16">
            <span className="text-xs font-mono text-secondary uppercase tracking-widest">Unique Features</span>
            <h2 className="text-3xl md:text-4xl font-extrabold mt-2 text-white">Built to <span className="text-gradient">Impress.</span></h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                className="glass rounded-2xl p-5 card-3d hover:border-primary/30 border border-white/10 transition-all">
                <div className="text-2xl mb-3">{f.icon}</div>
                <h4 className="font-bold text-white text-sm mb-2">{f.title}</h4>
                <p className="text-white/50 text-xs leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LIVE FEED ── */}
      <section className="relative z-10 py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-8">
            <span className="text-xs font-mono text-warning uppercase tracking-widest">Live Activity</span>
            <h2 className="text-2xl font-bold mt-2 text-white">Bookings Happening <span className="text-gradient-blue">Right Now</span></h2>
          </motion.div>
          <div className="glass rounded-2xl border border-white/10 overflow-hidden">
            <div className="p-3 border-b border-white/10 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              <span className="text-xs text-white/60 font-mono">Live booking feed</span>
            </div>
            <div className="divide-y divide-white/5">
              {LIVE_FEED.map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-3 px-4 py-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: `${item.color}20`, color: item.color }}>
                    {item.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <span className="text-sm text-white/80">{item.name} booked </span>
                    <span className="text-sm font-semibold" style={{ color: item.color }}>{item.service}</span>
                    <span className="text-sm text-white/50"> in {item.area}</span>
                  </div>
                  <span className="text-xs text-white/30 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {item.time}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="relative z-10 py-24 px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">
            Ready to Experience <br />
            <span className="text-gradient animate-shimmer bg-[length:200%_auto]">Khedmatgar AI?</span>
          </h2>
          <Link href="/request">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
              className="px-10 py-5 font-bold rounded-full text-background text-lg shadow-neon-blue"
              style={{ background: 'linear-gradient(135deg, #00D4FF, #7B2FFF)' }}>
              Abhi Service Request Karein →
            </motion.button>
          </Link>
          <p className="text-white/30 text-sm mt-6">No account needed · Works in Urdu, Roman Urdu, English</p>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-8 px-4 text-center">
        <p className="text-white/30 text-sm">
          <span className="text-gradient font-bold">Khedmatgar AI (خدمتگار)</span> · AISeekho2026 Hackathon ·
          Built with Google Antigravity · <span className="text-white/20">©2026</span>
        </p>
        <div className="flex items-center justify-center gap-6 mt-4">
          {['English', 'اردو', 'Roman Urdu'].map(lang => (
            <button key={lang} className="text-xs text-white/40 hover:text-primary transition-colors">{lang}</button>
          ))}
        </div>
      </footer>
    </main>
  );
}
