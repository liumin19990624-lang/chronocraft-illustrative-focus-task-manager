import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/card';
import { Trophy, Star, Lock, Info, Award } from 'lucide-react';
import { ACHIEVEMENT_LIST } from '@/lib/mock-academic';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/use-app-store';
export function AchievementsPage() {
  const userStats = useAppStore(s => s.userStats);
  const unlockedIds = userStats?.unlockedAchievements ?? [];
  return (
    <AppLayout container>
      <header className="mb-12 text-center space-y-4">
        <div className="mx-auto h-24 w-24 rounded-[2rem] bg-yellow-500 flex items-center justify-center shadow-2xl shadow-yellow-500/20 rotate-[-5deg] mb-6">
          <Trophy className="h-12 w-12 text-white" />
        </div>
        <h1 className="text-5xl font-display font-bold tracking-tight">荣誉殿堂</h1>
        <p className="text-muted-foreground text-lg font-medium max-w-xl mx-auto italic">
          “修行之路，每一���都算数。这里见证了你跨越学术荒原的足迹。”
        </p>
      </header>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {ACHIEVEMENT_LIST.map((achievement) => {
          const isUnlocked = unlockedIds.includes(achievement.id);
          const Icon = achievement.icon;
          return (
            <motion.div
              key={achievement.id}
              whileHover={{ scale: 1.05, rotate: 1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Card className={cn(
                "relative h-72 rounded-[2.5rem] border-none p-6 flex flex-col items-center justify-center text-center transition-all duration-500 group overflow-hidden",
                isUnlocked ? "bg-white dark:bg-slate-900 shadow-xl" : "bg-secondary/20 opacity-60 grayscale"
              )}>
                {/* Background Glow */}
                <div className={cn(
                  "absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity blur-3xl",
                  isUnlocked ? "bg-yellow-500" : "bg-slate-500"
                )} />
                <div className={cn(
                  "h-24 w-24 rounded-3xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110",
                  isUnlocked ? "bg-yellow-100 text-yellow-600 shadow-lg" : "bg-slate-200 text-slate-400"
                )}>
                  {isUnlocked ? <Icon className="h-12 w-12" /> : <Lock className="h-10 w-10" />}
                </div>
                <div className="space-y-1 relative z-10">
                  <h3 className="font-display font-bold text-lg">{achievement.name}</h3>
                  <p className="text-xs text-muted-foreground font-medium px-2">{achievement.description}</p>
                </div>
                {isUnlocked && (
                  <div className="absolute top-4 right-4 h-8 w-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-md">
                    <Award className="h-4 w-4 text-white" />
                  </div>
                )}
                {!isUnlocked && (
                  <div className="mt-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    <Info className="h-3 w-3" />
                    <span>��：{achievement.requirement}</span>
                  </div>
                )}
              </Card>
            </motion.div>
          );
        })}
      </div>
      <footer className="mt-20 p-12 bg-secondary/20 rounded-[3rem] border border-border/50 text-center">
        <div className="max-w-md mx-auto space-y-6">
          <Star className="h-8 w-8 text-yellow-500 mx-auto animate-pulse" />
          <h2 className="text-2xl font-display font-bold">宗门排名：��传弟子</h2>
          <div className="h-3 w-full bg-background rounded-full overflow-hidden border border-border/50">
            <div className="h-full bg-yellow-500 w-[65%]" />
          </div>
          <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest">
            距离“学术大能”境界��需 4500 经验
          </p>
        </div>
      </footer>
    </AppLayout>
  );
}