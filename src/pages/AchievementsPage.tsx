import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Star, Lock, Award, User, Flame, BookOpen, Brain, Zap, Target, Sparkles, PenTool } from 'lucide-react';
import { ACHIEVEMENT_LIST, LEADERBOARD_DATA } from '@/lib/mock-academic';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/use-app-store';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
function AchievementCard({ achievement, isUnlocked }: { achievement: any, isUnlocked: boolean }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const Icon = achievement.icon;
  return (
    <div 
      className="relative h-64 w-full perspective-1000 cursor-pointer"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="w-full h-full preserve-3d relative"
      >
        {/* Front */}
        <Card className={cn(
          "absolute inset-0 backface-hidden flex flex-col items-center justify-center text-center p-6 rounded-[2.5rem] border-none shadow-xl",
          isUnlocked ? "bg-card" : "bg-secondary/40 grayscale"
        )}>
          <div className={cn(
            "h-20 w-20 rounded-3xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110",
            isUnlocked ? "bg-yellow-100 text-yellow-600" : "bg-slate-200 text-slate-400"
          )}>
            {isUnlocked ? <Icon className="h-10 w-10" /> : <Lock className="h-8 w-8" />}
          </div>
          <h3 className="font-display font-bold text-base">{achievement.name}</h3>
          <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-widest">{isUnlocked ? "已参悟" : "未解锁"}</p>
        </Card>
        {/* Back */}
        <Card className={cn(
          "absolute inset-0 backface-hidden rotate-y-180 flex flex-col items-center justify-center text-center p-6 rounded-[2.5rem] border-none shadow-xl bg-slate-900 text-white"
        )}>
          <Badge className="bg-yellow-500 mb-4">{achievement.requirement}</Badge>
          <p className="text-sm font-medium leading-relaxed italic">"{achievement.description}"</p>
          <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <Sparkles className="h-3 w-3" /> 点击返回
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
const getSectTitle = (level: number) => {
  if (level >= 40) return "大乘期导师";
  if (level >= 30) return "元婴学霸";
  if (level >= 20) return "结丹修士";
  if (level >= 10) return "筑基新贵";
  return "炼��学徒";
};
export function AchievementsPage() {
  const unlockedIds = useAppStore(s => s.userStats?.unlockedAchievements ?? []);
  const categories = ['All', 'Academic', 'Persistence', 'Special'];
  return (
    <AppLayout container>
      <header className="mb-12 text-center space-y-4">
        <div className="mx-auto h-24 w-24 rounded-[2rem] bg-yellow-500 flex items-center justify-center shadow-2xl rotate-[-5deg] mb-6">
          <Trophy className="h-12 w-12 text-white" />
        </div>
        <h1 className="text-5xl font-display font-bold tracking-tight">荣誉殿堂</h1>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto italic">
          “修行之路��每一刻都算数。这里见证了你跨越学术荒原的足迹。”
        </p>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-8">
          <Tabs defaultValue="All" className="w-full">
            <div className="flex items-center justify-between mb-8">
              <TabsList className="bg-secondary/50 rounded-2xl h-14 p-1">
                {categories.map(cat => (
                  <TabsTrigger key={cat} value={cat} className="rounded-xl px-6 font-bold h-full">{cat}</TabsTrigger>
                ))}
              </TabsList>
              <Badge variant="outline" className="h-10 px-4 rounded-xl border-primary/20 bg-primary/5">
                进度: {unlockedIds.length} / {ACHIEVEMENT_LIST.length}
              </Badge>
            </div>
            <TabsContent value="All" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {ACHIEVEMENT_LIST.map((achievement) => (
                  <AchievementCard 
                    key={achievement.id} 
                    achievement={achievement} 
                    isUnlocked={unlockedIds.includes(achievement.id)} 
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
        <aside className="lg:col-span-4 space-y-8">
          <Card className="rounded-[3rem] p-8 bg-card/60 backdrop-blur-xl border-none shadow-soft">
            <h2 className="text-2xl font-display font-bold mb-8 flex items-center gap-3">
              <Star className="h-6 w-6 text-yellow-500" /> 宗门排行
            </h2>
            <div className="space-y-6">
              {LEADERBOARD_DATA.map((scholar, index) => (
                <div key={scholar.id} className="flex items-center gap-4 group">
                  <div className="relative">
                    <Avatar className="h-12 w-12 border-2 border-primary/10">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${scholar.name}`} />
                      <AvatarFallback><User /></AvatarFallback>
                    </Avatar>
                    {index < 3 && (
                      <div className={cn(
                        "absolute -top-2 -left-2 h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-black shadow-lg",
                        index === 0 ? "bg-yellow-400 text-yellow-900" :
                        index === 1 ? "bg-slate-300 text-slate-700" :
                        "bg-amber-600 text-amber-50"
                      )}>{index + 1}</div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-sm">{scholar.name}</p>
                      <Badge variant="outline" className="rounded-lg text-[9px] font-bold">
                        {getSectTitle(scholar.level)}
                      </Badge>
                    </div>
                    <div className="h-1.5 w-full bg-secondary rounded-full mt-2 overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${(scholar.xp % 1000) / 10}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button className="w-full mt-8 rounded-2xl font-bold bg-secondary text-secondary-foreground hover:bg-secondary/80">
              查���论道全榜
            </Button>
          </Card>
        </aside>
      </div>
    </AppLayout>
  );
}