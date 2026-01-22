import React from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Toaster } from '@/components/ui/sonner';
import { TaskCard } from '@/components/task/TaskCard';
import { CalendarWidget } from '@/components/dashboard/CalendarWidget';
import { FocusOverlay } from '@/components/focus/FocusOverlay';
import { useAppStore } from '@/store/use-app-store';
import { Sparkles, Plus, Trophy, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
export function HomePage() {
  const tasks = useAppStore(s => s.tasks);
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.status === 'completed' && b.status !== 'completed') return 1;
    if (a.status !== 'completed' && b.status === 'completed') return -1;
    return a.priority - b.priority;
  });
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12">
        <ThemeToggle />
        <FocusOverlay />
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary rounded-xl text-primary-foreground">
                <Sparkles className="h-6 w-6" />
              </div>
              <h1 className="text-4xl font-display font-bold">ChronoCraft</h1>
            </div>
            <p className="text-muted-foreground max-w-md">
              Welcome back, Architect. You have {tasks.filter(t => t.status !== 'completed').length} blueprints to execute today.
            </p>
          </div>
          <div className="flex items-center gap-4 bg-secondary/50 p-4 rounded-2xl border border-border">
            <div className="flex items-center gap-2 px-3 border-r border-border">
              <Flame className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-[10px] font-bold uppercase text-muted-foreground">Streak</p>
                <p className="font-display font-bold">12 Days</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-[10px] font-bold uppercase text-muted-foreground">Level</p>
                <p className="font-display font-bold">Master</p>
              </div>
            </div>
          </div>
        </header>
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <section className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-display font-bold">Task Deck</h2>
              <Button size="sm" className="rounded-full gap-2">
                <Plus className="h-4 w-4" /> New Plan
              </Button>
            </div>
            <div className="space-y-4">
              {sortedTasks.map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </section>
          <aside className="lg:col-span-4 space-y-8">
            <CalendarWidget />
            <div className="p-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl text-white space-y-4 shadow-xl">
              <h3 className="text-xl font-display font-bold">Craftsman Tip</h3>
              <p className="text-indigo-100 text-sm leading-relaxed">
                "The focus block is your canvas. Don't let notifications smudge your masterpiece."
              </p>
              <Button variant="secondary" className="w-full bg-white/20 hover:bg-white/30 border-none text-white font-bold">
                Read More
              </Button>
            </div>
          </aside>
        </main>
      </div>
      <Toaster richColors />
    </div>
  );
}