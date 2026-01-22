import React, { useMemo } from 'react';
import { useAppStore } from '@/store/use-app-store';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Radar, RadarChart, PolarGrid, PolarAngleAxis
} from 'recharts';
import { Trophy, Flame, Clock, Target, Brain, Sparkles } from 'lucide-react';
import { format, subDays } from 'date-fns';
import { cn } from '@/lib/utils';
import { useShallow } from 'zustand/react/shallow';
import { DYNAMIC_INSIGHTS } from '@/lib/mock-academic';
import { ChartTooltipContent } from '@/components/ui/chart';
export function StatsPage() {
  const tasks = useAppStore(useShallow(s => s.tasks));
  const userStats = useAppStore(s => s.userStats);
  const streak = userStats?.streak ?? 0;
  const xp = userStats?.xp ?? 0;
  const totalFocusMinutes = userStats?.totalFocusMinutes ?? 0;
  const totalTasksCompleted = userStats?.totalTasksCompleted ?? 0;
  // Stabilize the reference by pulling the primitive directly if needed,
  // but here we just need to ensure the logical expression doesn't break memoization.
  const focusHistory = userStats?.focusHistory;
  const statsSummary = useMemo(() => [
    { label: "连胜构筑", value: `${streak} 天`, icon: Flame, color: "text-orange-500", bg: "bg-orange-50" },
    { label: "总经验值", value: xp.toLocaleString(), icon: Trophy, color: "text-yellow-500", bg: "bg-yellow-50" },
    { label: "专注总时间", value: `${(totalFocusMinutes / 60).toFixed(1)}h`, icon: Clock, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "完成蓝图", value: totalTasksCompleted, icon: Target, color: "text-green-500", bg: "bg-green-50" },
  ], [streak, xp, totalFocusMinutes, totalTasksCompleted]);
  const chartData = useMemo(() => {
    const history = focusHistory || {};
    return Array.from({ length: 7 }).map((_, i) => {
      const date = subDays(new Date(), 6 - i);
      const dateStr = format(date, 'yyyy-MM-dd');
      return {
        name: format(date, 'MM/dd'),
        minutes: history[dateStr] || 0,
      };
    });
  }, [focusHistory]);
  const radarData = useMemo(() => {
    const counts: Record<string, number> = { reading: 0, listening: 0, writing: 0, other: 0 };
    tasks.forEach(t => {
      if (t.status === 2 && t.type in counts) {
        counts[t.type] += t.pomodoroSpent;
      }
    });
    return [
      { subject: '阅读', A: counts.reading * 10, fullMark: 100 },
      { subject: '听力', A: counts.listening * 10, fullMark: 100 },
      { subject: '写作', A: counts.writing * 10, fullMark: 100 },
      { subject: '外务', A: counts.other * 10, fullMark: 100 },
    ];
  }, [tasks]);
  const dailyInsight = useMemo(() => {
    const history = focusHistory || {};
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const todayFocus = history[todayStr] || 0;
    if (todayFocus > 100) return DYNAMIC_INSIGHTS.high_focus;
    if (streak > 3) return DYNAMIC_INSIGHTS.streak_master;
    if (todayFocus < 25) return DYNAMIC_INSIGHTS.low_activity;
    return DYNAMIC_INSIGHTS.default;
  }, [focusHistory, streak]);
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12">
      <header className="mb-12 text-center md:text-left">
        <h1 className="text-5xl font-display font-bold tracking-tight text-foreground">时间视野</h1>
        <p className="text-muted-foreground text-lg mt-2 font-medium">洞察你的构筑规律与成就轨迹</p>
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
        <Card className="lg:col-span-8 border-none shadow-soft rounded-[3rem] p-8 bg-card/40 backdrop-blur-xl">
          <CardHeader className="px-0 pt-0 pb-8"><CardTitle className="text-2xl font-display font-bold text-foreground">近七日专注趋势 (Immersion Trend)</CardTitle></CardHeader>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
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
        <Card className="lg:col-span-4 border-none shadow-soft rounded-[3rem] p-8 flex flex-col bg-card/40 backdrop-blur-xl">
          <CardHeader className="px-0 pt-0 pb-8"><CardTitle className="text-2xl font-display font-bold text-foreground">修为维度 (Capabilities)</CardTitle></CardHeader>
          <div className="h-[350px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="hsl(var(--muted-foreground)/0.2)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12, fontWeight: 700 }} />
                <Radar
                  name="Scholar"
                  dataKey="A"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.4}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
      <section className="mb-12">
        <Card className="border-none shadow-[0_20px_50px_rgba(15,23,42,0.3)] rounded-[4rem] overflow-hidden bg-slate-900 text-white relative group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-32 -mt-32 group-hover:scale-150 transition-transform duration-1000" />
          <div className="p-12 flex flex-col md:flex-row items-center gap-12 relative z-10">
            <div className="h-40 w-40 rounded-[2.5rem] bg-white/10 flex items-center justify-center shrink-0 border border-white/20 shadow-2xl">
              <Brain className="h-20 w-20 text-orange-400" />
            </div>
            <div className="space-y-6 flex-1 text-center md:text-left">
              <div className="flex items-center gap-3 justify-center md:justify-start">
                <Sparkles className="h-6 w-6 text-yellow-500" />
                <h2 className="text-4xl font-display font-bold">每日复盘 (Cultivation Insight)</h2>
              </div>
              <div className="bg-white/5 p-8 rounded-[3rem] border border-white/10">
                <p className="text-2xl font-display italic leading-relaxed text-slate-100">
                  “{dailyInsight}”
                </p>
              </div>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}