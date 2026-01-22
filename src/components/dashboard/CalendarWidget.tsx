import React, { useMemo } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useAppStore } from '@/store/use-app-store';
import { isSameDay, parseISO, isPast, isToday } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { ChevronRight } from 'lucide-react';
export function CalendarWidget() {
  const tasks = useAppStore(s => s.tasks);
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const taskDates = useMemo(() => tasks.map(t => parseISO(t.dueDate)), [tasks]);
  const tasksForSelectedDay = useMemo(() => {
    if (!date) return [];
    return tasks.filter(t => isSameDay(parseISO(t.dueDate), date));
  }, [date, tasks]);
  const modifiers = {
    hasTask: taskDates,
    overdue: tasks.filter(t => t.status !== 'completed' && isPast(parseISO(t.dueDate)) && !isToday(parseISO(t.dueDate))).map(t => parseISO(t.dueDate)),
    completed: tasks.filter(t => t.status === 'completed').map(t => parseISO(t.dueDate))
  };
  const modifierStyles = {
    hasTask: { fontWeight: 'bold' },
    overdue: { color: 'hsl(var(--destructive))', borderBottom: '2px solid hsl(var(--destructive))' },
    completed: { color: 'rgb(34 197 94)', borderBottom: '2px solid rgb(34 197 94)' }
  };
  return (
    <Card className="border-none shadow-none bg-secondary/20 rounded-[2.5rem] overflow-hidden">
      <CardHeader className="pb-2 pt-8 px-8">
        <CardTitle className="text-xl font-display font-bold">时间视野</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-3xl bg-transparent p-4"
          modifiers={modifiers}
          modifiersStyles={modifierStyles}
          classNames={{
            day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground rounded-xl",
            day_today: "bg-accent text-accent-foreground rounded-xl",
            day: "h-10 w-10 p-0 font-bold rounded-xl text-sm transition-all hover:bg-secondary active:scale-90",
            head_cell: "text-muted-foreground w-10 font-bold text-[0.7rem] uppercase tracking-widest pb-4",
          }}
        />
        <div className="mt-4 bg-white/40 dark:bg-black/20 rounded-[2rem] p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">当日焦��</h4>
            <Badge variant="outline" className="rounded-lg px-2 py-0 font-bold">{tasksForSelectedDay.length}</Badge>
          </div>
          <ScrollArea className="h-[180px] pr-4">
            <div className="space-y-3">
              {tasksForSelectedDay.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <p className="text-sm text-muted-foreground italic font-display">
                    “今日无蓝图，正是休憩��”
                  </p>
                </div>
              ) : (
                tasksForSelectedDay.map(t => (
                  <div key={t.id} className="group flex items-center justify-between gap-3 p-3 rounded-2xl hover:bg-white/60 dark:hover:bg-black/40 transition-all cursor-default">
                    <div className="flex items-center gap-3">
                      <div className={`w-1.5 h-6 rounded-full ${t.status === 'completed' ? 'bg-green-500' : 'bg-primary'}`} />
                      <div>
                        <p className={`text-sm font-bold line-clamp-1 ${t.status === 'completed' ? 'line-through text-muted-foreground/60' : ''}`}>
                          {t.title}
                        </p>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold">{t.dueTime}</p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground/20 group-hover:text-primary transition-colors" />
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}