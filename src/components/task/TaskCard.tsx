import React from 'react';
import { Task, Priority, TaskStatus } from '@/types/app-types';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, Clock, MoreVertical, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { triggerTaskCompletionConfetti } from '@/components/ui/confetti';
import { useAppStore } from '@/store/use-app-store';
import { useSwipeable } from 'react-swipeable';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
interface TaskCardProps {
  task: Task;
}
const priorityColors: Record<Priority, string> = {
  1: "border-l-red-500",
  2: "border-l-orange-500",
  3: "border-l-blue-500",
  4: "border-l-slate-400",
};
const statusMap: Record<TaskStatus, string> = {
  todo: '未开始',
  'in-progress': '进行中',
  completed: '已完成',
  archived: '已归档'
}
export function TaskCard({ task }: TaskCardProps) {
  const completeTask = useAppStore(s => s.completeTask);
  const deleteTask = useAppStore(s => s.deleteTask);
  const startFocus = useAppStore(s => s.startFocus);
  const activeTaskId = useAppStore(s => s.timer.activeTaskId);
  const handleComplete = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerTaskCompletionConfetti(e.clientX, e.clientY);
    completeTask(task.id);
    toast.success(`任务 "${task.title}" 已完成!`);
  };
  const handleDelete = () => {
    deleteTask(task.id);
    toast.error(`任务 "${task.title}" 已删除。`);
  };
  const handlers = useSwipeable({
    onSwipedLeft: () => handleDelete(),
    onSwipedRight: (e) => {
      triggerTaskCompletionConfetti(window.innerWidth - 50, e.event.clientY);
      completeTask(task.id);
      toast.success(`任务 "${task.title}" 已完成!`);
    },
    preventScrollOnSwipe: true,
    trackMouse: true
  });
  return (
    <motion.div {...handlers} layout transition={{ type: 'spring', stiffness: 500, damping: 50 }}>
      <Card className={cn(
        "group relative flex items-center p-4 gap-4 border-l-4 transition-all hover:shadow-md bg-card active:scale-[0.98] transform-gpu",
        priorityColors[task.priority],
        task.status === 'completed' && "opacity-60 grayscale",
        activeTaskId === task.id && "ring-2 ring-primary ring-offset-2 ring-offset-background"
      )}>
        <div className="flex items-center justify-center pl-2">
          {task.status !== 'completed' && <div onClick={(e) => handleComplete(e)} className="h-6 w-6 rounded-full border-2 border-muted-foreground/50 hover:border-primary cursor-pointer transition-all" />}
          {task.status === 'completed' && <div className="h-6 w-6 rounded-full bg-green-500" />}
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <h3 className={cn(
              "font-semibold text-base sm:text-lg tracking-tight",
              task.status === 'completed' && "line-through text-muted-foreground"
            )}>
              {task.title}
            </h3>
            {activeTaskId === task.id && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                专注中
              </Badge>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{formatDistanceToNow(new Date(task.dueDate), { addSuffix: true })}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{task.pomodoroSpent}/{task.pomodoroEstimate} 番茄</span>
            </div>
            <div className="flex items-center gap-1">
              {task.tags.map(tag => (
                <span key={tag} className="bg-secondary px-1.5 py-0.5 rounded text-[10px]">#{tag}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          {task.status !== 'completed' && (
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full h-10 w-10 hover:bg-primary/10 hover:text-primary"
              onClick={() => startFocus(task.id)}
            >
              <Play className="h-5 w-5 fill-current" />
            </Button>
          )}
          <Button variant="ghost" size="icon" className="text-muted-foreground h-10 w-10">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}