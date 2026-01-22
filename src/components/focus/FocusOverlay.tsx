import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/use-app-store';
import { Button } from '@/components/ui/button';
import { Play, Pause, X, CheckCircle2 } from 'lucide-react';
import { triggerConfetti } from '@/components/ui/confetti';
export function FocusOverlay() {
  const timer = useAppStore(s => s.timer);
  const tasks = useAppStore(s => s.tasks);
  const tick = useAppStore(s => s.tick);
  const toggleTimer = useAppStore(s => s.toggleTimer);
  const stopFocus = useAppStore(s => s.stopFocus);
  const completeTask = useAppStore(s => s.completeTask);
  const activeTask = tasks.find(t => t.id === timer.activeTaskId);
  useEffect(() => {
    let interval: any;
    if (timer.isRunning) {
      interval = setInterval(() => tick(), 1000);
    }
    return () => clearInterval(interval);
  }, [timer.isRunning, tick]);
  if (!timer.activeTaskId) return null;
  const minutes = Math.floor(timer.timeLeft / 60);
  const seconds = timer.timeLeft % 60;
  const handleComplete = () => {
    triggerConfetti();
    if (timer.activeTaskId) completeTask(timer.activeTaskId);
  };
  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center p-6"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-8 right-8 rounded-full"
          onClick={stopFocus}
        >
          <X className="h-6 w-6" />
        </Button>
        <div className="w-full max-w-2xl text-center space-y-12 relative">
          <div className="space-y-4">
            <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none px-4 py-1 text-sm">
              {timer.mode.toUpperCase()} MODE
            </Badge>
            <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight">
              {activeTask?.title}
            </h2>
          </div>
          <div className="relative flex items-center justify-center">
            <motion.div 
              animate={{ scale: timer.isRunning ? [1, 1.02, 1] : 1 }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-9xl md:text-[12rem] font-bold tabular-nums tracking-tighter"
            >
              {minutes}:{seconds.toString().padStart(2, '0')}
            </motion.div>
          </div>
          <div className="flex items-center justify-center gap-6">
            <Button 
              size="lg" 
              variant="outline" 
              className="h-20 w-20 rounded-full border-2"
              onClick={toggleTimer}
            >
              {timer.isRunning ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8 ml-1" />}
            </Button>
            <Button 
              size="lg" 
              className="h-20 px-8 rounded-full text-xl font-bold gap-2"
              onClick={handleComplete}
            >
              <CheckCircle2 className="h-6 w-6" />
              Finish Task
            </Button>
          </div>
          <p className="text-muted-foreground italic">
            "Deep work is the superpower of the 21st century."
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
import { Badge } from '@/components/ui/badge';