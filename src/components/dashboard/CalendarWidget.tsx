import React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useAppStore } from '@/store/use-app-store';
import { isSameDay, parseISO } from 'date-fns';
import { useShallow } from 'zustand/react/shallow';
export function CalendarWidget() {
  const tasks = useAppStore(useShallow(s => s.tasks));
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const taskDates = tasks
    .filter(t => t.status !== 'completed')
    .map(t => parseISO(t.dueDate));
  const tasksForSelectedDay = date ? tasks.filter(t => isSameDay(parseISO(t.dueDate), date)) : [];
  return (
    <Card className="border-none shadow-none bg-secondary/30 overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">���划视野</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="p-3"
          modifiers={{
            hasTask: taskDates,
          }}
          modifiersStyles={{
            hasTask: {
              fontWeight: 'bold',
              textDecoration: 'underline',
              color: 'hsl(var(--primary))'
            }
          }}
          classNames={{
            day: "h-9 w-9 p-0 font-normal",
            head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
            nav_button: "h-7 w-7",
          }}
        />
        <div className="px-4 sm:px-6 py-4 space-y-3 border-t">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">今日焦���</h4>
          <div className="space-y-2">
            {tasksForSelectedDay.length === 0 ? (
              <p className="text-xs text-muted-foreground italic">今天无任务，真��运！</p>
            ) : (
              tasksForSelectedDay.map(t => (
                <div key={t.id} className="flex items-center gap-2 text-sm">
                  <div className={`w-1.5 h-1.5 rounded-full ${t.status === 'completed' ? 'bg-green-500' : 'bg-primary'}`} />
                  <span className={t.status === 'completed' ? 'line-through text-muted-foreground' : ''}>{t.title}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}