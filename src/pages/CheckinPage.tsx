import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/use-app-store';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Sparkles, Trophy, Flame, Zap, ScrollText, CalendarCheck, BookOpen, Headphones, FileText, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { triggerConfetti } from '@/components/ui/confetti';
import { playSound } from '@/lib/audio';
import { Link } from 'react-router-dom';
export function CheckinPage() {
  const userStats = useAppStore(s => s.userStats);
  const performCheckin = useAppStore(s => s.performCheckin);
  const isCheckingIn = useAppStore(s => s.isCheckingIn);
  const tasks = useAppStore(s => s.tasks);
  const [isFlipped, setIsFlipped] = useState(false);
  const checkinHistory = userStats?.checkinHistory ?? [];
  const lastCheckinDate = userStats?.lastCheckinDate;
  const today = new Date().toISOString().split('T')[0];
  const hasCheckedInToday = lastCheckinDate === today;
  const streak = userStats?.streak ?? 0;
  const fortune = userStats?.dailyFortune ?? "点击掌门令，���察今日运势...";
  const handleCheckinClick = async () => {
    if (hasCheckedInToday) return;
    playSound('success');
    triggerConfetti();
    setIsFlipped(true);
    await performCheckin();
  };
  const checkinDates = checkinHistory.map(d => new Date(d));
  const recommendations = [
    { title: "每日词海", icon: BookOpen, path: "/vocab", color: "text-orange-500", bg: "bg-orange-500/10" },
    { title: "神识��听", icon: Headphones, path: "/listening", color: "text-blue-500", bg: "bg-blue-500/10" },
    { title: "论文研习", icon: FileText, path: "/papers", color: "text-emerald-500", bg: "bg-emerald-500/10" },
  ];
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12">
      <header className="mb-12 text-center md:text-left">
        <h1 className="text-5xl font-display font-bold tracking-tight text-foreground flex items-center gap-4 justify-center md:justify-start">
          <CalendarCheck className="h-12 w-12 text-primary" /> 
          宗门点卯
        </h1>
        <p className="text-muted-foreground text-lg mt-2 font-medium italic">“一日不学，如隔三秋���道友今日修行可曾懈怠？”</p>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: 3D Card and Fortune */}
        <div className="lg:col-span-5 space-y-8">
          <div className="relative h-[450px] w-full perspective-1000 cursor-pointer" onClick={handleCheckinClick}>
            <AnimatePresence mode="wait">
              <motion.div
                key={hasCheckedInToday ? 'back' : 'front'}
                initial={{ rotateY: 0 }}
                animate={{ rotateY: hasCheckedInToday || isFlipped ? 180 : 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="w-full h-full preserve-3d relative"
              >
                {/* Front: Sect Master's Order */}
                <Card className="absolute inset-0 backface-hidden flex flex-col items-center justify-center p-12 rounded-[3.5rem] bg-slate-900 border-none shadow-2xl overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-50" />
                  <motion.div 
                    animate={{ scale: [1, 1.05, 1], rotate: [-1, 1, -1] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="relative z-10 p-8 bg-white/5 rounded-4xl border border-white/10 shadow-inner"
                  >
                    <ScrollText className="h-24 w-24 text-yellow-500" />
                  </motion.div>
                  <h3 className="mt-8 text-3xl font-display font-bold text-white relative z-10">掌门令</h3>
                  <p className="mt-2 text-yellow-500/60 font-black uppercase tracking-[0.4em] text-xs relative z-10">Sect Master's Order</p>
                  {!hasCheckedInToday && (
                    <motion.div 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      className="absolute bottom-10 text-white/40 text-xs font-bold uppercase tracking-widest animate-pulse"
                    >
                      点击开启今日运势
                    </motion.div>
                  )}
                </Card>
                {/* Back: Reward and Fortune */}
                <Card className="absolute inset-0 backface-hidden rotate-y-180 flex flex-col items-center justify-center p-10 rounded-[3.5rem] bg-card border-none shadow-2xl overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl" />
                  <div className="flex items-center gap-3 mb-6">
                    <Zap className="h-8 w-8 text-yellow-500" />
                    <span className="text-xl font-display font-bold">每日灵通</span>
                  </div>
                  <div className="bg-secondary/40 p-8 rounded-4xl border border-border/50 text-center space-y-4">
                    <p className="text-2xl font-display font-bold leading-relaxed">
                      {isCheckingIn ? "正在参悟法旨..." : fortune}
                    </p>
                  </div>
                  <div className="mt-8 flex items-center gap-4">
                    <div className="px-6 py-2 bg-primary/10 rounded-2xl border border-primary/20 text-primary font-bold">
                      连胜: {streak} 天
                    </div>
                    <div className="px-6 py-2 bg-yellow-500/10 rounded-2xl border border-yellow-500/20 text-yellow-600 font-bold">
                      倍率: {(1 + streak * 0.1).toFixed(1)}x
                    </div>
                  </div>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>
          <Card className="p-8 rounded-[3rem] bg-primary text-primary-foreground shadow-2xl overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
            <h2 className="text-2xl font-display font-bold mb-4 flex items-center gap-3">
              <Trophy className="h-6 w-6 text-yellow-400" /> 连胜成就
            </h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-4xl font-display font-bold">{streak}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary-foreground/60">当��不间断修行天数</p>
              </div>
              <div className="p-4 bg-white/10 rounded-3xl">
                <Flame className={cn("h-10 w-10", streak > 0 ? "text-orange-400 animate-pulse" : "text-white/20")} />
              </div>
            </div>
          </Card>
        </div>
        {/* Right Column: Calendar and Recommendations */}
        <div className="lg:col-span-7 space-y-10">
          <Card className="border-none shadow-soft bg-card/40 backdrop-blur-xl rounded-[3rem] p-8">
            <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-3">
              <CalendarCheck className="h-6 w-6 text-primary/40" /> 修行日历
            </h2>
            <div className="flex justify-center">
              <Calendar
                mode="multiple"
                selected={checkinDates}
                className="rounded-3xl border-none p-4"
                classNames={{
                  day_selected: "bg-emerald-500 text-white hover:bg-emerald-600 hover:text-white rounded-2xl",
                  day_today: "bg-primary/10 text-primary font-bold rounded-2xl",
                  day: "h-12 w-12 p-0 font-bold rounded-2xl text-base transition-all hover:bg-secondary",
                  head_cell: "text-muted-foreground/60 w-12 font-bold text-[0.8rem] uppercase tracking-[0.2em] pb-6",
                }}
              />
            </div>
          </Card>
          <div className="space-y-6">
            <h2 className="text-2xl font-display font-bold flex items-center gap-3">
              <Sparkles className="h-6 w-6 text-yellow-500" /> 今日法课建议
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recommendations.map((rec) => (
                <Link key={rec.path} to={rec.path}>
                  <Card className="p-6 rounded-[2.5rem] border-none shadow-soft bg-card hover:translate-y-[-4px] transition-all cursor-pointer group">
                    <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:rotate-12", rec.bg, rec.color)}>
                      <rec.icon className="h-7 w-7" />
                    </div>
                    <h3 className="font-bold text-lg mb-1">{rec.title}</h3>
                    <div className="flex items-center text-xs font-bold text-muted-foreground group-hover:text-primary transition-colors">
                      立��开始 <ChevronRight className="h-3 w-3 ml-1" />
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}