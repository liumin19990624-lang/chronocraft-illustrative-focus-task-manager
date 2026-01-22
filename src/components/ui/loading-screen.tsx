import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ACADEMIC_QUOTES } from '@/lib/mock-academic';
import { Sparkles } from 'lucide-react';
export function LoadingScreen() {
  const quote = useMemo(() => {
    return ACADEMIC_QUOTES[Math.floor(Math.random() * ACADEMIC_QUOTES.length)];
  }, []);
  return (
    <div className="fixed inset-0 z-[500] bg-background flex flex-col items-center justify-center p-10 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-40">
         <div className="absolute inset-0 bg-gradient-radial from-primary/5 to-transparent blur-3xl animate-pulse" />
      </div>
      <div className="relative z-10 text-center space-y-12 max-w-2xl">
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            rotate: { duration: 4, repeat: Infinity, ease: "linear" },
            scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
          }}
          className="mx-auto h-24 w-24 rounded-[2.5rem] bg-primary/10 flex items-center justify-center text-primary shadow-xl"
        >
          <Sparkles className="h-12 w-12" />
        </motion.div>
        <div className="space-y-4">
          <p className="text-2xl font-display font-bold italic text-foreground/80 leading-relaxed">
            “{quote}”
          </p>
          <div className="flex items-center justify-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" />
          </div>
        </div>
      </div>
    </div>
  );
}