'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Sparkles, Shield, Zap } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { notifyUserLogin } from '@/lib/slack';
import toast from 'react-hot-toast';
import { ParticleBackground } from '@/components/ui/ParticleBackground';

const FEATURES = [
  { icon: <Shield className="w-5 h-5" />, text: 'Secure Supabase Auth' },
  { icon: <Zap className="w-5 h-5" />, text: '8 AI Agents at Work' },
  { icon: <Sparkles className="w-5 h-5" />, text: "Pakistan's #1 Platform" },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.push('/');
    });
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError('Email aur password dono darj karein.'); return; }
    setError(''); setLoading(true);
    const { data, error: authError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (authError || !data) {
      setError(authError?.message === 'Invalid login credentials' ? 'Galat email ya password.' : authError?.message ?? 'Login fail.');
      setLoading(false); return;
    }
    notifyUserLogin({ email: data.user.email, fullName: data.user.user_metadata.full_name || data.user.email }).catch(() => {});
    toast.success(`Welcome back, ${data.user.user_metadata.full_name || 'User'}!`);
    router.push('/');
  };

  return (
    <main className="min-h-screen relative overflow-hidden flex items-center justify-center">
      <ParticleBackground />
      <div className="fixed top-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-primary/8 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-4xl mx-4 rounded-3xl overflow-hidden"
        style={{ boxShadow: '0 0 80px rgba(123,47,255,0.25), 0 0 0 1px rgba(123,47,255,0.3)' }}
      >
        <div className="flex flex-col md:flex-row min-h-[520px]">
          {/* LEFT: Form */}
          <motion.div initial={{ x: -60, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="flex-1 flex flex-col justify-center px-8 py-10"
            style={{ background: 'rgba(10,15,30,0.97)' }}>
            <Link href="/" className="flex items-center gap-2 mb-8 group">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg font-black"
                style={{ background: 'linear-gradient(135deg,#7B2FFF,#00D4FF)' }}>خ</div>
              <span className="font-extrabold text-white text-sm group-hover:text-primary transition-colors">Khedmatgar AI</span>
            </Link>
            <h1 className="text-3xl font-extrabold text-white mb-1">Login</h1>
            <p className="text-white/40 text-sm mb-8">Apne account mein daakhil ho</p>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-white/60 uppercase tracking-wider">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input id="login-email" type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="aapka@email.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white placeholder-white/20 outline-none"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }} />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-white/60 uppercase tracking-wider">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input id="login-password" type={showPassword ? 'text' : 'password'} value={password}
                    onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                    className="w-full pl-10 pr-11 py-3 rounded-xl text-sm text-white placeholder-white/20 outline-none"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }} />
                  <button type="button" onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <AnimatePresence>
                {error && (
                  <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</motion.p>
                )}
              </AnimatePresence>
              <motion.button id="login-submit" type="submit" disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }} whileTap={{ scale: loading ? 1 : 0.98 }}
                className="w-full py-3 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg,#7B2FFF,#00D4FF)' }}>
                {loading ? (
                  <><motion.div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                    animate={{ rotate: 360 }} transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }} />Logging in...</>
                ) : (<>Login <ArrowRight className="w-4 h-4" /></>)}
              </motion.button>
            </form>
            <p className="text-center text-white/40 text-xs mt-6">
              Account nahi hai?{' '}
              <Link href="/signup" className="text-accent hover:text-primary transition-colors font-semibold">Sign Up karein</Link>
            </p>
          </motion.div>

          {/* RIGHT: Welcome */}
          <motion.div initial={{ x: 60, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="md:w-80 flex flex-col items-center justify-center px-8 py-10 text-center relative overflow-hidden"
            style={{ background: 'linear-gradient(145deg,#3d0f8f 0%,#1a0050 40%,#0d0030 100%)' }}>
            <div className="absolute top-[-40px] right-[-40px] w-48 h-48 rounded-full opacity-20"
              style={{ background: 'radial-gradient(circle,#9B5BFF,transparent)' }} />
            <div className="absolute bottom-[-30px] left-[-30px] w-36 h-36 rounded-full opacity-15"
              style={{ background: 'radial-gradient(circle,#00D4FF,transparent)' }} />
            <div className="absolute inset-0 opacity-5"
              style={{ backgroundImage: 'radial-gradient(circle at 2px 2px,white 1px,transparent 0)', backgroundSize: '24px 24px' }} />
            <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} className="relative z-10">
              <div className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl mb-6 mx-auto"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}>👋</div>
              <h2 className="text-3xl font-black text-white tracking-tight mb-3">WELCOME<br />BACK!</h2>
              <p className="text-white/50 text-sm leading-relaxed mb-6 max-w-[200px] mx-auto">
                Pakistan&apos;s first agentic service platform is ready to serve you.
              </p>
              <div className="space-y-2.5">
                {FEATURES.map((f, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="flex items-center gap-2.5 text-left px-3 py-2 rounded-xl"
                    style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <span className="text-accent">{f.icon}</span>
                    <span className="text-xs text-white/70">{f.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </main>
  );
}
