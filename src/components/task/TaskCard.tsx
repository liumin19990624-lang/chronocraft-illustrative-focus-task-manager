import React from 'react';
import { Task, Priority, TaskType } from '@shared/types';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, Clock, BookOpen, Headphones, PenTool, Hash, Calendar, CheckCircle2, Archive, RotateCcw } from 'lucide-react';
import { formatDistanceToNow, parseISO, isPast, differenceInHours } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { triggerTaskCompletionConfetti } from '@/components/ui/confetti';
import { useAppStore } from '@/store/use-app-store';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { playSound } from '@/lib/audio';
interface TaskCardProps {
  task: Task;
}
const priorityConfig: Record<Priority, { color: string; label: string }> = {
  1: { color: "bg-red-500", label: "P1 紧急" },
  2: { color: "bg-blue-500", label: "P2 重要" },
  3: { color: "bg-slate-400", label: "P3 普通" },
  4: { color: "bg-green-500", label: "P4 随意" },
};
const statusLabels: Record<string, string> = {
  'todo': '未开始',
  'in-progress': '进行中',
  'completed': '已完成',
  'archived': '已归档'
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
  const updateTask = useAppStore(s => s.updateTask);
  const activeTaskId = useAppStore(s => s.timer.activeTaskId);
  const isCompleted = task.status === 'completed';
  const isArchived = task.isArchived;
  const isActive = activeTaskId === task.id;
  const dueDateTime = parseISO(task.dueDate);
  const isOverdue = !isCompleted && isPast(dueDateTime) && Math.abs(differenceInHours(new Date(), dueDateTime)) > 0;
  const handleComplete = (e: React.MouseEvent) => {
    e.stopPropagation();
    playSound('success');
    if (window.navigator.vibrate) window.navigator.vibrate(100);
    triggerTaskCompletionConfetti(e.clientX, e.clientY);
    completeTask(task.id);
    toast.success(`构筑完成: "${task.title}"`, {
      description: "获得 +10 经验值",
    });
  };
  const toggleArchive = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newArchived = !isArchived;
    updateTask(task.id, { 
      isArchived: newArchived, 
      status: newArchived ? 'archived' : (isCompleted ? 'completed' : 'todo') 
    });
    toast.info(newArchived ? "蓝图已移至档案室" : "蓝图已重新激活");
  };
  const getDisplayTime = () => {
    if (isCompleted) return `完成于 ${task.completedAt ? formatDistanceToNow(parseISO(task.completedAt), { addSuffix: true, locale: zhCN }) : '近期'}`;
    const dist = formatDistanceToNow(dueDateTime, { addSuffix: true, locale: zhCN });
    return isOverdue ? `已过期 (${dist})` : dist;
  };
  const progressPercent = Math.min(100, (task.pomodoroSpent / task.pomodoroEstimate) * 100);
  return (
    <motion.div 
      layout 
      initial={{ opacity: 0, scale: 0.95 }} 
      animate={{ opacity: 1, scale: 1 }} 
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
    >
      <Card className={cn(
        "group relative flex items-stretch p-0 gap-0 border-none rounded-[2rem] overflow-hidden transition-all duration-300 bg-card/50 backdrop-blur-md shadow-soft hover:shadow-xl",
        isCompleted && "opacity-70",
        isArchived && "grayscale opacity-50",
        isActive && "ring-4 ring-primary/20 bg-primary/[0.02]"
      )}>
        <div className={cn("w-2 shrink-0 transition-colors", priorityConfig[task.priority].color)} />
        <div className="flex-1 flex flex-col md:flex-row items-center p-6 gap-6">
          <div className={cn(
            "h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 transition-all shadow-sm",
            isCompleted ? "bg-green-100 text-green-600" : "bg-primary/5 text-primary group-hover:bg-primary/10"
          )}>
            {isCompleted ? <CheckCircle2 className="h-7 w-7" /> : typeIcons[task.type]}
          </div>
          <div className="flex-1 space-y-4 w-full">
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <h3 className={cn(
                "font-display font-bold text-xl tracking-tight line-clamp-1",
                isCompleted && "line-through text-muted-foreground"
              )}>
                {task.title}
              </h3>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="rounded-lg text-[10px] font-bold uppercase tracking-widest border-primary/20 px-2 py-0.5">
                  {priorityConfig[task.priority].label}
                </Badge>
                <Badge className={cn(
                  "rounded-lg text-[10px] font-bold px-2 py-0.5",
                  isCompleted ? "bg-green-100 text-green-700" : isOverdue ? "bg-red-100 text-red-700" : "bg-blue-50 text-blue-600"
                )}>
                  {isOverdue ? "已过期" : statusLabels[task.status]}
                </Badge>
                {isActive && (
                  <Badge className="bg-primary text-primary-foreground animate-pulse rounded-lg text-[10px] font-bold">
                    正在专注
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-bold text-muted-foreground/80">
              <div className={cn("flex items-center gap-2", isOverdue && "text-red-500")}>
                <Calendar className="h-3.5 w-3.5" />
                <span>{getDisplayTime()} • {task.dueTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5" />
                <span>{task.pomodoroSpent} / {task.pomodoroEstimate} 番茄钟</span>
              </div>
            </div>
            <div className="h-2 w-full bg-secondary/60 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                className={cn("h-full rounded-full transition-all duration-1000 shadow-sm", isCompleted ? "bg-green-500" : "bg-primary")}
              />
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {!isCompleted && !isArchived && (
              <Button
                variant="ghost"
                size="icon"
                className="rounded-2xl h-14 w-14 hover:bg-primary/10 hover:text-primary transition-all active:scale-90"
                onClick={() => startFocus(task.id)}
              >
                <Play className="h-7 w-7 fill-current" />
              </Button>
            )}
            {!isArchived && (
              <button
                onClick={handleComplete}
                disabled={isCompleted}
                className={cn(
                  "h-14 w-14 rounded-2xl border-2 flex items-center justify-center transition-all active:scale-90",
                  isCompleted ? "bg-green-500 border-green-500 text-white cursor-default" : "border-muted-foreground/20 hover:border-green-500 hover:bg-green-50 text-muted-foreground/40 hover:text-green-600"
                )}
              >
                <CheckCircle2 className="h-7 w-7" />
              </button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="rounded-2xl h-14 w-14 text-muted-foreground/40 hover:bg-secondary hover:text-foreground"
              onClick={toggleArchive}
            >
              {isArchived ? <RotateCcw className="h-6 w-6" /> : <Archive className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}