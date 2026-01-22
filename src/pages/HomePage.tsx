import React, { useEffect, useMemo } from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Toaster } from '@/components/ui/sonner';
import { TaskCard } from '@/components/task/TaskCard';
import { CalendarWidget } from '@/components/dashboard/CalendarWidget';
import { FocusOverlay } from '@/components/focus/FocusOverlay';
import { useAppStore } from '@/store/use-app-store';
import { Sparkles, Plus, Trophy, Flame, Inbox } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NewTaskDialog } from '@/components/task/NewTaskDialog';
import { Skeleton } from '@/components/ui/skeleton';
export function HomePage() {
  const tasks = useAppStore(s => s.tasks);
  const isLoading = useAppStore(s => s.isLoading);
  const fetchTasks = useAppStore(s => s.fetchTasks);
  const activeTaskId = useAppStore(s => s.timer.activeTaskId);
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);
  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => {
      if (a.status === 'completed' && b.status !== 'completed') return 1;
      if (a.status !== 'completed' && b.status === 'completed') return -1;
      if (a.priority !== b.priority) return a.priority - b.priority;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
  }, [tasks]);
  const incompleteCount = useMemo(() => tasks.filter(t => t.status !== 'completed').length, [tasks]);
  return (
    <div className="min-h-screen bg-background transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
          <ThemeToggle className="fixed top-4 right-4" />
          <FocusOverlay />
          <div className={activeTaskId ? 'blur-md grayscale-[0.5] transition-all duration-700' : 'transition-all duration-700'}>
            <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-primary rounded-2xl text-primary-foreground shadow-lg shadow-primary/20">
                    <Sparkles className="h-7 w-7" />
                  </div>
                  <h1 className="text-4xl font-display font-bold tracking-tight">ChronoCraft</h1>
                </div>
                <p className="text-muted-foreground max-w-md text-base">
                  欢迎回来，建筑师。今日���有 <span className="text-foreground font-bold">{incompleteCount}</span> 个蓝图等待构筑。
                </p>
              </div>
              <div className="flex items-center gap-4 bg-secondary/40 backdrop-blur-sm p-4 rounded-3xl border border-border/50 shadow-sm">
                <div className="flex items-center gap-3 px-4 border-r border-border/50">
                  <Flame className="h-6 w-6 text-orange-500" />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">连胜步数</p>
                    <p className="font-display font-bold text-lg leading-none mt-1">12 Days</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 px-4">
                  <Trophy className="h-6 w-6 text-yellow-500" />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">工匠等级</p>
                    <p className="font-display font-bold text-lg leading-none mt-1">Master</p>
                  </div>
                </div>
              </div>
            </header>
            <main className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <section className="lg:col-span-8 space-y-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-display font-bold flex items-center gap-2">
                    任务卡组 <span className="text-sm font-sans font-normal text-muted-foreground ml-2">Sorted by Priority</span>
                  </h2>
                  <NewTaskDialog>
                    <Button className="rounded-full gap-2 px-6 shadow-md hover:shadow-lg transition-all active:scale-95">
                      <Plus className="h-4 w-4" /> 开启新任务
                    </Button>
                  </NewTaskDialog>
                </div>
                <div className="space-y-5">
                  {isLoading ? (
                    Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32 w-full rounded-3xl" />)
                  ) : sortedTasks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 bg-secondary/10 rounded-[2.5rem] border-2 border-dashed border-muted-foreground/10 text-center">
                      <Inbox className="h-16 w-16 text-muted-foreground/20 mb-4" />
                      <p className="text-xl font-display font-bold text-muted-foreground">空空如也</p>
                      <p className="text-muted-foreground/60 mt-1">暂无任务蓝图，享受��一刻的宁静</p>
                    </div>
                  ) : (
                    sortedTasks.map(task => (
                      <TaskCard key={task.id} task={task} />
                    ))
                  )}
                </div>
              </section>
              <aside className="lg:col-span-4 space-y-10">
                <CalendarWidget />
                <div className="p-8 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-[2.5rem] text-white space-y-5 shadow-2xl shadow-indigo-500/20 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-1000" />
                  <h3 className="text-2xl font-display font-bold">工匠贴士</h3>
                  <p className="text-indigo-50 leading-relaxed font-medium">
                    "专注时段是你的���圣画布。不要让琐碎的通知惊扰了正在成型的杰作。"
                  </p>
                  <Button variant="secondary" className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-md border-none text-white font-bold rounded-2xl py-6">
                    阅读完整指南
                  </Button>
                </div>
              </aside>
            </main>
          </div>
        </div>
        <Toaster richColors position="top-center" />
      </div>
    </div>
  );
}