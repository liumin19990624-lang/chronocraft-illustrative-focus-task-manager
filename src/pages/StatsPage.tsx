import React, { useMemo } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAppStore } from '@/store/use-app-store';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { Trophy, Flame, Clock, Target, Sparkles, Brain } from 'lucide-react';
import { format, subDays, isSameDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { useShallow } from 'zustand/react/shallow';
import { RADAR_DATA, DAILY_INSIGHTS } from '@/lib/mock-academic';
export function StatsPage() {
  const tasks = useAppStore(useShallow(s => s.tasks));
  const streak = useAppStore(s => s.userStats?.streak ?? 0);
  const xp = useAppStore(s => s.userStats?.xp ?? 0);
  const totalFocusMinutes = useAppStore(s => s.userStats?.totalFocusMinutes ?? 0);
  const totalTasksCompleted = useAppStore(s => s.userStats?.totalTasksCompleted ?? 0);
  const statsSummary = useMemo(() => [
    { label: "��续构筑", value: `${streak} 天`, icon: Flame, color: "text-orange-500", bg: "bg-orange-50" },
    { label: "总经验值", value: xp, icon: Trophy, color: "text-yellow-500", bg: "bg-yellow-50" },
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
  const randomInsight = useMemo(() => {
    return DAILY_INSIGHTS[Math.floor(Math.random() * DAILY_INSIGHTS.length)];
  }, []);
  const COLORS = ['#88C0D0', '#81A1C1', '#5E81AC', '#4C566A'];
  return (
    <AppLayout container>
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
                <Tooltip />
                <Area type="monotone" dataKey="minutes" stroke="hsl(var(--primary))" strokeWidth={4} fillOpacity={1} fill="url(#colorMinutes)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="lg:col-span-4 border-none shadow-soft rounded-[3rem] p-8 flex flex-col">
          <CardHeader className="px-0 pt-0 pb-8">
            <CardTitle className="text-2xl font-display font-bold">学术能力雷达</CardTitle>
          </CardHeader>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={RADAR_DATA}>
                <PolarGrid stroke="hsl(var(--muted))" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12, fontWeight: 700 }} />
                <Radar
                  name="Ability"
                  dataKey="A"
                  stroke="#88C0D0"
                  fill="#88C0D0"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 p-4 bg-primary/5 rounded-2xl border border-primary/10">
            <p className="text-xs font-bold text-primary uppercase mb-1">修行评估</p>
            <p className="text-sm font-medium leading-relaxed">道友在“{RADAR_DATA.sort((a,b) => b.A - a.A)[0].subject}”领域造诣��深，建议平衡各方修为。</p>
          </div>
        </Card>
      </div>
      <section className="mb-12">
        <Card className="border-none shadow-soft rounded-[3rem] overflow-hidden bg-slate-900 text-white">
          <div className="p-12 flex flex-col md:flex-row items-center gap-12">
            <div className="h-40 w-40 rounded-[2.5rem] bg-white/10 flex items-center justify-center shrink-0 border border-white/20 shadow-2xl relative">
              <Brain className="h-20 w-20 text-orange-400" />
              <div className="absolute -top-4 -right-4 h-12 w-12 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="space-y-6 flex-1">
              <div className="space-y-2 text-center md:text-left">
                <h2 className="text-4xl font-display font-bold">每日复�� (Daily Insight)</h2>
                <p className="text-slate-400 text-lg font-medium">神���归纳，整合今日修行心得</p>
              </div>
              <div className="bg-white/5 p-8 rounded-4xl border border-white/10 relative">
                <p className="text-xl font-display italic leading-relaxed text-slate-100">
                  {randomInsight}
                </p>
                <div className="absolute -bottom-3 -right-3 h-10 w-10 bg-white/10 rounded-full flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-orange-300" />
                </div>
              </div>
            </div>
          </div>
        </Card>
      </section>
    </AppLayout>
  );
}