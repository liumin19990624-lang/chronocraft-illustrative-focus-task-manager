import React from 'react';
import { Task, Priority, TaskType } from '@shared/types';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, Clock, BookOpen, Headphones, PenTool, Hash, Calendar, CheckCircle2 } from 'lucide-react';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { triggerTaskCompletionConfetti } from '@/components/ui/confetti';
import { useAppStore } from '@/store/use-app-store';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
interface TaskCardProps {
  task: Task;
}
const priorityConfig: Record<Priority, { color: string; label: string }> = {
  1: { color: "bg-red-500", label: "P1 紧急" },
  2: { color: "bg-blue-500", label: "P2 重要" },
  3: { color: "bg-slate-400", label: "P3 普通" },
  4: { color: "bg-green-500", label: "P4 随意" },
};
const typeIcons: Record<TaskType, React.ReactNode> = {
  reading: <BookOpen className="h-4 w-4" />,
  listening: <Headphones className="h-4 w-4" />,
  writing: <PenTool className="h-4 w-4" />,
  other: <Hash className="h-4 w-4" />,
};
export function TaskCard({ task }: TaskCardProps) {
  const completeTask = useAppStore(s => s.completeTask);
  const startFocus = useAppStore(s => s.startFocus);
  const activeTaskId = useAppStore(s => s.timer.activeTaskId);
  const isCompleted = task.status === 'completed';
  const isActive = activeTaskId === task.id;
  const handleComplete = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerTaskCompletionConfetti(e.clientX, e.clientY);
    completeTask(task.id);
    toast.success(`构筑完成: "${task.title}"`, {
      description: "获得 +10 经验值",
      icon: <TrophyIcon className="h-4 w-4 text-yellow-500" />
    });
  };
  const progressPercent = Math.min(100, (task.pomodoroSpent / task.pomodoroEstimate) * 100);
  return (
    <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className={cn(
        "group relative flex items-stretch p-0 gap-0 border-none rounded-[2rem] overflow-hidden transition-all duration-300 hover:shadow-xl hover:translate-y-[-2px] bg-card/50 backdrop-blur-sm",
        isCompleted && "opacity-60 grayscale",
        isActive && "ring-2 ring-primary ring-offset-4 ring-offset-background"
      )}>
        {/* Priority Strip */}
        <div className={cn("w-1.5 shrink-0", priorityConfig[task.priority].color)} />
        <div className="flex-1 flex flex-col md:flex-row items-center p-6 gap-6">
          <div className={cn(
            "h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors",
            isCompleted ? "bg-green-100 text-green-600" : "bg-primary/5 text-primary"
          )}>
            {isCompleted ? <CheckCircle2 className="h-6 w-6" /> : typeIcons[task.type]}
          </div>
          <div className="flex-1 space-y-3 w-full text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-2">
              <h3 className={cn(
                "font-display font-bold text-xl tracking-tight line-clamp-2",
                isCompleted && "line-through text-muted-foreground"
              )}>
                {task.title}
              </h3>
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <Badge variant="outline" className="rounded-lg text-[10px] font-bold uppercase tracking-wider py-0.5">
                  {priorityConfig[task.priority].label}
                </Badge>
                {isActive && (
                  <Badge className="bg-blue-100 text-blue-700 animate-pulse border-none rounded-lg text-[10px] font-bold">
                    专注��
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-5 gap-y-2 text-xs text-muted-foreground font-medium">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                <span>{formatDistanceToNow(parseISO(task.dueDate), { addSuffix: true })} • {task.dueTime}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                <span>{task.pomodoroSpent} / {task.pomodoroEstimate} 番茄钟</span>
              </div>
            </div>
            {/* Progress Bar */}
            <div className="h-1.5 w-full bg-secondary/40 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                className={cn("h-full rounded-full transition-all duration-1000", isCompleted ? "bg-green-500" : "bg-primary")}
              />
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {!isCompleted && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-2xl h-14 w-14 hover:bg-primary/10 hover:text-primary transition-all active:scale-90"
                  onClick={() => startFocus(task.id)}
                >
                  <Play className="h-6 w-6 fill-current" />
                </Button>
                <button
                  onClick={handleComplete}
                  className="h-14 w-14 rounded-2xl border-2 border-muted-foreground/20 hover:border-green-500 hover:bg-green-50 flex items-center justify-center group/check transition-all active:scale-90"
                >
                  <CheckCircle2 className="h-6 w-6 text-muted-foreground/20 group-hover/check:text-green-600 transition-colors" />
                </button>
              </>
            )}
            {isCompleted && (
               <div className="h-14 w-14 rounded-2xl bg-green-500 text-white flex items-center justify-center">
                  <CheckCircle2 className="h-7 w-7" />
               </div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
function TrophyIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
  );
}