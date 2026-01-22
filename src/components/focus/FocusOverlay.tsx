import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/use-app-store';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Play, Pause, X, CheckCircle2, Coffee, Sparkles, Send } from 'lucide-react';
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
  const timeLeft = useAppStore(s => s.timer.timeLeft);
  const tasks = useAppStore(useShallow(s => s.tasks));
  const tick = useAppStore(s => s.tick);
  const toggleTimer = useAppStore(s => s.toggleTimer);
  const stopFocus = useAppStore(s => s.stopFocus);
  const completeTask = useAppStore(s => s.completeTask);
  const saveSessionNote = useAppStore(s => s.saveSessionNote);
  const [showSummary, setShowSummary] = useState(false);
  const [summaryNote, setSummaryNote] = useState('');
  const activeTask = useMemo(() => tasks.find(t => t.id === activeTaskId), [tasks, activeTaskId]);
  useEffect(() => {
    let interval: any;
    if (isRunning && activeTaskId && !showSummary) {
      interval = setInterval(() => tick(), 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, activeTaskId, tick, showSummary]);
  useEffect(() => {
    if (timeLeft === 0 && activeTaskId && isRunning) {
      playSound('ding');
      if (window.navigator.vibrate) window.navigator.vibrate([300, 100, 300]);
      toast.success("专注时段结束，建���师应当小憩片刻。");
      setShowSummary(true);
      triggerConfetti();
    }
  }, [timeLeft, activeTaskId, isRunning]);
  const handleFinishSession = useCallback(() => {
    if (activeTaskId) {
      if (summaryNote.trim()) {
        saveSessionNote(activeTaskId, summaryNote);
      }
      setShowSummary(false);
      setSummaryNote('');
      stopFocus();
    }
  }, [activeTaskId, summaryNote, saveSessionNote, stopFocus]);
  const handleTaskComplete = useCallback(() => {
    if (activeTaskId) {
      playSound('success');
      triggerConfetti();
      completeTask(activeTaskId);
      stopFocus();
    }
  }, [activeTaskId, completeTask, stopFocus]);
  if (!activeTaskId) return null;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center p-6 overflow-hidden"
      >
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
          <motion.div
            animate={{ rotate: 360, scale: [1, 1.1, 1] }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140vw] h-[140vw] border-[2px] border-dashed border-primary/20 rounded-full"
          />
          {isRunning && (
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,hsl(var(--primary)/0.03)_100%)] animate-pulse" />
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-8 right-8 h-16 w-16 rounded-full bg-secondary/50 backdrop-blur-xl hover:bg-secondary active:scale-90 z-[110]"
          onClick={stopFocus}
        >
          <X className="h-10 w-10" />
        </Button>
        {!showSummary ? (
          <div className="w-full max-w-4xl text-center space-y-16 relative z-10">
            <motion.div layout className="space-y-6">
              <Badge className={cn(
                "px-8 py-2 text-sm rounded-full font-bold uppercase tracking-[0.2em] border-none shadow-lg",
                isRunning ? "bg-red-500 text-white" : isPaused ? "bg-amber-500 text-white" : "bg-primary text-primary-foreground"
              )}>
                {isRunning ? "正在进���深度构筑" : isPaused ? "构筑暂停中" : "准备进���专注态"}
              </Badge>
              <h2 className="text-5xl md:text-7xl font-display font-bold tracking-tight leading-tight px-4 max-w-3xl mx-auto">
                {activeTask?.title}
              </h2>
            </motion.div>
            <div className="relative flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${timeLeft}-${isRunning}`}
                  initial={{ scale: 0.8, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  className={cn(
                    "text-[12rem] md:text-[22rem] font-bold tabular-nums tracking-tighter leading-none transition-colors duration-1000",
                    isRunning ? "text-foreground" : "text-muted-foreground/30"
                  )}
                >
                  {minutes}<span className={cn("text-primary/30 mx-[-0.02em] transition-opacity", isRunning ? "animate-pulse" : "opacity-40")}>:</span>{seconds.toString().padStart(2, '0')}
                </motion.div>
              </AnimatePresence>
              {isPaused && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 40 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className="absolute inset-0 flex items-center justify-center backdrop-blur-md rounded-full"
                >
                  <div className="bg-background/90 p-12 rounded-[4rem] shadow-2xl border-4 border-amber-500/20 flex flex-col items-center gap-6">
                    <Coffee className="h-20 w-20 text-amber-500" />
                    <div className="text-center">
                      <p className="font-display font-bold text-3xl">短暂休憩</p>
                      <p className="text-muted-foreground font-medium">伟大的作品需要身心的��息</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
            <div className="flex items-center justify-center gap-10">
              <Button
                size="lg"
                variant="outline"
                className="h-28 w-28 rounded-[3rem] border-4 bg-background/50 backdrop-blur-md hover:bg-secondary transition-all active:scale-90 group shadow-xl"
                onClick={toggleTimer}
              >
                {isRunning ? <Pause className="h-12 w-12" /> : <Play className="h-12 w-12 ml-2 fill-current" />}
              </Button>
              <Button
                size="lg"
                className="h-28 px-12 rounded-[3rem] text-2xl font-bold gap-4 shadow-2xl shadow-primary/30 hover:scale-[1.02] transition-all active:scale-95"
                onClick={handleTaskComplete}
              >
                <CheckCircle2 className="h-10 w-10" />
                完成构筑
              </Button>
            </div>
            <motion.div
              animate={{ opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="text-muted-foreground italic text-xl font-display font-medium max-w-2xl mx-auto"
            >
              "在深度工作的寂静中，每一个想法都在精雕细琢，直到它成为永恒的蓝图。"
            </motion.div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl bg-card p-12 rounded-[4rem] shadow-2xl border-none text-center space-y-10 relative z-20"
          >
            <div className="bg-primary/10 h-28 w-28 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <Sparkles className="h-14 w-14 text-primary" />
            </div>
            <div className="space-y-4">
              <h2 className="text-4xl font-display font-bold">专注阶段完成��</h2>
              <p className="text-muted-foreground text-xl font-medium">你刚刚完成了 25 分钟的深度工作，记录下当下的感悟或进展���</p>
            </div>
            <Textarea
              placeholder="例如：完成了核心逻辑的重���，下一步准备编写测试用例..."
              value={summaryNote}
              onChange={(e) => setSummaryNote(e.target.value)}
              className="min-h-[160px] rounded-3xl bg-secondary/50 border-none p-6 text-lg focus-visible:ring-primary/20 resize-none"
            />
            <div className="flex flex-col gap-4">
              <Button className="h-16 rounded-[2rem] text-xl font-bold gap-3 shadow-xl" onClick={handleFinishSession}>
                <Send className="h-6 w-6" /> 保存并休息
              </Button>
              <Button variant="ghost" className="h-16 rounded-[2rem] text-lg font-medium text-muted-foreground" onClick={handleFinishSession}>
                跳过记录
              </Button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}