'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PHRASES = [
  'AC Technician dhundein...',
  'Plumber book karein...',
  'Electrician schedule karein...',
  'Tutor hire karein...',
  'Beauty Expert bulayein...',
  'Carpenter dhundein...',
  'AC ٹیکنیشن تلاش کریں...',
  'پلمبر بک کریں...',
  'بجلی والا بلائیں...',
];

export function TypewriterText() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = PHRASES[phraseIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && charIndex < current.length) {
      timeout = setTimeout(() => {
        setDisplayText(current.slice(0, charIndex + 1));
        setCharIndex(c => c + 1);
      }, 55);
    } else if (!deleting && charIndex === current.length) {
      timeout = setTimeout(() => setDeleting(true), 1800);
    } else if (deleting && charIndex > 0) {
      timeout = setTimeout(() => {
        setDisplayText(current.slice(0, charIndex - 1));
        setCharIndex(c => c - 1);
      }, 28);
    } else if (deleting && charIndex === 0) {
      setDeleting(false);
      setPhraseIndex(p => (p + 1) % PHRASES.length);
    }

    return () => clearTimeout(timeout);
  }, [charIndex, deleting, phraseIndex]);

  return (
    <span className="text-white/60">
      {displayText}
      <span className="inline-block w-0.5 h-6 bg-primary ml-0.5 animate-pulse" />
    </span>
  );
}
