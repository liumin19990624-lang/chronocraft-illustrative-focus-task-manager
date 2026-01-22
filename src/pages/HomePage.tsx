import React, { useEffect, useMemo } from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Toaster } from '@/components/ui/sonner';
import { TaskCard } from '@/components/task/TaskCard';
import { CalendarWidget } from '@/components/dashboard/CalendarWidget';
import { FocusOverlay } from '@/components/focus/FocusOverlay';
import { useAppStore } from '@/store/use-app-store';
import { Sparkles, Plus, Trophy, Flame, Inbox, Wallet, Book, Headphones, FileText, PenTool } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NewTaskDialog } from '@/components/task/NewTaskDialog';
import { RegisterDialog } from '@/components/registration/RegisterDialog';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { AppLayout } from '@/components/layout/AppLayout';
import { useShallow } from 'zustand/react/shallow';
import { PWAPrompt } from '@/components/ui/pwa-prompt';
import { Link } from 'react-router-dom';
import { ACADEMIC_QUOTES } from '@/lib/mock-academic';
export function HomePage() {
  const tasks = useAppStore(useShallow(s => s.tasks));
  const isLoading = useAppStore(s => s.isLoading);
  const fetchTasks = useAppStore(s => s.fetchTasks);
  const fetchStats = useAppStore(s => s.fetchStats);
  const activeTaskId = useAppStore(s => s.timer.activeTaskId);
  const showArchived = useAppStore(s => s.showArchived);
  const toggleShowArchived = useAppStore(s => s.toggleShowArchived);
  const userNickname = useAppStore(s => s.userStats?.nickname);
  const userLevel = useAppStore(s => s.userStats?.level ?? 1);
  const userCoins = useAppStore(s => s.userStats?.coins ?? 0);
  const userStreak = useAppStore(s => s.userStats?.streak ?? 0);
  const hasUser = !!userNickname;
  useEffect(() => {
    fetchStats().then(() => fetchTasks());
  }, [fetchTasks, fetchStats]);
  const randomQuote = useMemo(() => {
    return ACADEMIC_QUOTES[Math.floor(Math.random() * ACADEMIC_QUOTES.length)];
  }, []);
  const sortedTasks = useMemo(() => {
    let filtered = tasks;
    if (!showArchived) filtered = tasks.filter(t => !t.isArchived);
    return [...filtered].sort((a, b) => {
      if (a.status !== b.status) return a.status - b.status;
      if (a.priority !== b.priority) return a.priority - b.priority;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
  }, [tasks, showArchived]);
  const quickAccess = [
    { name: "词汇 词汇", icon: Book, color: "bg-orange-500", path: "/vocab", desc: "对战���忆术" },
    { name: "听力 听力", icon: Headphones, color: "bg-blue-500", path: "/listening", desc: "精听悟道台" },
    { name: "论文 论文", icon: FileText, color: "bg-emerald-500", path: "/papers", desc: "双栏研习社" },
    { name: "写作 写作", icon: PenTool, color: "bg-purple-500", path: "/writer", desc: "灵感演武场" },
  ];
  if (!hasUser) return <RegisterDialog />;
  return (
    <AppLayout className="bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12">
        <ThemeToggle className="fixed top-4 right-4" />
        <FocusOverlay />
        <PWAPrompt />
        <div className={cn("transition-all duration-700 space-y-12", activeTaskId && "blur-xl opacity-40 pointer-events-none")}>
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="h-20 w-20 rounded-3xl bg-primary flex items-center justify-center shadow-2xl shadow-primary/20 rotate-[-4deg]">
                <Sparkles className="h-10 w-10 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-5xl font-display font-bold tracking-tight">学术大厅</h1>
                <p className="text-muted-foreground font-medium text-lg mt-1 italic">
                  {randomQuote}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-secondary/30 p-2 rounded-[2.5rem] border border-border/50">
              <div className="px-6 py-3 border-r border-border/50 flex items-center gap-3">
                <Flame className="h-6 w-6 text-orange-500" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">连胜</p>
                  <p className="font-display font-bold text-xl">{userStreak}</p>
                </div>
              </div>
              <div className="px-6 py-3 border-r border-border/50 flex items-center gap-3">
                <Trophy className="h-6 w-6 text-yellow-500" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">境界</p>
                  <p className="font-display font-bold text-xl">{userLevel} 重</p>
                </div>
              </div>
              <div className="px-6 py-3 flex items-center gap-3">
                <Wallet className="h-6 w-6 text-emerald-500" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">灵石</p>
                  <p className="font-display font-bold text-xl">{userCoins}</p>
                </div>
              </div>
            </div>
          </header>
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {quickAccess.map((item) => (
              <Link key={item.path} to={item.path}>
                <Card className="group relative overflow-hidden p-6 rounded-[2.5rem] border-none bg-slate-100 dark:bg-slate-900 shadow-soft hover:scale-[1.02] transition-all cursor-pointer">
                  <div className={cn("absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-10 group-hover:scale-150 transition-transform", item.color)} />
                  <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center mb-4 text-white shadow-lg", item.color)}>
                    <item.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold font-display">{item.name}</h3>
                  <p className="text-xs text-muted-foreground font-medium mt-1 uppercase tracking-wider">{item.desc}</p>
                </Card>
              </Link>
            ))}
          </section>
          <main className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <section className="lg:col-span-8 space-y-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <h2 className="text-3xl font-display font-bold">待办任务 (Quests)</h2>
                  <Button variant="ghost" size="sm" onClick={toggleShowArchived} className="rounded-xl text-xs font-bold uppercase tracking-widest">
                    {showArchived ? "隐藏" : "查看归档"}
                  </Button>
                </div>
                <NewTaskDialog>
                  <Button className="rounded-2xl h-14 px-8 text-lg font-bold shadow-xl shadow-primary/20 hover:scale-105 transition-all">
                    <Plus className="h-5 w-5 mr-2" /> 发布新任务
                  </Button>
                </NewTaskDialog>
              </div>
              <div className="space-y-6">
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-44 w-full rounded-4xl" />)
                ) : sortedTasks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-24 bg-secondary/10 rounded-5xl border-4 border-dashed border-muted-foreground/10">
                    <Inbox className="h-16 w-16 text-muted-foreground/20 mb-4" />
                    <p className="text-xl font-display font-bold text-muted-foreground">暂无学术任务</p>
                  </div>
                ) : (
                  sortedTasks.map(task => <TaskCard key={task.id} task={task} />)
                )}
              </div>
            </section>
            <aside className="lg:col-span-4">
              <CalendarWidget />
            </aside>
          </main>
        </div>
        <Toaster richColors position="top-center" />
      </div>
    </AppLayout>
  );
}