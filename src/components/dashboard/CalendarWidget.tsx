import React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useAppStore } from '@/store/use-app-store';
import { isSameDay, parseISO } from 'date-fns';
export function CalendarWidget() {
  const tasks = useAppStore(s => s.tasks);
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const taskDates = tasks.map(t => parseISO(t.dueDate));
  return (
    <Card className="border-none shadow-none bg-secondary/30">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Planning Horizon</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="p-3 pointer-events-none"
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
        />
        <div className="px-6 py-4 space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Today's Focus</h4>
          <div className="space-y-2">
            {tasks.filter(t => isSameDay(parseISO(t.dueDate), new Date())).length === 0 ? (
              <p className="text-xs text-muted-foreground italic">No tasks due today. Lucky you!</p>
            ) : (
              tasks.filter(t => isSameDay(parseISO(t.dueDate), new Date())).map(t => (
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