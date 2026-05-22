'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase, SupabaseUser } from '@/lib/supabase';
import { LogOut, User, ChevronDown, Trophy, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

export function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUserMenuOpen(false);
    toast.success('Logout ho gaye!');
    router.push('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base font-black"
            style={{ background: 'linear-gradient(135deg,#7B2FFF,#00D4FF)' }}>خ</div>
          <span className="font-extrabold text-white text-sm hidden sm:block group-hover:text-primary transition-colors">
            Khedmatgar AI
          </span>
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-1 sm:gap-2">
          <Link href="/leaderboard">
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white/60 hover:text-white transition-all"
              style={{ background: 'rgba(255,255,255,0.05)' }}>
              <Trophy className="w-3.5 h-3.5 text-yellow-400" />
              <span className="hidden sm:block">Leaderboard</span>
            </motion.button>
          </Link>

          <Link href="/request">
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{ background: 'linear-gradient(135deg,#00D4FF20,#7B2FFF20)', border: '1px solid rgba(0,212,255,0.3)', color: '#00D4FF' }}>
              <Zap className="w-3.5 h-3.5" />
              <span className="hidden sm:block">Service Request</span>
            </motion.button>
          </Link>

          {/* Auth */}
          {user ? (
            <div className="relative">
              <motion.button onClick={() => setUserMenuOpen(v => !v)}
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full transition-all"
                style={{ background: 'rgba(123,47,255,0.15)', border: '1px solid rgba(123,47,255,0.3)' }}>
                <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: 'linear-gradient(135deg,#7B2FFF,#00D4FF)' }}>
                  {(user.user_metadata.full_name || user.email).charAt(0).toUpperCase()}
                </div>
                <span className="text-xs text-white/80 hidden sm:block max-w-[80px] truncate">
                  {user.user_metadata.full_name || user.email.split('@')[0]}
                </span>
                <ChevronDown className="w-3 h-3 text-white/40" />
              </motion.button>

              <AnimatePresence>
                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                    <motion.div initial={{ opacity: 0, y: -8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.96 }} transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-48 rounded-2xl overflow-hidden z-20 shadow-2xl"
                      style={{ background: '#0d1326', border: '1px solid rgba(123,47,255,0.3)' }}>
                      <div className="p-3 border-b border-white/5">
                        <p className="text-xs font-bold text-white truncate">{user.user_metadata.full_name || 'User'}</p>
                        <p className="text-xs text-white/40 truncate">{user.email}</p>
                      </div>
                      <div className="p-1.5">
                        <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-white/70 hover:text-white hover:bg-white/5 transition-all text-left">
                          <User className="w-3.5 h-3.5" /> My Profile
                        </button>
                        <button onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all text-left">
                          <LogOut className="w-3.5 h-3.5" /> Logout
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <Link href="/login">
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold text-white/60 hover:text-white transition-all"
                  style={{ background: 'rgba(255,255,255,0.05)' }}>
                  Login
                </motion.button>
              </Link>
              <Link href="/signup">
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                  className="px-3 py-1.5 rounded-full text-xs font-bold text-white"
                  style={{ background: 'linear-gradient(135deg,#7B2FFF,#00D4FF)' }}>
                  Sign Up
                </motion.button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
