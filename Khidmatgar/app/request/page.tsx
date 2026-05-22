'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatInput } from '@/components/ui/ChatInput';
import { AgentTracePanel } from '@/components/ui/AgentTracePanel';
import { LocationPicker } from '@/components/ui/LocationPicker';
import { OrchestratorState } from '@/lib/agents/types';
import { ArrowLeft, User, Bot, CheckCircle, ExternalLink, PanelRight, MapPin } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';


type Message = { role: 'user' | 'agent'; text: string; bookingId?: string };

const EXAMPLE_PROMPTS = [
  'AC kharab hai G-13 urgent',
  'Bijli ka masla hai urgent',
  'plumber urgent F7 abhi chahiye',
  'بجلی کا مسئلہ ہے جلدی',
  'Kal subah electrician G-11',
];

export default function RequestPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [orchestratorState, setOrchestratorState] = useState<OrchestratorState | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [showTrace, setShowTrace] = useState(true);
  const [selectedArea, setSelectedArea] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isRunning]);

  const handleSubmit = async (text: string) => {
    setMessages(prev => [...prev, { role: 'user', text }]);
    setIsRunning(true);
    setOrchestratorState(null);

    try {
      const res = await fetch('/api/orchestrator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userInput: text }),
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const reader = res.body?.getReader();
      if (!reader) throw new Error('No stream from server');
      const decoder = new TextDecoder();
      let buffer = '';
      let finalState: OrchestratorState | null = null;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split('\n\n');
        buffer = parts.pop() ?? '';
        for (const part of parts) {
          const line = part.trim();
          if (!line.startsWith('data: ')) continue;
          const dataStr = line.slice(6).trim();
          if (dataStr === '[DONE]') break;
          try {
            const parsed = JSON.parse(dataStr);
            if (parsed.state) {
              setOrchestratorState({ ...parsed.state });
              finalState = parsed.state;
            }
          } catch {}
        }
      }

      setIsRunning(false);

      if (!finalState) {
        setMessages(prev => [...prev, { role: 'agent', text: 'Server se response nahi mila. Dobara try karein.' }]);
        return;
      }

      const hasFailed = finalState.steps.some(s => s.status === 'FAILED');
      const needsClarification = !!(finalState.intent?.clarification_needed);
      const hasBooking = !!finalState.booking_record;
      const scheduleConflict = finalState.selected_slot?.status === 'CONFLICT';
      const foundProviders = finalState.steps.some(s => s.agent === 'Dhundho' && s.status === 'SUCCESS' && (s.result?.candidates_found ?? 0) > 0);

      if (hasFailed) {
        const failedStep = finalState.steps.find(s => s.status === 'FAILED');
        setMessages(prev => [...prev, { role: 'agent', text: `Maazrat — ${failedStep?.agent} agent mein masla aa gaya. ${failedStep?.reasoning || ''}` }]);
      } else if (needsClarification) {
        setMessages(prev => [...prev, { role: 'agent', text: finalState!.intent!.clarification_needed! }]);
      } else if (hasBooking) {
        const b = finalState.booking_record;
        const p = finalState.ranked_providers?.[0];
        setMessages(prev => [...prev, {
          role: 'agent',
          text: `✅ Booking confirm ho gayi!\n\n📋 ID: ${b.booking_id}\n👷 Provider: ${p?.name || 'Expert'}\n⏰ Slot: ${b.slot_datetime}\n💰 Total: PKR ${b.price_breakdown?.total}\n\nProvider jald pahunch jaega. Track karein ya koi aur madad?`,
          bookingId: b.booking_id,
        }]);
      } else if (scheduleConflict) {
        const alts = (finalState.selected_slot?.alternatives || []).slice(0, 3).join(', ');
        setMessages(prev => [...prev, { role: 'agent', text: `Is waqt slot available nahi. Yeh options hain:\n${alts}\n\nKaunsa waqt prefer karein ge?` }]);
      } else if (!foundProviders) {
        const svc = finalState.intent?.service_type || 'service';
        setMessages(prev => [...prev, { role: 'agent', text: `Maazrat, abhi ${svc} ke liye koi provider available nahi. Kya waitlist join karein?` }]);
      } else {
        setMessages(prev => [...prev, { role: 'agent', text: 'Kuch masla aa gaya. Please dobara try karein.' }]);
      }
    } catch (err: any) {
      console.error(err);
      setIsRunning(false);
      setMessages(prev => [...prev, { role: 'agent', text: `Maazrat — system error aa gaya. (${err.message})` }]);
    }
  };

  return (
    <div className="h-screen flex flex-col md:flex-row overflow-hidden bg-background">

      {/* ── LEFT: Chat Console ── */}
      <div className="flex-1 flex flex-col relative overflow-hidden min-w-0">
        {/* Header */}
        <div className="px-4 py-3 border-b border-white/10 flex flex-col gap-2 bg-black/30 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-3">
            <Link href="/">
              <button className="p-2 rounded-xl glass hover:bg-white/10 transition-colors">
                <ArrowLeft className="w-4 h-4" />
              </button>
            </Link>
            <div className="flex-1">
              <h2 className="font-bold text-sm text-white">Service Request Console</h2>
              <div className="flex items-center gap-2 text-xs text-white/40 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                Antigravity Network Online
                {selectedArea && (
                  <span className="flex items-center gap-1 text-accent">
                    <MapPin className="w-3 h-3" /> {selectedArea}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/results" className="hidden sm:block">
                <button className="text-xs px-3 py-1.5 glass rounded-full border border-white/10 hover:border-primary/50 text-white/60 hover:text-primary transition-all">
                  View Results →
                </button>
              </Link>
              <button onClick={() => setShowTrace(t => !t)}
                className="p-2 glass rounded-xl hover:bg-white/10 transition-colors md:hidden">
                <PanelRight className="w-4 h-4 text-white/50" />
              </button>
            </div>
          </div>
          {/* Location Picker bar */}
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-white/30 shrink-0" />
            <div className="flex-1 max-w-xs">
              <LocationPicker
                value={selectedArea}
                onChange={(area) => setSelectedArea(area)}
                placeholder="Area select karein (optional)"
              />
            </div>
          </div>
        </div>

        {/* Chat */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {messages.length === 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-16 h-16 rounded-2xl glass border border-primary/30 flex items-center justify-center mb-4 shadow-neon-blue">
                <Bot className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-bold text-white text-lg mb-1">Khedmatgar AI</h3>
              <p className="text-white/40 text-sm mb-6 max-w-sm">
                Type your request in Urdu, Roman Urdu, or English. AI will find, rank, and book the best provider for you.
              </p>
              <div className="flex flex-wrap gap-2 justify-center max-w-md">
                {EXAMPLE_PROMPTS.map((p, i) => (
                  <motion.button key={i} onClick={() => handleSubmit(p)}
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    className="px-3 py-1.5 rounded-full text-xs glass border border-white/10 hover:border-primary/40 hover:text-primary text-white/60 transition-all">
                    {p}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          <AnimatePresence>
            {messages.map((m, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  m.role === 'user' ? 'bg-primary/20 text-primary' : 'bg-secondary/20 text-secondary'
                }`}>
                  {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div className="max-w-[80%] space-y-2">
                  <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                    m.role === 'user'
                      ? 'bg-primary/15 border border-primary/25 text-white'
                      : 'glass border border-white/10 text-white/85'
                  }`}>
                    {m.text}
                  </div>
                  {m.bookingId && (
                    <div className="flex gap-2">
                      <Link href={`/track/${m.bookingId}`}>
                        <button className="text-xs px-3 py-1.5 bg-secondary/20 text-secondary rounded-full border border-secondary/30 hover:bg-secondary/30 transition-all flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> Track Booking
                        </button>
                      </Link>
                      <Link href={`/feedback/${m.bookingId}`}>
                        <button className="text-xs px-3 py-1.5 glass text-white/50 rounded-full border border-white/10 hover:text-white transition-all flex items-center gap-1">
                          <ExternalLink className="w-3 h-3" /> Feedback
                        </button>
                      </Link>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}

            {isRunning && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-secondary/20 text-secondary flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="glass border border-white/10 rounded-2xl px-4 py-3 flex items-center gap-2">
                  {[0, 1, 2].map(i => (
                    <motion.div key={i} className="w-2 h-2 rounded-full bg-primary/60"
                      animate={{ y: [0, -6, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }} />
                  ))}
                  <span className="text-xs text-white/40 ml-1 font-mono">Antigravity engine processing...</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div className="px-4 py-3 border-t border-white/10 bg-black/20 backdrop-blur-md shrink-0">
          <ChatInput onSubmit={handleSubmit} isRunning={isRunning} />
        </div>
      </div>

      {/* ── RIGHT: Agent Trace (desktop always visible, mobile toggle) ── */}
      <AnimatePresence>
        {(showTrace || true) && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 380, opacity: 1 }}
            className="hidden md:flex flex-col border-l border-white/10 shrink-0 overflow-hidden"
            style={{ width: 380 }}>
            <AgentTracePanel state={orchestratorState} isRunning={isRunning} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
