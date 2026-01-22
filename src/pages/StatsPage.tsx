import React, { useMemo } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAppStore } from '@/store/use-app-store';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { Trophy, Flame, Clock, Target, Award } from 'lucide-react';
import { format, subDays, isSameDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { useShallow } from 'zustand/react/shallow';
export function StatsPage() {
  const tasks = useAppStore(useShallow(s => s.tasks));
  const streak = useAppStore(s => s.userStats?.streak ?? 0);
  const xp = useAppStore(s => s.userStats?.xp ?? 0);
  const totalFocusMinutes = useAppStore(s => s.userStats?.totalFocusMinutes ?? 0);
  const totalTasksCompleted = useAppStore(s => s.userStats?.totalTasksCompleted ?? 0);
  const statsSummary = useMemo(() => [
    { label: "连续构筑", value: `${streak} 天`, icon: Flame, color: "text-orange-500", bg: "bg-orange-50" },
    { label: "总经验���", value: xp, icon: Trophy, color: "text-yellow-500", bg: "bg-yellow-50" },
    { label: "专注总时长", value: `${(totalFocusMinutes / 60).toFixed(1)}h`, icon: Clock, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "完成蓝图", value: totalTasksCompleted, icon: Target, color: "text-green-500", bg: "bg-green-50" },
  ], [streak, xp, totalFocusMinutes, totalTasksCompleted]);
  const chartData = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      const date = subDays(new Date(), 6 - i);
      const dayTasks = tasks.filter(t => t.status === 2 && t.completedAt && isSameDay(new Date(t.completedAt), date));
      const focusMinutes = dayTasks.reduce((acc, t) => acc + (t.pomodoroSpent * 25), 0);
      return {
        name: format(date, 'MM/dd'),
        minutes: focusMinutes,
        tasks: dayTasks.length,
      };
    });
  }, [tasks]);
  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    tasks.filter(t => t.status === 2).forEach(t => {
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
          <p className="text-muted-foreground text-lg mt-2 font-medium">洞察你的构筑规律与成长轨迹</p>
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
              <CardTitle className="text-2xl font-display font-bold">任务构成分布</CardTitle>
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
                    {categoryData.map((_, index) => (
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
      </div>
    </AppLayout>
  );
}