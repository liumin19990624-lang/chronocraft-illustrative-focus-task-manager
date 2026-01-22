import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Trophy, Lock, User, Sparkles } from 'lucide-react';
import { ACHIEVEMENT_LIST } from '@/lib/mock-academic';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/use-app-store';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api-client';
function AchievementCard({ achievement, isUnlocked }: { achievement: any, isUnlocked: boolean }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const Icon = achievement.icon;
  return (
    <div className="relative h-64 w-full perspective-1000 cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="w-full h-full preserve-3d relative"
      >
        <Card className={cn(
          "absolute inset-0 backface-hidden flex flex-col items-center justify-center text-center p-6 rounded-[2.5rem] border-none shadow-xl",
          isUnlocked ? "bg-card" : "bg-secondary/40 grayscale"
        )}>
          {isUnlocked && (
            <div className="absolute inset-0 bg-primary/5 rounded-[2.5rem] pointer-events-none" />
          )}
          <div className={cn(
            "h-20 w-20 rounded-3xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 shadow-lg",
            isUnlocked ? "bg-yellow-100 text-yellow-600" : "bg-slate-200 text-slate-400"
          )}>
            {isUnlocked ? <Icon className="h-10 w-10" /> : <Lock className="h-8 w-8" />}
          </div>
          <h3 className="font-display font-bold text-base">{achievement.name}</h3>
          <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-widest">{isUnlocked ? "已参悟" : "未解锁"}</p>
        </Card>
        <Card className="absolute inset-0 backface-hidden rotate-y-180 flex flex-col items-center justify-center text-center p-6 rounded-[2.5rem] border-none shadow-xl bg-slate-900 text-white">
          <Badge className="bg-yellow-500 mb-4">{achievement.requirement}</Badge>
          <p className="text-sm font-medium leading-relaxed italic px-4">"{achievement.description}"</p>
          <div className="mt-6 flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <Sparkles className="h-3 w-3" /> 点击返回
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
export default function AchievementsPage() {
  const unlockedIds = useAppStore(s => s.userStats?.unlockedAchievements ?? []);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  useEffect(() => {
    api<any[]>('/api/leaderboard').then(setLeaderboard).catch(console.error);
  }, []);
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12">
      <header className="mb-16 text-center space-y-4">
        <motion.div 
          initial={{ scale: 0.8, rotate: -5 }}
          animate={{ scale: 1, rotate: 0 }}
          className="mx-auto h-24 w-24 rounded-[2rem] bg-yellow-500 flex items-center justify-center shadow-2xl mb-8"
        >
          <Trophy className="h-12 w-12 text-white" />
        </motion.div>
        <h1 className="text-6xl font-display font-bold tracking-tight">荣誉殿堂</h1>
        <p className="text-muted-foreground text-xl max-w-xl mx-auto italic">“修行之路，寸阴是惜；功不唐捐，玉汝于成。”</p>
      </header>
      <Tabs defaultValue="achievements" className="w-full">
        <TabsList className="bg-secondary/50 rounded-2xl h-14 p-1 mb-12 max-w-xs mx-auto flex border border-border/50">
          <TabsTrigger value="achievements" className="flex-1 rounded-xl font-bold h-full">成就���</TabsTrigger>
          <TabsTrigger value="rankings" className="flex-1 rounded-xl font-bold h-full">宗门排行</TabsTrigger>
        </TabsList>
        <TabsContent value="achievements">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {ACHIEVEMENT_LIST.map((achievement) => (
              <AchievementCard key={achievement.id} achievement={achievement} isUnlocked={unlockedIds.includes(achievement.id)} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="rankings">
          <Card className="max-w-4xl mx-auto rounded-[3.5rem] p-10 bg-card/60 backdrop-blur-xl border-none shadow-soft">
            <div className="space-y-6">
              {leaderboard.map((scholar, index) => (
                <div key={scholar.id} className="flex items-center gap-6 group p-5 rounded-[2rem] hover:bg-primary/5 transition-all">
                  <div className="text-3xl font-display font-bold text-muted-foreground/30 w-10">{index + 1}</div>
                  <Avatar className="h-16 w-16 border-2 border-primary/10 shadow-lg">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${scholar.name}`} />
                    <AvatarFallback><User /></AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-bold text-xl">{scholar.name}</p>
                      <Badge variant="outline" className="rounded-lg font-bold border-primary/20 text-primary">LV. {scholar.level}</Badge>
                    </div>
                    <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(scholar.xp % 1000) / 10}%` }}
                        className="h-full bg-primary"
                      />
                    </div>
                  </div>
                  <div className="text-right pl-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">总灵力</p>
                    <p className="text-2xl font-display font-bold text-primary">{scholar.xp.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}