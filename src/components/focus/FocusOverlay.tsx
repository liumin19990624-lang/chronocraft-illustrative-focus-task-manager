import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/use-app-store';
import { Button } from '@/components/ui/button';
import { Play, Pause, X, CheckCircle2, Ghost, Sparkles, Brain } from 'lucide-react';
import { triggerConfetti } from '@/components/ui/confetti';
import { Badge } from '@/components/ui/badge';
import { toast } from "sonner";
import { playSound } from '@/lib/audio';
import { cn } from '@/lib/utils';
import { useShallow } from 'zustand/react/shallow';
export function FocusOverlay() {
  const activeTaskId = useAppStore(s => s.timer.activeTaskId);
  const isRunning = useAppStore(s => s.timer.isRunning);
  const isPaused = useAppStore(s => s.timer.isPaused);
  const isDistracted = useAppStore(s => s.timer.isDistracted);
  const timeLeft = useAppStore(s => s.timer.timeLeft);
  const tasks = useAppStore(useShallow(s => s.tasks));
  const tick = useAppStore(s => s.tick);
  const toggleTimer = useAppStore(s => s.toggleTimer);
  const stopFocus = useAppStore(s => s.stopFocus);
  const setDistracted = useAppStore(s => s.setDistracted);
  const completeTask = useAppStore(s => s.completeTask);
  const hiddenTimeRef = useRef<number | null>(null);
  const activeTask = useMemo(() => tasks.find(t => t.id === activeTaskId), [tasks, activeTaskId]);
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') {
        hiddenTimeRef.current = Date.now();
      } else if (hiddenTimeRef.current) {
        const diff = (Date.now() - hiddenTimeRef.current) / 1000;
        if (diff > 30 && isRunning) {
          setDistracted(true);
          playSound('click');
          toast.warning("道心不稳！", { description: "检测到长时间离开，已自动停��潜修。请摒弃杂念，重回正轨。" });
        }
        hiddenTimeRef.current = null;
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [isRunning, setDistracted]);
  useEffect(() => {
    let interval: any;
    if (isRunning && activeTaskId) {
      interval = setInterval(() => tick(), 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, activeTaskId, tick]);
  useEffect(() => {
    if (timeLeft === 0 && activeTaskId && isRunning) {
      playSound('ding');
      toast.success("潜修圆满！", { description: "周天运��完毕，神识获得洗礼。" });
      triggerConfetti();
      stopFocus();
    }
  }, [timeLeft, activeTaskId, isRunning, stopFocus]);
  if (!activeTaskId) return null;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center p-6">
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: "linear" }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vw] border-2 border-dashed border-primary/30 rounded-full" />
        </div>
        <Button variant="ghost" size="icon" className="absolute top-10 right-10 h-16 w-16 rounded-full bg-secondary/50" onClick={stopFocus}><X className="h-8 w-8" /></Button>
        <div className="w-full max-w-4xl text-center space-y-12 z-10">
          <div className="space-y-6">
            <Badge className={cn("px-8 py-2 text-sm rounded-full font-bold uppercase tracking-widest", isDistracted ? "bg-amber-500" : "bg-primary")}>
              {isDistracted ? "道心入魔 (已走神)" : isRunning ? "深度潜修中" : "入定中"}
            </Badge>
            <h2 className="text-6xl font-display font-bold px-4">{activeTask?.title}</h2>
          </div>
          <div className="relative">
            <motion.div key={timeLeft} initial={{ scale: 0.9, opacity: 0.5 }} animate={{ scale: 1, opacity: 1 }} className={cn("text-[18rem] md:text-[24rem] font-bold tabular-nums tracking-tighter leading-none transition-colors", isRunning ? "text-foreground" : "text-muted-foreground/20")}>
              {minutes}<span className="text-primary/20">:</span>{seconds.toString().padStart(2, '0')}
            </motion.div>
            {isDistracted && (
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="absolute inset-0 flex items-center justify-center backdrop-blur-md rounded-full">
                <div className="bg-background/90 p-12 rounded-5xl border-4 border-amber-500/20 text-center space-y-4 shadow-2xl">
                  <Ghost className="h-20 w-20 text-amber-500 mx-auto" />
                  <p className="text-3xl font-display font-bold">杂念丛生</p>
                  <Button size="lg" className="rounded-2xl px-12" onClick={() => setDistracted(false)}>重拾道心</Button>
                </div>
              </motion.div>
            )}
          </div>
          <div className="flex items-center justify-center gap-8">
            <Button size="lg" variant="outline" className="h-24 w-24 rounded-4xl border-4 shadow-xl" onClick={toggleTimer}>
              {isRunning ? <Pause className="h-10 w-10" /> : <Play className="h-10 w-10 ml-1 fill-current" />}
            </Button>
            <Button size="lg" className="h-24 px-12 rounded-4xl text-2xl font-bold gap-4 shadow-2xl" onClick={() => completeTask(activeTaskId)}>
              <CheckCircle2 className="h-10 w-10" /> 终证大道
            </Button>
          </div>
          <motion.div animate={{ opacity: [0.4, 0.7, 0.4] }} transition={{ duration: 4, repeat: Infinity }} className="text-muted-foreground italic text-xl font-display max-w-2xl mx-auto">
            “静以修身，俭以养德。非淡泊无以明志，非宁静无以致远。”
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}