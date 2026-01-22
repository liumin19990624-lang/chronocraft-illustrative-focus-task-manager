import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/use-app-store';
import { Button } from '@/components/ui/button';
import { Play, Pause, X, CheckCircle2, Coffee, Sparkles, RefreshCcw } from 'lucide-react';
import { triggerConfetti } from '@/components/ui/confetti';
import { Badge } from '@/components/ui/badge';
import { toast } from "sonner";
export function FocusOverlay() {
  const activeTaskId = useAppStore(s => s.timer.activeTaskId);
  const isRunning = useAppStore(s => s.timer.isRunning);
  const isPaused = useAppStore(s => s.timer.isPaused);
  const timeLeft = useAppStore(s => s.timer.timeLeft);
  const tasks = useAppStore(s => s.tasks);
  const tick = useAppStore(s => s.tick);
  const toggleTimer = useAppStore(s => s.toggleTimer);
  const stopFocus = useAppStore(s => s.stopFocus);
  const completeTask = useAppStore(s => s.completeTask);
  const [showSummary, setShowSummary] = useState(false);
  const activeTask = tasks.find(t => t.id === activeTaskId);
  useEffect(() => {
    let interval: any;
    if (isRunning && activeTaskId) {
      interval = setInterval(() => tick(), 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, activeTaskId, tick]);
  useEffect(() => {
    if (timeLeft === 0 && activeTaskId && isRunning) {
      if (window.navigator.vibrate) window.navigator.vibrate([200, 100, 200]);
      toast.success("时段结束，建筑师应当小憩片刻。");
      setShowSummary(true);
    }
  }, [timeLeft, activeTaskId, isRunning]);
  if (!activeTaskId) return null;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const handleComplete = () => {
    triggerConfetti();
    if (activeTaskId) {
      completeTask(activeTaskId);
      stopFocus();
    }
  };
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center p-6 overflow-hidden"
      >
        {/* Animated Background Particles */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vw] border-[1px] border-dashed border-primary rounded-full"
          />
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] border-[1px] border-primary/40 rounded-full"
          />
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-8 right-8 h-14 w-14 rounded-full bg-secondary/50 backdrop-blur-md hover:bg-secondary active:scale-90"
          onClick={stopFocus}
        >
          <X className="h-8 w-8" />
        </Button>
        <div className="w-full max-w-3xl text-center space-y-12 relative z-10">
          <div className="space-y-6">
            <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none px-6 py-2 text-sm rounded-full font-bold uppercase tracking-widest">
              {isRunning ? "正��专注构筑" : isPaused ? "构筑已暂停" : "专注���式"}
            </Badge>
            <h2 className="text-4xl md:text-6xl font-display font-bold tracking-tight leading-tight px-4">
              {activeTask?.title}
            </h2>
          </div>
          <div className="relative flex items-center justify-center py-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={timeLeft}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={cn(
                  "text-[10rem] md:text-[18rem] font-bold tabular-nums tracking-tighter leading-none transition-colors duration-500",
                  isRunning ? "text-foreground" : "text-muted-foreground/40"
                )}
              >
                {minutes}<span className="text-primary/40 text-[0.6em] mx-[-0.05em]">:</span>{seconds.toString().padStart(2, '0')}
              </motion.div>
            </AnimatePresence>
            {isPaused && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 flex items-center justify-center backdrop-blur-sm rounded-full"
              >
                <div className="bg-background/80 p-8 rounded-[3rem] shadow-2xl border border-border flex flex-col items-center gap-4">
                  <Coffee className="h-12 w-12 text-primary" />
                  <p className="font-display font-bold text-2xl">休息一下...</p>
                </div>
              </motion.div>
            )}
          </div>
          <div className="flex items-center justify-center gap-8">
            <Button
              size="lg"
              variant="outline"
              className="h-24 w-24 rounded-[2.5rem] border-2 bg-secondary/20 hover:bg-secondary transition-all active:scale-90 group"
              onClick={toggleTimer}
            >
              {isRunning ? <Pause className="h-10 w-10" /> : <Play className="h-10 w-10 ml-1 fill-current" />}
            </Button>
            <Button
              size="lg"
              className="h-24 px-10 rounded-[2.5rem] text-2xl font-bold gap-4 shadow-xl shadow-primary/20 transition-all active:scale-95"
              onClick={handleComplete}
            >
              <CheckCircle2 className="h-8 w-8" />
              完成此阶段
            </Button>
          </div>
          <p className="text-muted-foreground italic text-lg font-display">
            "专注是深度工作的灵魂。在寂静中，伟大的构筑正在发生。"
          </p>
        </div>
        {/* Completion Summary Dialog (Simplified implementation for focus mode) */}
        {showSummary && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 z-[110] bg-background/95 backdrop-blur-xl flex items-center justify-center p-8"
          >
            <div className="max-w-md w-full text-center space-y-8 bg-card p-10 rounded-[3rem] shadow-2xl border">
              <div className="bg-primary/10 h-24 w-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="h-12 w-12 text-primary" />
              </div>
              <h2 className="text-3xl font-display font-bold">专注时段结束��</h2>
              <p className="text-muted-foreground text-lg">你已经完成了 25 分钟的深度工作。是时候让大脑���松一下了。</p>
              <div className="flex flex-col gap-4">
                <Button className="h-14 rounded-2xl text-lg font-bold" onClick={() => { setShowSummary(false); stopFocus(); }}>
                  ��始小憩
                </Button>
                <Button variant="ghost" className="h-14 rounded-2xl text-lg" onClick={() => { setShowSummary(false); stopFocus(); }}>
                  稍后再说
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}