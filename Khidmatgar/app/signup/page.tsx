'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, Star, Users, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { notifyNewSignup } from '@/lib/slack';
import toast from 'react-hot-toast';
import { ParticleBackground } from '@/components/ui/ParticleBackground';

const BENEFITS = [
  { icon: <Star className="w-4 h-4" />, text: 'Trusted by 1,247+ users today' },
  { icon: <Users className="w-4 h-4" />, text: '342 verified providers live' },
  { icon: <CheckCircle className="w-4 h-4" />, text: 'Instant AI-powered booking' },
];

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.push('/');
    });
  }, [router]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) { setError('Tamam fields bharein.'); return; }
    if (password.length < 6) { setError('Password kam az kam 6 characters ka hona chahiye.'); return; }
    if (password !== confirmPassword) { setError('Passwords match nahi kar rahe.'); return; }
    setError(''); setLoading(true);

    const { data, error: authError } = await supabase.auth.signUp({
      email: email.trim(), password,
      options: { data: { full_name: fullName.trim(), phone: phone.trim() } },
    });

    if (authError || !data) {
      setError(authError?.message === 'User already registered' ? 'Yeh email pehle se registered hai.' : authError?.message ?? 'Signup fail ho gaya.');
      setLoading(false); return;
    }

    // Notify Slack
    notifyNewSignup({ email: data.user.email, fullName: fullName.trim(), timestamp: new Date().toISOString() }).catch(() => {});

    setSuccess(true);
    toast.success('Account ban gaya! Welcome to Khedmatgar AI 🎉');
    setTimeout(() => router.push('/'), 1800);
  };

  return (
    <main className="min-h-screen relative overflow-hidden flex items-center justify-center py-8">
      <ParticleBackground />
      <div className="fixed top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-96 h-96 bg-primary/8 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-4xl mx-4 rounded-3xl overflow-hidden"
        style={{ boxShadow: '0 0 80px rgba(0,212,255,0.2), 0 0 0 1px rgba(123,47,255,0.3)' }}
      >
        <div className="flex flex-col md:flex-row min-h-[580px]">
          {/* LEFT: Promo Panel */}
          <motion.div initial={{ x: -60, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="md:w-80 flex flex-col items-center justify-center px-8 py-10 text-center relative overflow-hidden"
            style={{ background: 'linear-gradient(145deg,#0d0030 0%,#1a0050 50%,#3d0f8f 100%)' }}>
            <div className="absolute top-[-40px] left-[-40px] w-48 h-48 rounded-full opacity-20"
              style={{ background: 'radial-gradient(circle,#00D4FF,transparent)' }} />
            <div className="absolute bottom-[-30px] right-[-30px] w-36 h-36 rounded-full opacity-15"
              style={{ background: 'radial-gradient(circle,#9B5BFF,transparent)' }} />
            <div className="absolute inset-0 opacity-5"
              style={{ backgroundImage: 'radial-gradient(circle at 2px 2px,white 1px,transparent 0)', backgroundSize: '24px 24px' }} />
            <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} className="relative z-10">
              <div className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl mb-6 mx-auto"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}>🚀</div>
              <h2 className="text-3xl font-black text-white tracking-tight mb-3">JOIN US<br />TODAY!</h2>
              <p className="text-white/50 text-sm leading-relaxed mb-6 max-w-[200px] mx-auto">
                Apni har zaroorat ke liye ek platform — powered by Google Antigravity.
              </p>
              <div className="space-y-2.5">
                {BENEFITS.map((b, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="flex items-center gap-2.5 text-left px-3 py-2 rounded-xl"
                    style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <span className="text-primary">{b.icon}</span>
                    <span className="text-xs text-white/70">{b.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* RIGHT: Signup Form */}
          <motion.div initial={{ x: 60, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="flex-1 flex flex-col justify-center px-8 py-10"
            style={{ background: 'rgba(10,15,30,0.97)' }}>
            <Link href="/" className="flex items-center gap-2 mb-6 group">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg font-black"
                style={{ background: 'linear-gradient(135deg,#7B2FFF,#00D4FF)' }}>خ</div>
              <span className="font-extrabold text-white text-sm group-hover:text-primary transition-colors">Khedmatgar AI</span>
            </Link>
            <h1 className="text-3xl font-extrabold text-white mb-1">Sign Up</h1>
            <p className="text-white/40 text-sm mb-6">Naya account banayein — bilkul free</p>

            <AnimatePresence>
              {success ? (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-12 gap-4">
                  <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.5 }}
                    className="w-16 h-16 rounded-full bg-secondary/20 border border-secondary/40 flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-secondary" />
                  </motion.div>
                  <p className="text-white font-bold text-lg">Account ban gaya!</p>
                  <p className="text-white/40 text-sm">Home page par redirect ho rahe hain...</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSignup} className="space-y-3.5">
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-white/60 uppercase tracking-wider">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                      <input id="signup-name" type="text" value={fullName} onChange={e => setFullName(e.target.value)}
                        placeholder="Ahmed Ali" className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white placeholder-white/20 outline-none"
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }} />
                    </div>
                  </div>
                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-white/60 uppercase tracking-wider">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                      <input id="signup-email" type="email" value={email} onChange={e => setEmail(e.target.value)}
                        placeholder="aapka@email.com" className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white placeholder-white/20 outline-none"
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }} />
                    </div>
                  </div>
                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-white/60 uppercase tracking-wider">Phone (Optional)</label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                      <input id="signup-phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                        placeholder="+92 300 1234567" className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white placeholder-white/20 outline-none"
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }} />
                    </div>
                  </div>
                  {/* Password row */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-white/60 uppercase tracking-wider">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <input id="signup-password" type={showPassword ? 'text' : 'password'} value={password}
                          onChange={e => setPassword(e.target.value)} placeholder="••••••"
                          className="w-full pl-9 pr-8 py-3 rounded-xl text-sm text-white placeholder-white/20 outline-none"
                          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }} />
                        <button type="button" onClick={() => setShowPassword(v => !v)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                          {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-white/60 uppercase tracking-wider">Confirm</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <input id="signup-confirm" type="password" value={confirmPassword}
                          onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••"
                          className="w-full pl-9 pr-4 py-3 rounded-xl text-sm text-white placeholder-white/20 outline-none"
                          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }} />
                      </div>
                    </div>
                  </div>
                  <AnimatePresence>
                    {error && (
                      <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</motion.p>
                    )}
                  </AnimatePresence>
                  <motion.button id="signup-submit" type="submit" disabled={loading}
                    whileHover={{ scale: loading ? 1 : 1.02 }} whileTap={{ scale: loading ? 1 : 0.98 }}
                    className="w-full py-3 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 disabled:opacity-60"
                    style={{ background: 'linear-gradient(135deg,#00D4FF,#7B2FFF)' }}>
                    {loading ? (
                      <><motion.div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                        animate={{ rotate: 360 }} transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }} />Creating account...</>
                    ) : (<>Create Account <ArrowRight className="w-4 h-4" /></>)}
                  </motion.button>
                </form>
              )}
            </AnimatePresence>

            <p className="text-center text-white/40 text-xs mt-5">
              Pehle se account hai?{' '}
              <Link href="/login" className="text-primary hover:text-accent transition-colors font-semibold">Login karein</Link>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </main>
  );
}
