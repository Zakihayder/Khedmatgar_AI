'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  tilt?: boolean;
}

export function GlassCard({ children, className, delay = 0, tilt = true }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      whileHover={tilt ? { scale: 1.02, rotateX: 2, rotateY: 2 } : {}}
      className={cn(
        "glass-panel rounded-2xl p-6 transition-all duration-300",
        className
      )}
      style={{ perspective: 1000 }}
    >
      {children}
    </motion.div>
  );
}
