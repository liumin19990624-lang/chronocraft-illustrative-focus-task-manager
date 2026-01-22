import React, { useMemo } from 'react';
import { useAppStore } from '@/store/use-app-store';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { Trophy, Flame, Clock, Target, Brain } from 'lucide-react';
import { format, subDays, isSameDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { useShallow } from 'zustand/react/shallow';
import { DAILY_INSIGHTS } from '@/lib/mock-academic';
import { ChartTooltipContent } from '@/components/ui/chart';
export function StatsPage() {
  const tasks = useAppStore(useShallow(s => s.tasks));
  const streak = useAppStore(s => s.userStats?.streak ?? 0);
  const xp = useAppStore(s => s.userStats?.xp ?? 0);
  const totalFocusMinutes = useAppStore(s => s.userStats?.totalFocusMinutes ?? 0);
  const totalTasksCompleted = useAppStore(s => s.userStats?.totalTasksCompleted ?? 0);
  const statsSummary = useMemo(() => [
    { label: "连胜构筑", value: `${streak} 天`, icon: Flame, color: "text-orange-500", bg: "bg-orange-50" },
    { label: "总经验值", value: xp.toLocaleString(), icon: Trophy, color: "text-yellow-500", bg: "bg-yellow-50" },
    { label: "专注总时间", value: `${(totalFocusMinutes / 60).toFixed(1)}h`, icon: Clock, color: "text-blue-500", bg: "bg-blue-50" },
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
  const distributionData = useMemo(() => {
    const counts: Record<string, number> = { reading: 0, listening: 0, writing: 0, other: 0 };
    tasks.forEach(t => { 
      if (t.status === 2 && t.type in counts) {
        counts[t.type] += t.pomodoroSpent * 25; 
      }
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [tasks]);
  const COLORS = ['#88C0D0', '#81A1C1', '#5E81AC', '#4C566A'];
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12">
      <header className="mb-12">
        <h1 className="text-5xl font-display font-bold tracking-tight text-foreground">时间视���</h1>
        <p className="text-muted-foreground text-lg mt-2 font-medium">洞察��的构筑规律与成长轨迹</p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {statsSummary.map((stat, i) => (
          <Card key={i} className="border-none shadow-soft rounded-3xl overflow-hidden hover:scale-[1.02] transition-transform bg-card">
            <CardContent className="p-8 flex items-center gap-6">
              <div className={cn("p-4 rounded-2xl", stat.bg)}>
                <stat.icon className={cn("h-8 w-8", stat.color)} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-display font-bold mt-1 text-foreground">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        <Card className="lg:col-span-8 border-none shadow-soft rounded-[3rem] p-8 bg-card">
          <CardHeader className="px-0 pt-0 pb-8"><CardTitle className="text-2xl font-display font-bold text-foreground">近七日专注���势</CardTitle></CardHeader>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%" minHeight={300} minWidth={300}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12, fontWeight: 700}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12, fontWeight: 700}} />
                <Tooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="minutes" stroke="hsl(var(--primary))" strokeWidth={4} fill="hsl(var(--primary)/0.1)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="lg:col-span-4 border-none shadow-soft rounded-[3rem] p-8 flex flex-col bg-card">
          <CardHeader className="px-0 pt-0 pb-8"><CardTitle className="text-2xl font-display font-bold text-foreground">修为分布</CardTitle></CardHeader>
          <div className="h-[350px] w-full relative">
            <ResponsiveContainer width="100%" height="100%" minHeight={300} minWidth={300}>
              <PieChart>
                <Pie data={distributionData} innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                  {distributionData.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {distributionData.map((entry, i) => (
              <div key={i} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                <div className="w-2 h-2 rounded-full" style={{ background: COLORS[i] }} /> {entry.name}
              </div>
            ))}
          </div>
        </Card>
      </div>
      <section className="mb-12">
        <Card className="border-none shadow-soft rounded-[3rem] overflow-hidden bg-slate-900 text-white">
          <div className="p-12 flex flex-col md:flex-row items-center gap-12">
            <div className="h-40 w-40 rounded-[2.5rem] bg-white/10 flex items-center justify-center shrink-0 border border-white/20 shadow-2xl relative">
              <Brain className="h-20 w-20 text-orange-400" />
            </div>
            <div className="space-y-6 flex-1 text-center md:text-left">
              <h2 className="text-4xl font-display font-bold">每���复盘 (Daily Insight)</h2>
              <div className="bg-white/5 p-8 rounded-4xl border border-white/10 relative">
                <p className="text-xl font-display italic leading-relaxed text-slate-100">
                  {DAILY_INSIGHTS[0]}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}