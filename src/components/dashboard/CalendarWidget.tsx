import React, { useMemo, useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useAppStore } from '@/store/use-app-store';
import { isSameDay, parseISO, isPast, isToday, format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, LayoutList, PieChart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
export function CalendarWidget() {
  const tasks = useAppStore(s => s.tasks);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const tasksForSelectedDay = useMemo(() => {
    if (!date) return [];
    return tasks.filter(t => isSameDay(parseISO(t.dueDate), date) && !t.isArchived);
  }, [date, tasks]);
  const stats = useMemo(() => {
    const total = tasksForSelectedDay.length;
    const completed = tasksForSelectedDay.filter(t => t.status === 'completed').length;
    return { total, completed, pending: total - completed };
  }, [tasksForSelectedDay]);
  const modifiers = useMemo(() => {
    return {
      completed: tasks.filter(t => t.status === 'completed').map(t => parseISO(t.dueDate)),
      overdue: tasks.filter(t => t.status !== 'completed' && isPast(parseISO(t.dueDate)) && !isToday(parseISO(t.dueDate))).map(t => parseISO(t.dueDate)),
      pending: tasks.filter(t => t.status !== 'completed' && !isPast(parseISO(t.dueDate))).map(t => parseISO(t.dueDate)),
    };
  }, [tasks]);
  const modifierStyles = {
    completed: { color: 'rgb(34 197 94)', borderBottom: '3px solid rgb(34 197 94)' },
    overdue: { color: 'rgb(239 68 68)', borderBottom: '3px solid rgb(239 68 68)' },
    pending: { color: 'rgb(100 116 139)', borderBottom: '3px solid rgb(100 116 139)' },
  };
  return (
    <Card className="border-none shadow-soft bg-secondary/20 rounded-[3rem] overflow-hidden">
      <CardHeader className="pb-2 pt-10 px-10">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-display font-bold">时间视野</CardTitle>
          <PieChart className="h-6 w-6 text-primary/40" />
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          locale={zhCN}
          className="rounded-3xl bg-transparent p-4 mx-auto"
          modifiers={modifiers}
          modifiersStyles={modifierStyles}
          classNames={{
            day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground rounded-2xl shadow-lg shadow-primary/20",
            day_today: "bg-primary/10 text-primary font-black rounded-2xl",
            day: "h-12 w-12 p-0 font-bold rounded-2xl text-base transition-all hover:bg-white active:scale-90",
            head_cell: "text-muted-foreground/60 w-12 font-bold text-[0.8rem] uppercase tracking-[0.2em] pb-6",
            table: "w-full border-collapse space-y-1",
          }}
        />
        <AnimatePresence mode="wait">
          <motion.div 
            key={date?.toISOString() || 'none'}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-6 bg-background/60 backdrop-blur-xl rounded-[2.5rem] p-8 space-y-6 shadow-sm border border-white/40"
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-black uppercase tracking-widest text-muted-foreground/60">
                  {date ? format(date, 'MM月dd��', { locale: zhCN }) : '未选择'}
                </h4>
                <p className="text-xl font-display font-bold mt-1">当日蓝图</p>
              </div>
              <Badge variant="outline" className="rounded-xl px-3 py-1 font-bold text-primary border-primary/20">
                {stats.completed}/{stats.total} 完成
              </Badge>
            </div>
            <ScrollArea className="h-[220px] pr-4">
              <div className="space-y-4">
                {tasksForSelectedDay.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                    <LayoutList className="h-10 w-10 text-muted-foreground/20" />
                    <p className="text-base text-muted-foreground font-display italic">
                      “���日无蓝图，正是休憩时”
                    </p>
                  </div>
                ) : (
                  tasksForSelectedDay.map(t => (
                    <div key={t.id} className="group flex items-center justify-between gap-4 p-4 rounded-2xl bg-white/40 hover:bg-white shadow-sm transition-all cursor-default hover:scale-[1.02]">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-2 h-8 rounded-full",
                          t.status === 'completed' ? 'bg-green-500' : 'bg-primary'
                        )} />
                        <div>
                          <p className={cn(
                            "text-sm font-bold line-clamp-1",
                            t.status === 'completed' && 'line-through text-muted-foreground/60'
                          )}>
                            {t.title}
                          </p>
                          <p className="text-[10px] text-muted-foreground font-black uppercase tracking-wider mt-1">
                            {t.dueTime} • {t.pomodoroSpent}/{t.pomodoroEstimate} 番茄钟
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground/20 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </motion.div>
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}