import React, { useEffect } from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Toaster } from '@/components/ui/sonner';
import { TaskCard } from '@/components/task/TaskCard';
import { CalendarWidget } from '@/components/dashboard/CalendarWidget';
import { FocusOverlay } from '@/components/focus/FocusOverlay';
import { useAppStore } from '@/store/use-app-store';
import { useShallow } from 'zustand/react/shallow';
import { Sparkles, Plus, Trophy, Flame, Inbox } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NewTaskDialog } from '@/components/task/NewTaskDialog';
import { Skeleton } from '@/components/ui/skeleton';
export function HomePage() {
  const tasks = useAppStore(useShallow(s => s.tasks));
  const isLoading = useAppStore(s => s.isLoading);
  const fetchTasks = useAppStore(s => s.fetchTasks);
  const activeTaskId = useAppStore(s => s.timer.activeTaskId);
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.status === 'completed' && b.status !== 'completed') return 1;
    if (a.status !== 'completed' && b.status === 'completed') return -1;
    return a.priority - b.priority;
  });
  const incompleteTasksCount = tasks.filter(t => t.status !== 'completed').length;
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
          <ThemeToggle className="fixed top-4 right-4" />
          <FocusOverlay />
          <div className={activeTaskId ? 'blur-sm transition-all duration-300' : 'transition-all duration-300'}>
            <header className="mb-8 sm:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary rounded-xl text-primary-foreground">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-display font-bold">ChronoCraft</h1>
                </div>
                <p className="text-muted-foreground max-w-md text-sm sm:text-base">
                  欢迎回来，建筑师。今天还有 {incompleteTasksCount} 个蓝图等待执行。
                </p>
              </div>
              <div className="flex items-center gap-4 bg-secondary/50 p-3 rounded-2xl border border-border self-start md:self-end">
                <div className="flex items-center gap-2 px-3 border-r border-border">
                  <Flame className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="text-[10px] font-bold uppercase text-muted-foreground">连胜</p>
                    <p className="font-display font-bold text-sm">12 天</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  <div>
                    <p className="text-[10px] font-bold uppercase text-muted-foreground">等级</p>
                    <p className="font-display font-bold text-sm">大师</p>
                  </div>
                </div>
              </div>
            </header>
            <main className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <section className="lg:col-span-8 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-display font-bold">任务卡组</h2>
                  <NewTaskDialog>
                    <Button size="sm" className="rounded-full gap-2">
                      <Plus className="h-4 w-4" /> 新建任务
                    </Button>
                  </NewTaskDialog>
                </div>
                <div className="space-y-4">
                  {isLoading ? (
                    Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-lg" />)
                  ) : sortedTasks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-secondary/20 rounded-3xl border-2 border-dashed border-muted-foreground/20 text-center">
                      <Inbox className="h-12 w-12 text-muted-foreground/40 mb-4" />
                      <p className="text-muted-foreground font-medium">暂���没有任务</p>
                      <p className="text-sm text-muted-foreground/60">开始勾��你的第一个杰作吧</p>
                    </div>
                  ) : (
                    sortedTasks.map(task => (
                      <TaskCard key={task.id} task={task} />
                    ))
                  )}
                </div>
              </section>
              <aside className="lg:col-span-4 space-y-8">
                <CalendarWidget />
                <div className="p-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl text-white space-y-4 shadow-xl">
                  <h3 className="text-xl font-display font-bold">工匠贴���</h3>
                  <p className="text-indigo-100 text-sm leading-relaxed">
                    "专注时段是你的画布。别���通知弄脏了你的杰作。"
                  </p>
                  <Button variant="secondary" className="w-full bg-white/20 hover:bg-white/30 border-none text-white font-bold">
                    阅读��多
                  </Button>
                </div>
              </aside>
            </main>
          </div>
        </div>
        <Toaster richColors />
      </div>
    </div>
  );
}