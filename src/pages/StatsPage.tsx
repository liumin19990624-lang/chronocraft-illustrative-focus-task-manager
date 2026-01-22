import React, { useMemo } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAppStore } from '@/store/use-app-store';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import { Trophy, Flame, Clock, Target, Calendar, Award } from 'lucide-react';
import { format, subDays, startOfDay, isSameDay } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { cn } from '@/lib/utils';
export function StatsPage() {
  const tasks = useAppStore(s => s.tasks);
  const userStats = useAppStore(s => s.userStats);
  const statsSummary = [
    { label: "连续构筑", value: `${userStats.streak} 天`, icon: Flame, color: "text-orange-500", bg: "bg-orange-50" },
    { label: "总经验值", value: userStats.xp, icon: Trophy, color: "text-yellow-500", bg: "bg-yellow-50" },
    { label: "专注总时长", value: `${(userStats.totalFocusMinutes / 60).toFixed(1)}h`, icon: Clock, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "完成蓝图", value: userStats.totalTasksCompleted, icon: Target, color: "text-green-500", bg: "bg-green-50" },
  ];
  const chartData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }).map((_, i) => {
      const date = subDays(new Date(), 6 - i);
      const dayTasks = tasks.filter(t => t.status === 'completed' && isSameDay(new Date(t.completedAt || ''), date));
      const focusMinutes = dayTasks.reduce((acc, t) => acc + (t.pomodoroSpent * 25), 0);
      return {
        name: format(date, 'MM/dd'),
        minutes: focusMinutes,
        tasks: dayTasks.length,
      };
    });
    return last7Days;
  }, [tasks]);
  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    tasks.filter(t => t.status === 'completed').forEach(t => {
      counts[t.type] = (counts[t.type] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [tasks]);
  const COLORS = ['#88C0D0', '#81A1C1', '#5E81AC', '#4C566A'];
  return (
    <AppLayout className="bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12">
        <header className="mb-12">
          <h1 className="text-5xl font-display font-bold tracking-tight">时间视野</h1>
          <p className="text-muted-foreground text-lg mt-2 font-medium">洞察你的构筑规���与成长轨迹</p>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statsSummary.map((stat, i) => (
            <Card key={i} className="border-none shadow-soft rounded-3xl overflow-hidden hover:scale-[1.02] transition-transform">
              <CardContent className="p-8 flex items-center gap-6">
                <div className={cn("p-4 rounded-2xl", stat.bg)}>
                  <stat.icon className={cn("h-8 w-8", stat.color)} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-display font-bold mt-1">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          <Card className="lg:col-span-8 border-none shadow-soft rounded-[3rem] p-8">
            <CardHeader className="px-0 pt-0 pb-8">
              <CardTitle className="text-2xl font-display font-bold">近七日专注趋势</CardTitle>
            </CardHeader>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorMinutes" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12, fontWeight: 700}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12, fontWeight: 700}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
                  />
                  <Area type="monotone" dataKey="minutes" stroke="hsl(var(--primary))" strokeWidth={4} fillOpacity={1} fill="url(#colorMinutes)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
          <Card className="lg:col-span-4 border-none shadow-soft rounded-[3rem] p-8">
            <CardHeader className="px-0 pt-0 pb-8">
              <CardTitle className="text-2xl font-display font-bold">任务构成分部</CardTitle>
            </CardHeader>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-8">
              {categoryData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="text-xs font-bold text-muted-foreground uppercase">{entry.name}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <Award className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-display font-bold">成就勋章</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={cn(
                "group aspect-square rounded-[2rem] flex flex-col items-center justify-center gap-4 transition-all border-4 border-dashed",
                i === 0 ? "bg-primary/5 border-primary/20" : "bg-secondary/20 border-muted-foreground/10 grayscale opacity-40"
              )}>
                <div className={cn(
                  "h-16 w-16 rounded-full flex items-center justify-center shadow-lg transition-transform group-hover:scale-110",
                  i === 0 ? "bg-white text-primary" : "bg-muted text-muted-foreground"
                )}>
                  <Trophy className="h-8 w-8" />
                </div>
                <p className="text-xs font-bold uppercase tracking-widest text-center px-2">
                  {i === 0 ? "初露锋芒" : "尚���解锁"}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppLayout>
  );
}