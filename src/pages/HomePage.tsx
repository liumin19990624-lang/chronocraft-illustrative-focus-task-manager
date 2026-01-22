import React, { useEffect, useMemo, useRef, useCallback } from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { TaskCard } from '@/components/task/TaskCard';
import { CalendarWidget } from '@/components/dashboard/CalendarWidget';
import { useAppStore } from '@/store/use-app-store';
import { Plus, Flame, Inbox, Wallet, Book, Headphones, FileText, PenTool, Bell, User, WifiOff, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { NewTaskDialog } from '@/components/task/NewTaskDialog';
import { RegisterDialog } from '@/components/registration/RegisterDialog';
import { OnboardingTour } from '@/components/onboarding/OnboardingTour';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useShallow } from 'zustand/react/shallow';
import { PWAPrompt } from '@/components/ui/pwa-prompt';
import { Link } from 'react-router-dom';
import { ACADEMIC_QUOTES } from '@/lib/mock-academic';
function HallParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animationFrameId: number;
    let particles: Array<{ x: number; y: number; vx: number; vy: number; size: number; color: string }> = [];
    const colors = ['#88C0D0', '#EBCB8B', '#A3BE8C', '#B48EAD'];
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 1,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = 0.15;
        ctx.fill();
      });
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-40 hall-particles" />;
}
export function HomePage() {
  const tasks = useAppStore(useShallow(s => s.tasks));
  const isLoading = useAppStore(s => s.isLoading);
  const isOffline = useAppStore(s => s.isOffline);
  const isSyncing = useAppStore(s => s.isSyncing);
  const fetchTasks = useAppStore(s => s.fetchTasks);
  const fetchStats = useAppStore(s => s.fetchStats);
  const showArchived = useAppStore(s => s.showArchived);
  const toggleShowArchived = useAppStore(s => s.toggleShowArchived);
  const userStats = useAppStore(s => s.userStats);
  const userNickname = userStats?.nickname;
  const userLevel = userStats?.level ?? 1;
  const userCoins = userStats?.coins ?? 0;
  const userStreak = userStats?.streak ?? 0;
  const userXP = userStats?.xp ?? 0;
  const hasUser = !!userNickname;
  useEffect(() => {
    fetchStats().then(() => { if (userNickname) fetchTasks(); });
  }, [fetchTasks, fetchStats, userNickname]);
  const dailyGreeting = useMemo(() => {
    const hour = new Date().getHours();
    let timeGreet = "晨光熹微";
    const randomQuote = ACADEMIC_QUOTES[Math.floor(Math.random() * ACADEMIC_QUOTES.length)];
    if (hour >= 12 && hour < 18) timeGreet = "午后小憩";
    if (hour >= 18) timeGreet = "月下���读";
    return `${timeGreet}，${userNickname}道友。${randomQuote}`;
  }, [userNickname]);
  const sortedTasks = useMemo(() => {
    let filtered = tasks;
    if (!showArchived) filtered = tasks.filter(t => !t.isArchived);
    return [...filtered].sort((a, b) => {
      if (a.status !== b.status) return a.status - b.status;
      if (a.priority !== b.priority) return a.priority - b.priority;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
  }, [tasks, showArchived]);
  const quickAccess = useMemo(() => [
    { name: "词汇 对战", icon: Book, color: "bg-orange-500", path: "/vocab", desc: "对战记忆术" },
    { name: "听力 研习", icon: Headphones, color: "bg-blue-500", path: "/listening", desc: "精听悟道方" },
    { name: "论文 阅读", icon: FileText, color: "bg-emerald-500", path: "/papers", desc: "双���研习社" },
    { name: "写作 演作", icon: PenTool, color: "bg-purple-500", path: "/writer", desc: "灵感演武���" },
  ], []);
  if (!hasUser) return <RegisterDialog />;
  return (
    <div className="bg-background relative">
      <HallParticles />
      <OnboardingTour />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="py-8 md:py-10 lg:py-12">
          <ThemeToggle className="fixed top-4 right-4" />
          <PWAPrompt />
          <div className="space-y-12">
            <header className="flex flex-col md:flex-row md:items-start justify-between gap-8">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <Avatar className="h-24 w-24 rounded-3xl shadow-2xl ring-4 ring-primary/5">
                    <AvatarImage src={userStats?.avatar} />
                    <AvatarFallback className="bg-primary text-primary-foreground"><User /></AvatarFallback>
                  </Avatar>
                  {isOffline && (
                    <div className="absolute -bottom-2 -right-2 bg-amber-500 text-white p-1.5 rounded-xl shadow-lg border-2 border-background">
                      <WifiOff className="h-4 w-4" />
                    </div>
                  )}
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <h1 className="text-4xl font-display font-bold tracking-tight">学术大厅</h1>
                    {isSyncing && <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />}
                  </div>
                  <p className="text-muted-foreground font-medium text-lg">{dailyGreeting}</p>
                  <div className="w-full max-w-xs space-y-1.5">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                      <span>第 {userLevel} 重境界</span>
                      <span>{userXP % 1000} / 1000 XP</span>
                    </div>
                    <Progress value={(userXP % 1000) / 10} className="h-1.5" />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-card/40 backdrop-blur-xl p-2 rounded-[2.5rem] border border-border/50 shadow-soft">
                <div className="px-6 py-3 border-r border-border/50 flex items-center gap-3">
                  <Flame className="h-6 w-6 text-orange-500" />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">连胜</p>
                    <p className="font-display font-bold text-xl">{userStreak}</p>
                  </div>
                </div>
                <div className="px-6 py-3 border-r border-border/50 flex items-center gap-3">
                  <Wallet className="h-6 w-6 text-emerald-500" />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">灵石</p>
                    <p className="font-display font-bold text-xl">{userCoins}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full relative ml-2">
                  <Bell className="h-6 w-6" />
                  <span className="absolute top-2 right-2 h-3 w-3 bg-red-500 border-2 border-white rounded-full animate-pulse" />
                </Button>
              </div>
            </header>
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {quickAccess.map((item) => (
                <Link key={item.path} to={item.path} className="block group">
                  <Card className="relative overflow-hidden p-8 rounded-[2.5rem] border-none bg-card/60 backdrop-blur-xl shadow-soft group-hover:translate-y-[-4px] transition-all cursor-pointer h-full">
                    <div className={cn("absolute top-0 right-0 w-32 h-32 -mr-12 -mt-12 rounded-full opacity-10 group-hover:scale-150 transition-transform", item.color)} />
                    <div className={cn("h-16 w-16 rounded-3xl flex items-center justify-center mb-6 text-white shadow-lg", item.color)}>
                      <item.icon className="h-8 w-8" />
                    </div>
                    <h3 className="text-2xl font-bold font-display">{item.name}</h3>
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
                      {showArchived ? "隐藏" : "��看归档"}
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
        </div>
      </div>
    </div>
  );
}