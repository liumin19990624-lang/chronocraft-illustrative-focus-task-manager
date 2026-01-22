import React from 'react';
import { Task, Priority, TaskType } from '@shared/types';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, Clock, BookOpen, Headphones, PenTool, Hash, Calendar, CheckCircle2, Flame, Sparkles, Waves, ExternalLink } from 'lucide-react';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { triggerTaskCompletionConfetti } from '@/components/ui/confetti';
import { useAppStore } from '@/store/use-app-store';
import { motion, useAnimation } from 'framer-motion';
import { toast } from 'sonner';
import { playSound } from '@/lib/audio';
import { useSwipeable } from 'react-swipeable';
import { useNavigate } from 'react-router-dom';
const priorityConfig: Record<Priority, { color: string; label: string; icon: any; glow: string }> = {
  1: { color: "bg-red-500", label: "P0-火急", icon: Flame, glow: "shadow-red-500/20" },
  2: { color: "bg-orange-500", label: "P1-重��", icon: Sparkles, glow: "shadow-orange-500/20" },
  3: { color: "bg-blue-500", label: "P2-普通", icon: Waves, glow: "shadow-blue-500/20" },
  4: { color: "bg-slate-400", label: "P3-随意", icon: Hash, glow: "shadow-slate-400/20" },
};
const typeIcons: Record<TaskType, React.ReactNode> = {
  reading: <BookOpen className="h-5 w-5" />,
  listening: <Headphones className="h-5 w-5" />,
  writing: <PenTool className="h-5 w-5" />,
  other: <Hash className="h-5 w-5" />,
};
const typePaths: Record<TaskType, string> = {
  reading: '/papers',
  listening: '/listening',
  writing: '/writer',
  other: '/vocab',
};
export function TaskCard({ task }: { task: Task }) {
  const completeTask = useAppStore(s => s.completeTask);
  const startFocus = useAppStore(s => s.startFocus);
  const activeTaskId = useAppStore(s => s.timer.activeTaskId);
  const navigate = useNavigate();
  const isCompleted = task.status === 2;
  const isActive = activeTaskId === task.id;
  const PriorityIcon = priorityConfig[task.priority].icon;
  const controls = useAnimation();
  const handleComplete = (e?: React.MouseEvent) => {
    if (isCompleted) return;
    playSound('success');
    if (e) {
      triggerTaskCompletionConfetti(e.clientX, e.clientY);
    } else {
      triggerTaskCompletionConfetti(window.innerWidth / 2, window.innerHeight / 2);
    }
    completeTask(task.id);
    toast.success(`学术突破: "${task.title}"`);
  };
  const handlers = useSwipeable({
    onSwipedLeft: () => controls.start({ x: 0 }),
    onSwipedRight: () => { if (!isCompleted) handleComplete(); controls.start({ x: 0 }); },
    onSwiping: (e) => { if (!isCompleted) controls.set({ x: e.deltaX }); },
    trackMouse: true,
    preventScrollOnSwipe: true,
  });
  return (
    <motion.div layout initial={{ opacity: 0, y: 20 }} animate={controls} whileHover={{ scale: 1.01 }} {...handlers}>
      <Card className={cn(
        "group relative flex items-stretch p-0 gap-0 border-none rounded-4xl overflow-hidden transition-all duration-300 bg-card/60 backdrop-blur-xl shadow-soft",
        isCompleted && "opacity-60 grayscale-[0.5]",
        isActive && "ring-4 ring-primary/20 scale-[1.02] shadow-2xl"
      )}>
        <div className={cn("w-3 shrink-0", priorityConfig[task.priority].color)} />
        <div className="flex-1 flex flex-col md:flex-row items-center p-8 gap-8 bg-inherit relative z-10">
          <div className={cn(
            "h-16 w-16 rounded-3xl flex items-center justify-center shrink-0 transition-transform group-hover:rotate-12 shadow-lg",
            isCompleted ? "bg-emerald-100 text-emerald-600" : "bg-primary/10 text-primary"
          )}>
            {isCompleted ? <CheckCircle2 className="h-8 w-8" /> : typeIcons[task.type]}
          </div>
          <div className="flex-1 space-y-4 w-full">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <h3 className={cn("text-2xl font-display font-bold", isCompleted && "line-through text-muted-foreground")}>
                {task.title}
              </h3>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="rounded-xl px-3 py-1 font-bold flex items-center gap-1.5 border-primary/20 bg-background/50">
                  <PriorityIcon className="h-3 w-3" />
                  {priorityConfig[task.priority].label}
                </Badge>
                {!isCompleted && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 rounded-xl px-3 font-bold text-xs gap-1.5 bg-primary/5 hover:bg-primary/10"
                    onClick={() => navigate(typePaths[task.type])}
                  >
                    前往修行 <ExternalLink className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-sm font-bold text-muted-foreground/70">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{formatDistanceToNow(parseISO(task.dueDate), { addSuffix: true, locale: zhCN })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <div className="flex items-center gap-1">
                   {Array.from({ length: Math.min(task.pomodoroEstimate, 5) }).map((_, i) => (
                     <div key={i} className={cn("h-1.5 w-1.5 rounded-full", i < task.pomodoroSpent ? "bg-primary" : "bg-muted-foreground/20")} />
                   ))}
                   {task.pomodoroEstimate > 5 && <span className="text-[10px] ml-1">+{task.pomodoroEstimate - 5}</span>}
                </div>
                <span className="ml-2">{task.pomodoroSpent} / {task.pomodoroEstimate} 番茄���</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            {!isCompleted && (
              <Button size="icon" className="h-16 w-16 rounded-3xl shadow-xl hover:scale-110 active:scale-95 transition-all" onClick={() => startFocus(task.id)}>
                <Play className="h-8 w-8 fill-current" />
              </Button>
            )}
            <button
              onClick={(e) => handleComplete(e)}
              disabled={isCompleted}
              className={cn(
                "h-16 w-16 rounded-3xl border-2 flex items-center justify-center transition-all",
                isCompleted ? "bg-emerald-500 border-emerald-500 text-white" : "border-muted-foreground/20 hover:border-emerald-500 hover:text-emerald-500"
              )}
            >
              <CheckCircle2 className="h-8 w-8" />
            </button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}