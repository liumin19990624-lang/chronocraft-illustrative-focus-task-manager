import React, { useEffect, useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/use-app-store';
import { Button } from '@/components/ui/button';
import { Play, Pause, X, CheckCircle2, Ghost, HeartPulse, Waves, CloudRain, Library } from 'lucide-react';
import { triggerConfetti } from '@/components/ui/confetti';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
  const mode = useAppStore(s => s.timer.mode);
  const tasks = useAppStore(useShallow(s => s.tasks));
  const tick = useAppStore(s => s.tick);
  const toggleTimer = useAppStore(s => s.toggleTimer);
  const stopFocus = useAppStore(s => s.stopFocus);
  const setDistracted = useAppStore(s => s.setDistracted);
  const completePomodoro = useAppStore(s => s.completePomodoro);
  const userStats = useAppStore(s => s.userStats);
  const [spiritHealth, setSpiritHealth] = useState(100);
  const hiddenTimeRef = useRef<number | null>(null);
  const activeTask = useMemo(() => tasks.find(t => t.id === activeTaskId), [tasks, activeTaskId]);
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') {
        hiddenTimeRef.current = Date.now();
      } else if (hiddenTimeRef.current) {
        const diff = (Date.now() - hiddenTimeRef.current) / 1000;
        if (diff > 15 && isRunning && mode === 'focus') {
          setDistracted(true);
          setSpiritHealth(prev => Math.max(0, prev - 25));
          playSound('click');
          toast.warning("道心不���！", { description: "离开过久，损耗了 25% 的专注元气。" });
        }
        hiddenTimeRef.current = null;
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [isRunning, mode, setDistracted]);
  // Tick & Recovery Logic
  useEffect(() => {
    let interval: any;
    if (isRunning && activeTaskId) {
      interval = setInterval(() => {
        tick();
        if (mode !== 'focus') {
          setSpiritHealth(prev => Math.min(100, prev + 0.5));
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, activeTaskId, tick, mode]);
  useEffect(() => {
    if (timeLeft === 0 && activeTaskId && isRunning) {
      playSound('ding');
      triggerConfetti();
      completePomodoro();
      toast.success("潜修圆���！", { description: "周天运行完毕，神识获得洗礼。" });
    }
  }, [timeLeft, activeTaskId, isRunning, completePomodoro]);
  if (!activeTaskId) return null;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const glowColor = spiritHealth > 60 ? "shadow-primary/20" : spiritHealth > 30 ? "shadow-amber-500/20" : "shadow-red-500/30";
  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center p-10 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            animate={{
              scale: isRunning ? [1, 1.05, 1] : 1,
              opacity: isRunning ? [0.1, 0.15, 0.1] : 0.05
            }}
            transition={{ duration: 10, repeat: Infinity }}
            className={cn("absolute inset-0 blur-[120px] bg-gradient-radial from-primary/20 to-transparent", 
              spiritHealth < 30 && "from-red-500/10")}
          />
        </div>
        <div className="absolute top-10 left-0 right-0 px-10 flex items-center justify-between z-20">
          <div className="flex items-center gap-6 w-full max-w-sm">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <HeartPulse className={cn("h-6 w-6", spiritHealth < 30 ? "text-red-500 animate-pulse" : "text-primary")} />
            </div>
            <div className="flex-1 space-y-1.5">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                <span>专注元气 (Immersion)</span>
                <span>{Math.floor(spiritHealth)}%</span>
              </div>
              <Progress value={spiritHealth} className="h-2 bg-secondary rounded-full" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-secondary/50 px-6 py-2 rounded-2xl border border-border/50 backdrop-blur-md">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">当前境界</p>
              <p className="font-display font-bold text-sm">第 {userStats?.level || 1} 重境界</p>
            </div>
            <Button variant="ghost" size="icon" className="h-14 w-14 rounded-full bg-secondary/50" onClick={stopFocus}><X className="h-6 w-6" /></Button>
          </div>
        </div>
        <div className="w-full max-w-5xl text-center space-y-12 z-10 relative">
          <div className="space-y-6">
            <Badge className={cn("px-10 py-2.5 text-xs rounded-full font-bold uppercase tracking-[0.3em] shadow-xl",
              isDistracted ? "bg-amber-500 animate-pulse" : isRunning ? "bg-primary" : "bg-muted text-muted-foreground")}>
              {isDistracted ? "道心入魔 · 已走神" : isRunning ? "深度潜修中" : "入定中"}
            </Badge>
            <h2 className="text-7xl font-display font-bold tracking-tight px-4 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/60">
              {activeTask?.title}
            </h2>
          </div>
          <div className="relative group">
            <motion.div
              key={timeLeft}
              initial={{ scale: 0.98, opacity: 0.9 }}
              animate={{ scale: 1, opacity: 1 }}
              className={cn("text-[20rem] md:text-[25rem] font-bold tabular-nums tracking-tighter leading-none transition-all duration-700 select-none",
                isRunning ? "text-foreground drop-shadow-2xl" : "text-muted-foreground/10",
                glowColor)}
            >
              {minutes}<span className="text-primary/20 animate-pulse">:</span>{seconds.toString().padStart(2, '0')}
            </motion.div>
            {isDistracted && (
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="absolute inset-0 flex items-center justify-center backdrop-blur-2xl rounded-full z-30">
                <div className="bg-background/95 p-16 rounded-[4rem] border-4 border-amber-500/30 text-center space-y-8 shadow-[0_0_50px_rgba(245,158,11,0.2)]">
                  <Ghost className="h-24 w-24 text-amber-500 mx-auto animate-float" />
                  <div className="space-y-2">
                    <p className="text-4xl font-display font-bold">杂念丛生</p>
                    <p className="text-muted-foreground font-medium">道心出现裂缝���请速速归位。</p>
                  </div>
                  <Button size="lg" className="rounded-3xl h-16 px-16 text-xl font-bold bg-amber-500 hover:bg-amber-600" onClick={() => setDistracted(false)}>重拾道心</Button>
                </div>
              </motion.div>
            )}
          </div>
          <div className="flex items-center justify-center gap-10">
            <Button size="lg" variant="outline" className="h-28 w-28 rounded-[2.5rem] border-4 shadow-2xl hover:scale-110 transition-all bg-background/50 backdrop-blur-md" onClick={toggleTimer}>
              {isRunning ? <Pause className="h-12 w-12" /> : <Play className="h-12 w-12 ml-2 fill-current" />}
            </Button>
            <Button size="lg" className="h-28 px-16 rounded-[2.5rem] text-3xl font-bold gap-6 shadow-[0_20px_40px_rgba(0,0,0,0.2)] hover:translate-y-[-4px] transition-all" onClick={completePomodoro}>
              <CheckCircle2 className="h-12 w-12" /> 终证大道
            </Button>
          </div>
        </div>
        <div className="absolute bottom-12 flex flex-col items-center gap-6">
          <div className="flex items-center gap-3 bg-secondary/30 p-2 rounded-[2rem] border border-border/30 backdrop-blur-xl">
            <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl hover:bg-background"><Waves className="h-5 w-5" /></Button>
            <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl hover:bg-background"><CloudRain className="h-5 w-5" /></Button>
            <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl hover:bg-background"><Library className="h-5 w-5" /></Button>
            <div className="w-[1px] h-6 bg-border/50 mx-2" />
            <span className="px-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">沉浸环境音</span>
          </div>
          <motion.div animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 5, repeat: Infinity }} className="text-muted-foreground italic text-xl font-display max-w-2xl mx-auto text-center">
            “静以修身���俭以养德。非淡泊无以明志，非宁静无以致远。��
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}