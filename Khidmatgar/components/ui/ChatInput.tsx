'use client';
import { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Languages } from 'lucide-react';
import { motion } from 'framer-motion';

const PLACEHOLDERS = [
  'AC Technician dhundein...',
  'Plumber book karein...',
  'Bijli ka masla batayein...',
  'Tutor hire karein...',
  'کوئی بھی سروس بتائیں...',
];

function detectLanguage(text: string): { label: string; flag: string; color: string } {
  if (!text) return { label: 'Listening...', flag: '💬', color: '#ffffff40' };
  if (/[\u0600-\u06FF]/.test(text)) return { label: 'Urdu', flag: '🇵🇰', color: '#00FF88' };
  const romanUrduWords = ['hai', 'chahiye', 'karo', 'abhi', 'mera', 'meri', 'humein', 'koi', 'nahi', 'ghar', 'bijli', 'paani', 'urgent', 'jaldi', 'kal'];
  if (romanUrduWords.some(w => text.toLowerCase().includes(w))) return { label: 'Roman Urdu', flag: '🇵🇰', color: '#00D4FF' };
  return { label: 'English', flag: '🇬🇧', color: '#7B2FFF' };
}

export function ChatInput({ onSubmit, isRunning }: { onSubmit: (val: string) => void; isRunning: boolean }) {
  const [val, setVal] = useState('');
  const [phIdx, setPhIdx] = useState(0);
  const [listening, setListening] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const t = setInterval(() => setPhIdx(i => (i + 1) % PLACEHOLDERS.length), 3000);
    return () => clearInterval(t);
  }, []);

  const lang = detectLanguage(val);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (val.trim() && !isRunning) {
      onSubmit(val.trim());
      setVal('');
    }
  };

  const toggleMic = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) { alert('Voice input not supported in this browser.'); return; }

    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'ur-PK';
    recognition.interimResults = true;
    recognition.onresult = (e: any) => {
      const transcript = Array.from(e.results).map((r: any) => r[0].transcript).join('');
      setVal(transcript);
    };
    recognition.onend = () => setListening(false);
    recognition.start();
    recognitionRef.current = recognition;
    setListening(true);
  };

  return (
    <div className="w-full space-y-2">
      {/* Language detection badge */}
      <div className="flex items-center gap-2 px-1">
        <Languages className="w-3.5 h-3.5" style={{ color: lang.color }} />
        <span className="text-xs font-medium transition-colors duration-300" style={{ color: lang.color }}>
          {lang.flag} {lang.label}
        </span>
        {val.length > 0 && (
          <div className="ml-auto flex gap-1">
            {[...Array(Math.min(5, Math.ceil(val.length / 10)))].map((_, i) => (
              <div key={i} className="w-1 h-3 rounded-full bg-primary/60" />
            ))}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit}
        className="relative flex items-center gap-2 bg-black/40 border border-white/10 rounded-2xl p-2 backdrop-blur-md focus-within:border-primary/50 transition-all duration-300">
        {/* Mic button */}
        <motion.button type="button" onClick={toggleMic} whileTap={{ scale: 0.9 }}
          className={`p-2.5 rounded-xl transition-all shrink-0 ${listening ? 'bg-danger/20 text-danger animate-pulse' : 'bg-white/5 text-white/50 hover:text-primary hover:bg-primary/10'}`}>
          {listening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </motion.button>

        <input
          ref={inputRef}
          type="text"
          value={val}
          onChange={e => setVal(e.target.value)}
          placeholder={PLACEHOLDERS[phIdx]}
          disabled={isRunning}
          className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder:text-white/25 min-w-0"
        />

        <motion.button type="submit" disabled={isRunning || !val.trim()}
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.92 }}
          className="p-2.5 rounded-xl font-bold shrink-0 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: val.trim() && !isRunning ? 'linear-gradient(135deg, #00D4FF, #7B2FFF)' : 'rgba(255,255,255,0.1)' }}>
          <Send className="w-4 h-4 text-background" />
        </motion.button>
      </form>
    </div>
  );
}
