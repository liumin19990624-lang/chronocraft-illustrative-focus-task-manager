import React, { useEffect, useMemo } from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Toaster } from '@/components/ui/sonner';
import { TaskCard } from '@/components/task/TaskCard';
import { CalendarWidget } from '@/components/dashboard/CalendarWidget';
import { FocusOverlay } from '@/components/focus/FocusOverlay';
import { useAppStore } from '@/store/use-app-store';
import { Sparkles, Plus, Trophy, Flame, Inbox, BarChart3, Archive } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NewTaskDialog } from '@/components/task/NewTaskDialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { AppLayout } from '@/components/layout/AppLayout';
import { useShallow } from 'zustand/react/shallow';
export function HomePage() {
  const tasks = useAppStore(useShallow(s => s.tasks));
  const isLoading = useAppStore(s => s.isLoading);
  const fetchTasks = useAppStore(s => s.fetchTasks);
  const fetchStats = useAppStore(s => s.fetchStats);
  const activeTaskId = useAppStore(s => s.timer.activeTaskId);
  const showArchived = useAppStore(s => s.showArchived);
  const toggleShowArchived = useAppStore(s => s.toggleShowArchived);
  const streak = useAppStore(s => s.userStats.streak);
  const level = useAppStore(s => s.userStats.level);
  useEffect(() => {
    fetchTasks();
    fetchStats();
  }, [fetchTasks, fetchStats]);
  const sortedTasks = useMemo(() => {
    let filtered = tasks;
    if (!showArchived) {
      filtered = tasks.filter(t => !t.isArchived);
    }
    return [...filtered].sort((a, b) => {
      const aDone = a.status === 'completed';
      const bDone = b.status === 'completed';
      if (aDone !== bDone) return aDone ? 1 : -1;
      if (a.priority !== b.priority) return a.priority - b.priority;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
  }, [tasks, showArchived]);
  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const todaysTasks = tasks.filter(t => t.dueDate.startsWith(today));
    const completed = todaysTasks.filter(t => t.status === 'completed').length;
    const totalFocusMinutes = tasks.reduce((acc, t) => acc + (t.pomodoroSpent * 25), 0);
    const dailyGoal = 5;
    const progress = (completed / dailyGoal) * 100;
    return { completed, dailyGoal, progress, totalFocusHours: (totalFocusMinutes / 60).toFixed(1) };
  }, [tasks]);
  const incompleteCount = useMemo(() => 
    tasks.filter(t => t.status !== 'completed' && !t.isArchived).length,
  [tasks]);
  return (
    <AppLayout className="bg-background">
      <div className="py-8 md:py-10 lg:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <ThemeToggle className="fixed top-4 right-4" />
        <FocusOverlay />
        <div className={activeTaskId ? 'blur-xl grayscale opacity-40 transition-all duration-700 pointer-events-none' : 'transition-all duration-700'}>
          <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary rounded-[1.25rem] text-primary-foreground shadow-xl shadow-primary/20 rotate-[-5deg] hover:rotate-0 transition-transform">
                  <Sparkles className="h-8 w-8" />
                </div>
                <div>
                  <h1 className="text-5xl font-display font-bold tracking-tight">ChronoCraft</h1>
                  <p className="text-muted-foreground font-medium text-lg mt-1">
                    早安，建��师。今日尚有 <span className="text-foreground font-bold underline decoration-primary/40 underline-offset-4">{incompleteCount}</span> 个任务蓝图。
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-secondary/30 backdrop-blur-xl p-2 rounded-[2rem] border border-border/50 shadow-soft group hover:bg-secondary/50 transition-colors">
              <div className="flex items-center gap-3 px-6 py-3 border-r border-border/50">
                <Flame className="h-7 w-7 text-orange-500 drop-shadow-sm" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">连续构筑</p>
                  <p className="font-display font-bold text-xl leading-none mt-1">{streak} Days</p>
                </div>
              </div>
              <div className="flex items-center gap-3 px-6 py-3">
                <Trophy className="h-7 w-7 text-yellow-500 drop-shadow-sm" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">工匠等级</p>
                  <p className="font-display font-bold text-xl leading-none mt-1">Lv.{level}</p>
                </div>
              </div>
            </div>
          </header>
          <main className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <section className="lg:col-span-8 space-y-10">
              <div className="bg-gradient-to-r from-primary/5 to-transparent p-8 rounded-[2.5rem] border border-primary/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-4 flex-1">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    <h3 className="font-display font-bold text-xl">今日进度看板</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm font-bold">
                      <span>构筑进度 ({stats.completed}/{stats.dailyGoal})</span>
                      <span>{Math.round(stats.progress)}%</span>
                    </div>
                    <Progress value={stats.progress} className="h-3 rounded-full bg-secondary" />
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="text-center bg-background/60 p-4 rounded-2xl min-w-[100px] border">
                    <p className="text-2xl font-display font-bold">{stats.totalFocusHours}</p>
                    <p className="text-[10px] font-bold uppercase text-muted-foreground">专注时数</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-4">
                  <h2 className="text-3xl font-display font-bold">任务卡组</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleShowArchived}
                    className={cn("rounded-xl gap-2 text-xs font-bold uppercase tracking-widest", showArchived && "bg-accent text-accent-foreground shadow-sm")}
                  >
                    <Archive className="h-4 w-4" />
                    {showArchived ? "隐藏���归档" : "查看归档"}
                  </Button>
                </div>
                <NewTaskDialog>
                  <Button className="rounded-2xl gap-3 px-8 h-14 text-lg font-bold shadow-2xl shadow-primary/20 hover:scale-105 transition-all">
                    <Plus className="h-5 w-5" /> 开始新蓝图
                  </Button>
                </NewTaskDialog>
              </div>
              <div className="space-y-6">
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-40 w-full rounded-[2rem]" />)
                ) : sortedTasks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-24 bg-secondary/10 rounded-[3rem] border-4 border-dashed border-muted-foreground/5 text-center">
                    <Inbox className="h-20 w-20 text-muted-foreground/20 mb-6" />
                    <p className="text-2xl font-display font-bold text-muted-foreground">空空如也</p>
                    <p className="text-muted-foreground/60 mt-2 font-medium">暂时没有符合条件的任务，享受这一刻的宁静</p>
                  </div>
                ) : (
                  sortedTasks.map(task => (
                    <TaskCard key={task.id} task={task} />
                  ))
                )}
              </div>
            </section>
            <aside className="lg:col-span-4 space-y-12">
              <CalendarWidget />
              <div className="p-10 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-[3rem] text-white space-y-6 shadow-2xl shadow-indigo-500/30 relative overflow-hidden group">
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-56 h-56 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-1000" />
                <div className="space-y-2 relative z-10">
                  <div className="bg-white/20 inline-flex items-center border-none text-white font-bold rounded-lg px-3 py-1 text-xs uppercase tracking-wider">工匠贴士</div>
                  <h3 className="text-3xl font-display font-bold">深度构筑指南</h3>
                </div>
                <p className="text-indigo-50/90 leading-relaxed font-medium text-lg italic">
                  "专注时���是你的神圣画布。不要让琐碎的通知惊扰��正在成型的杰作。每一次深呼吸都是一次构筑。"
                </p>
                <Button variant="secondary" className="w-full bg-white text-indigo-600 hover:bg-indigo-50 font-bold rounded-2xl h-14 text-lg border-none shadow-xl">
                  阅读完整指南
                </Button>
              </div>
            </aside>
          </main>
        </div>
        <Toaster richColors position="top-center" />
      </div>
    </AppLayout>
  );
}