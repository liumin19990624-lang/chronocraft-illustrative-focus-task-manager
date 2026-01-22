import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Star, Lock, Award, User } from 'lucide-react';
import { ACHIEVEMENT_LIST, LEADERBOARD_DATA } from '@/lib/mock-academic';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/use-app-store';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
export function AchievementsPage() {
  const userStats = useAppStore(s => s.userStats);
  const unlockedIds = userStats?.unlockedAchievements ?? [];
  const categories = ['All', 'Academic', 'Persistence', 'Special'];
  return (
    <AppLayout container>
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 text-center space-y-4">
          <div className="mx-auto h-24 w-24 rounded-[2rem] bg-yellow-500 flex items-center justify-center shadow-2xl shadow-yellow-500/20 rotate-[-5deg] mb-6">
            <Trophy className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-5xl font-display font-bold tracking-tight text-foreground">荣誉殿堂</h1>
          <p className="text-muted-foreground text-lg font-medium max-w-xl mx-auto italic">
            “修行之路，每���刻都算数。这里见证了你跨越学术荒原的足迹。”
          </p>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left: Achievements Wall */}
          <div className="lg:col-span-8 space-y-8">
            <Tabs defaultValue="All" className="w-full">
              <div className="flex items-center justify-between mb-8">
                <TabsList className="bg-secondary/50 rounded-2xl h-14 p-1">
                  {categories.map(cat => (
                    <TabsTrigger key={cat} value={cat} className="rounded-xl px-6 font-bold h-full">
                      {cat}
                    </TabsTrigger>
                  ))}
                </TabsList>
                <div className="hidden md:block">
                  <span className="text-sm font-bold text-muted-foreground">
                    已解锁: {unlockedIds.length} / {ACHIEVEMENT_LIST.length}
                  </span>
                </div>
              </div>
              <TabsContent value="All" className="mt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {ACHIEVEMENT_LIST.map((achievement) => {
                    const isUnlocked = unlockedIds.includes(achievement.id);
                    const Icon = achievement.icon;
                    return (
                      <motion.div
                        key={achievement.id}
                        whileHover={{ scale: 1.05 }}
                      >
                        <Card className={cn(
                          "relative h-64 rounded-[2.5rem] border-none p-6 flex flex-col items-center justify-center text-center transition-all duration-500 group overflow-hidden",
                          isUnlocked ? "bg-card shadow-xl" : "bg-secondary/20 opacity-60 grayscale"
                        )}>
                          <div className={cn(
                            "h-20 w-20 rounded-3xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110",
                            isUnlocked ? "bg-yellow-100 text-yellow-600 shadow-lg" : "bg-slate-200 text-slate-400"
                          )}>
                            {isUnlocked ? <Icon className="h-10 w-10" /> : <Lock className="h-8 w-8" />}
                          </div>
                          <div className="space-y-1 relative z-10">
                            <h3 className="font-display font-bold text-base text-foreground">{achievement.name}</h3>
                            <p className="text-[10px] text-muted-foreground font-medium px-2">{achievement.description}</p>
                          </div>
                          {isUnlocked && (
                            <div className="absolute top-4 right-4 h-6 w-6 bg-emerald-500 rounded-full flex items-center justify-center shadow-md">
                              <Award className="h-3 w-3 text-white" />
                            </div>
                          )}
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </TabsContent>
            </Tabs>
          </div>
          {/* Right: Sect Ranking (Leaderboard) */}
          <aside className="lg:col-span-4 space-y-8">
            <Card className="rounded-[3rem] border-none shadow-soft p-8 bg-card/60 backdrop-blur-xl">
              <h2 className="text-2xl font-display font-bold mb-8 flex items-center gap-3 text-foreground">
                <Star className="h-6 w-6 text-yellow-500" /> 宗门排行
              </h2>
              <div className="space-y-6">
                {LEADERBOARD_DATA.map((scholar, index) => (
                  <div key={scholar.id} className="flex items-center gap-4 group">
                    <div className="relative">
                      <Avatar className="h-12 w-12 border-2 border-primary/10 group-hover:border-primary/50 transition-colors">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${scholar.name}`} />
                        <AvatarFallback><User /></AvatarFallback>
                      </Avatar>
                      {index < 3 && (
                        <div className={cn(
                          "absolute -top-2 -left-2 h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-black shadow-lg",
                          index === 0 ? "bg-yellow-400 text-yellow-900" :
                          index === 1 ? "bg-slate-300 text-slate-700" :
                          "bg-amber-600 text-amber-50"
                        )}>
                          {index + 1}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-sm text-foreground">{scholar.name}</p>
                        <Badge variant="outline" className="rounded-lg text-[10px] font-bold border-primary/20 bg-primary/5">
                          {scholar.level} 重
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="h-1 flex-1 bg-secondary rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: `${(scholar.xp % 1000) / 10}%` }} />
                        </div>
                        <span className="text-[10px] font-bold text-muted-foreground">{scholar.xp} XP</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-8 rounded-2xl font-bold h-12 bg-secondary text-secondary-foreground hover:bg-secondary/80">
                查看论道全榜
              </Button>
            </Card>
            <Card className="rounded-[3rem] border-none shadow-soft p-8 bg-slate-900 text-white text-center space-y-4">
              <Trophy className="h-12 w-12 text-yellow-500 mx-auto" />
              <div className="space-y-1">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">当前排名</p>
                <p className="text-2xl font-display font-bold text-yellow-500">真传弟子</p>
              </div>
              <p className="text-xs text-slate-500">超越了 88% 的同门修士</p>
            </Card>
          </aside>
        </div>
      </div>
    </AppLayout>
  );
}