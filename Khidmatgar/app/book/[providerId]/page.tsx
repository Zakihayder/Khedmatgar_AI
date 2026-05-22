'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle, Download, Calendar, Share2, MapPin, Clock, Shield, Star } from 'lucide-react';
import { mockProviders } from '@/lib/db/providers';

const STEPS = ['Confirm Details', 'Notifications', 'Confirmation'];

export default function BookPage() {
  const params = useParams();
  const providerId = params?.providerId as string || 'PRV-001';
  const provider = mockProviders.find(p => p.id === providerId) || mockProviders[0];

  const [step, setStep] = useState(0);
  const [slot, setSlot] = useState('');
  const [notes, setNotes] = useState('');
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(true);
  const [bookingId] = useState(`KHD-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.floor(1000 + Math.random() * 9000)}`);
  const [confetti, setConfetti] = useState(false);

  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);
  const slots = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];
  const currentHour = now.getHours();
  const availableSlots = slots.filter(s => parseInt(s) > currentHour + 1);

  const totalPrice = Math.round(provider.hourly_rate * 1.2 + 200); // base + surge + dist
  const distanceFee = 200;
  const urgencySurcharge = Math.round(provider.hourly_rate * 0.20);

  useEffect(() => {
    if (step === 2) {
      import('canvas-confetti').then(m => {
        const confettiFn = m.default;
        setConfetti(true);
        confettiFn({ particleCount: 120, spread: 70, origin: { y: 0.6 }, colors: ['#00D4FF', '#00FF88', '#7B2FFF'] });
        setTimeout(() => confettiFn({ particleCount: 80, spread: 80, origin: { y: 0.5 }, angle: 60 }), 300);
        setTimeout(() => confettiFn({ particleCount: 80, spread: 80, origin: { y: 0.5 }, angle: 120 }), 500);
      });
    }
  }, [step]);

  return (
    <div className="min-h-screen p-4 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/results"><button className="p-2 glass rounded-xl hover:bg-white/10 transition-colors"><ArrowLeft className="w-4 h-4" /></button></Link>
        <div>
          <h1 className="font-bold text-white">Book Service</h1>
          <p className="text-xs text-white/40">{provider.name}</p>
        </div>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-6">
        {STEPS.map((s, i) => (
          <div key={i} className="flex items-center gap-2 flex-1">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all ${
              i < step ? 'bg-secondary text-background' : i === step ? 'bg-primary text-background' : 'glass border border-white/20 text-white/30'
            }`}>{i < step ? '✓' : i + 1}</div>
            {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 rounded-full transition-all ${i < step ? 'bg-secondary' : 'bg-white/10'}`} />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1: Confirm Details */}
        {step === 0 && (
          <motion.div key="step0" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            {/* Provider card */}
            <div className="glass rounded-2xl border border-white/10 p-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/20 text-primary flex items-center justify-center font-bold text-lg shrink-0">
                {provider.name.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-white text-sm">{provider.name}</h3>
                  {provider.is_verified && <Shield className="w-3.5 h-3.5 text-secondary" />}
                </div>
                <div className="flex items-center gap-3 text-xs text-white/50 mt-0.5">
                  <span className="text-warning flex items-center gap-0.5"><Star className="w-3 h-3 fill-warning" />{provider.rating}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{provider.area}</span>
                  <span>{provider.years_exp} yrs exp</span>
                </div>
              </div>
            </div>

            {/* Time slot picker */}
            <div className="glass rounded-2xl border border-white/10 p-4">
              <h4 className="font-semibold text-white text-sm mb-3 flex items-center gap-2"><Clock className="w-4 h-4 text-primary" />Select Time Slot</h4>
              <div className="grid grid-cols-4 gap-2">
                {availableSlots.map(s => (
                  <button key={s} onClick={() => setSlot(s)}
                    className={`py-2 rounded-xl text-xs font-semibold transition-all ${
                      slot === s ? 'bg-primary text-background shadow-neon-blue' : 'glass border border-white/10 text-white/60 hover:border-primary/30'
                    }`}>{s}</button>
                ))}
              </div>
              {availableSlots.length === 0 && (
                <p className="text-xs text-white/40 text-center py-2">No slots today — try tomorrow</p>
              )}
            </div>

            {/* Special notes */}
            <div>
              <label className="text-xs text-white/50 mb-1.5 block">Special Instructions (optional)</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} placeholder="e.g. Please call before coming..."
                className="w-full glass border border-white/10 rounded-xl p-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-primary/50 resize-none" />
            </div>

            {/* Price breakdown */}
            <div className="glass rounded-2xl border border-white/10 p-4">
              <h4 className="font-semibold text-white text-sm mb-3">Price Breakdown</h4>
              <div className="space-y-2 text-sm">
                {[
                  { label: 'Base Fee (1 hr)', val: `PKR ${provider.hourly_rate}` },
                  { label: 'Distance Fee', val: `PKR ${distanceFee}` },
                  { label: 'Urgency Surcharge', val: `PKR ${urgencySurcharge}` },
                ].map(r => (
                  <div key={r.label} className="flex justify-between text-white/60">
                    <span>{r.label}</span><span>{r.val}</span>
                  </div>
                ))}
                <div className="border-t border-white/10 pt-2 flex justify-between font-bold text-white">
                  <span>Total</span><span className="text-primary">PKR {totalPrice}</span>
                </div>
              </div>
            </div>

            <button onClick={() => slot && setStep(1)} disabled={!slot}
              className="w-full py-4 rounded-xl font-bold text-background disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              style={{ background: slot ? 'linear-gradient(135deg, #00D4FF, #7B2FFF)' : undefined }}>
              Continue →
            </button>
          </motion.div>
        )}

        {/* Step 2: Notifications */}
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="glass rounded-2xl border border-white/10 p-5 space-y-4">
              <h4 className="font-bold text-white">Notification Preferences</h4>
              {[
                { label: 'Push Notifications', sub: 'Real-time updates on your device', val: pushNotif, set: setPushNotif },
                { label: 'Email Confirmation', sub: 'Booking receipt to your email', val: emailNotif, set: setEmailNotif },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-white">{item.label}</div>
                    <div className="text-xs text-white/40">{item.sub}</div>
                  </div>
                  <button onClick={() => item.set(!item.val)}
                    className={`relative w-11 h-6 rounded-full transition-all ${item.val ? 'bg-primary' : 'bg-white/20'}`}>
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${item.val ? 'left-6' : 'left-1'}`} />
                  </button>
                </div>
              ))}
            </div>
            <div className="glass rounded-2xl border border-white/10 p-4 text-sm text-white/50">
              <strong className="text-white/70 block mb-1">Booking Summary</strong>
              Provider: {provider.name}<br />
              Slot: {todayStr} at {slot}<br />
              Total: PKR {totalPrice}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(0)} className="flex-1 py-3 rounded-xl text-sm glass border border-white/20 text-white/60 hover:bg-white/10 transition-all">← Back</button>
              <button onClick={() => setStep(2)} className="flex-1 py-3 rounded-xl text-sm font-bold text-background"
                style={{ background: 'linear-gradient(135deg, #00D4FF, #7B2FFF)' }}>Confirm Booking</button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Confirmation */}
        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
            <div className="text-center py-4">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}
                className="w-20 h-20 rounded-full bg-secondary/20 border-4 border-secondary flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-secondary" />
              </motion.div>
              <h2 className="text-2xl font-extrabold text-white mb-1">Booking Confirmed!</h2>
              <p className="text-white/50 text-sm">Provider has been notified and will arrive shortly</p>
            </div>

            {/* Receipt */}
            <div className="glass rounded-2xl border border-secondary/30 overflow-hidden">
              <div className="bg-secondary/10 p-4 text-center border-b border-secondary/20">
                <div className="text-lg font-extrabold text-white">خدمتگار AI</div>
                <div className="text-xs text-white/40 font-mono mt-0.5">Khedmatgar AI · Service Receipt</div>
              </div>
              <div className="p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/50">Booking ID</span>
                  <span className="font-mono text-primary text-xs">{bookingId}</span>
                </div>
                <div className="flex justify-between"><span className="text-white/50">Provider</span><span className="text-white">{provider.name}</span></div>
                <div className="flex justify-between"><span className="text-white/50">Service</span><span className="text-white">{provider.service_types[0].replace('_',' ')}</span></div>
                <div className="flex justify-between"><span className="text-white/50">Slot</span><span className="text-white">{todayStr} · {slot}</span></div>
                <div className="flex justify-between"><span className="text-white/50">Location</span><span className="text-white">{provider.area}, Islamabad</span></div>
                <div className="border-t border-white/10 pt-2 flex justify-between font-bold">
                  <span className="text-white">Total Paid</span><span className="text-secondary">PKR {totalPrice}</span>
                </div>
              </div>
            </div>

            {/* Notifications sent */}
            <div className="glass rounded-2xl border border-white/10 p-4 space-y-2">
              <h4 className="font-semibold text-sm text-white mb-2">Notifications Sent</h4>
              {[
                { icon: '📲', label: 'Push notification sent', sent: pushNotif },
                { icon: '📧', label: 'Email confirmation sent', sent: emailNotif },
                { icon: '💬', label: 'Provider notified via Slack', sent: true },
                { icon: '📅', label: 'Calendar event created', sent: true },
              ].map(n => (
                <div key={n.label} className="flex items-center gap-2 text-xs">
                  <span>{n.icon}</span>
                  <span className={n.sent ? 'text-secondary' : 'text-white/30'}>{n.sent ? '✓' : '–'} {n.label}</span>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3">
              <Link href={`/track/${bookingId}`}>
                <button className="w-full py-3 rounded-xl font-bold text-background text-sm"
                  style={{ background: 'linear-gradient(135deg, #00D4FF, #00FF88)' }}>
                  🗺️ Track Service
                </button>
              </Link>
              <Link href="/">
                <button className="w-full py-3 rounded-xl font-semibold glass border border-white/20 text-white/70 hover:bg-white/10 text-sm transition-all">
                  ← Home
                </button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
