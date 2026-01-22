import React from 'react';
import { Task, Priority } from '@/types/app-types';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Play, Clock, MoreVertical, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { triggerTaskCompletionConfetti } from '@/components/ui/confetti';
import { useAppStore } from '@/store/use-app-store';
interface TaskCardProps {
  task: Task;
}
const priorityColors: Record<Priority, string> = {
  1: "border-l-red-500",
  2: "border-l-orange-500",
  3: "border-l-blue-500",
  4: "border-l-slate-400",
};
export function TaskCard({ task }: TaskCardProps) {
  const completeTask = useAppStore(s => s.completeTask);
  const startFocus = useAppStore(s => s.startFocus);
  const handleComplete = (e: React.MouseEvent) => {
    triggerTaskCompletionConfetti(e.clientX, e.clientY);
    completeTask(task.id);
  };
  return (
    <Card className={cn(
      "group relative flex items-center p-4 gap-4 border-l-4 transition-all hover:shadow-md bg-card",
      priorityColors[task.priority],
      task.status === 'completed' && "opacity-60 grayscale"
    )}>
      <div className="flex items-center justify-center">
        <Checkbox 
          checked={task.status === 'completed'}
          onCheckedChange={() => {}} 
          onClick={(e) => handleComplete(e)}
          className="h-6 w-6 rounded-full"
        />
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <h3 className={cn(
            "font-semibold text-lg tracking-tight",
            task.status === 'completed' && "line-through text-muted-foreground"
          )}>
            {task.title}
          </h3>
          {task.status === 'in-progress' && (
            <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
              In Focus
            </Badge>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{formatDistanceToNow(new Date(task.dueDate), { addSuffix: true })}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{task.pomodoroSpent}/{task.pomodoroEstimate} poms</span>
          </div>
          <div className="flex items-center gap-1">
            {task.tags.map(tag => (
              <span key={tag} className="bg-secondary px-1.5 py-0.5 rounded text-[10px]">#{tag}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {task.status !== 'completed' && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full hover:bg-primary/10 hover:text-primary"
            onClick={() => startFocus(task.id)}
          >
            <Play className="h-5 w-5 fill-current" />
          </Button>
        )}
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}