import React, { useState, useEffect, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Trophy, Lock, User, Sparkles, CheckCircle2 } from 'lucide-react';
import { ACHIEVEMENT_LIST } from '@/lib/mock-academic';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/use-app-store';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { api } from '@/lib/api-client';
function AchievementCard({ achievement, isUnlocked }: { achievement: any, isUnlocked: boolean }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const Icon = achievement.icon;
  return (
    <div className="relative h-72 w-full perspective-1000 cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="w-full h-full preserve-3d relative"
      >
        <Card className={cn(
          "absolute inset-0 backface-hidden flex flex-col items-center justify-center text-center p-8 rounded-[3rem] border-none shadow-xl transition-all duration-500 overflow-hidden",
          isUnlocked ? "bg-card ring-2 ring-yellow-500/20" : "bg-secondary/40 grayscale"
        )}>
          {isUnlocked && (
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-transparent to-primary/5 pointer-events-none" />
          )}
          <div className={cn(
            "h-24 w-24 rounded-[2rem] flex items-center justify-center mb-6 transition-transform group-hover:scale-110 shadow-lg relative",
            isUnlocked ? "bg-yellow-100 text-yellow-600" : "bg-slate-200 text-slate-400"
          )}>
             {isUnlocked && <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} className="absolute inset-0 border-2 border-dashed border-yellow-500/30 rounded-[2rem]" />}
            {isUnlocked ? <Icon className="h-12 w-12" /> : <Lock className="h-10 w-10" />}
          </div>
          <h3 className="font-display font-bold text-xl">{achievement.name}</h3>
          <p className="text-[10px] text-muted-foreground mt-2 uppercase tracking-[0.3em] font-black">{isUnlocked ? "已参悟" : "未解锁"}</p>
          {isUnlocked && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-4 right-4 text-emerald-500">
               <CheckCircle2 className="h-6 w-6" />
            </motion.div>
          )}
        </Card>
        <Card className="absolute inset-0 backface-hidden rotate-y-180 flex flex-col items-center justify-center text-center p-8 rounded-[3rem] border-none shadow-2xl bg-slate-900 text-white overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent pointer-events-none" />
          <Badge className="bg-yellow-500 text-white px-4 py-1 rounded-xl mb-6 font-bold shadow-lg shadow-yellow-500/20">{achievement.requirement}</Badge>
          <p className="text-lg font-display font-medium leading-relaxed italic px-4 text-slate-200">"{achievement.description}"</p>
          <div className="mt-8 flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <Sparkles className="h-4 w-4 text-yellow-500" /> 点击返回
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
export default function AchievementsPage() {
  const unlockedIds = useAppStore(s => s.userStats?.unlockedAchievements ?? []);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const progress = useMemo(() => {
    return (unlockedIds.length / ACHIEVEMENT_LIST.length) * 100;
  }, [unlockedIds]);
  useEffect(() => {
    api<any[]>('/api/leaderboard').then(setLeaderboard).catch(console.error);
  }, []);
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12">
      <header className="mb-20 text-center space-y-6">
        <motion.div
          initial={{ scale: 0.8, rotate: -5 }}
          animate={{ scale: 1, rotate: 0 }}
          className="mx-auto h-28 w-28 rounded-[2.5rem] bg-yellow-500 flex items-center justify-center shadow-[0_20px_50px_rgba(234,179,8,0.3)] mb-10"
        >
          <Trophy className="h-16 w-16 text-white" />
        </motion.div>
        <h1 className="text-7xl font-display font-bold tracking-tight">荣誉殿���</h1>
        <p className="text-muted-foreground text-2xl max-w-2xl mx-auto italic font-medium leading-relaxed">
          “修行之路，寸阴是惜���功不唐捐，玉汝于成。”
        </p>
        <div className="max-w-md mx-auto mt-10 space-y-3">
          <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-muted-foreground">
            <span>成就达成率</span>
            <span>{unlockedIds.length} / {ACHIEVEMENT_LIST.length}</span>
          </div>
          <Progress value={progress} className="h-2 rounded-full shadow-inner" />
        </div>
      </header>
      <Tabs defaultValue="achievements" className="w-full">
        <TabsList className="bg-secondary/50 rounded-2xl h-14 p-1 mb-16 max-w-xs mx-auto flex border border-border/50 backdrop-blur-sm">
          <TabsTrigger value="achievements" className="flex-1 rounded-xl font-bold h-full">成就墙</TabsTrigger>
          <TabsTrigger value="rankings" className="flex-1 rounded-xl font-bold h-full">宗门排行</TabsTrigger>
        </TabsList>
        <TabsContent value="achievements">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {ACHIEVEMENT_LIST.map((achievement) => (
              <AchievementCard key={achievement.id} achievement={achievement} isUnlocked={unlockedIds.includes(achievement.id)} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="rankings">
          <Card className="max-w-4xl mx-auto rounded-[4rem] p-12 bg-card/60 backdrop-blur-xl border-none shadow-soft overflow-hidden relative">
            <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -ml-32 -mt-32" />
            <div className="space-y-6 relative z-10">
              {leaderboard.map((scholar, index) => (
                <div key={scholar.id} className="flex items-center gap-8 group p-6 rounded-[2.5rem] hover:bg-primary/5 transition-all border border-transparent hover:border-primary/10">
                  <div className="text-4xl font-display font-bold text-muted-foreground/30 w-12 text-center">{index + 1}</div>
                  <Avatar className="h-20 w-20 border-4 border-white shadow-2xl rounded-3xl transition-transform group-hover:rotate-6">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${scholar.name}`} />
                    <AvatarFallback><User /></AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <p className="font-bold text-2xl font-display">{scholar.name}</p>
                      <Badge variant="outline" className="rounded-xl px-4 py-1 font-bold border-primary/20 text-primary bg-primary/5">LV. {scholar.level}</Badge>
                    </div>
                    <div className="h-2.5 w-full bg-secondary/50 rounded-full overflow-hidden border border-border/50">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(scholar.xp % 1000) / 10}%` }}
                        className="h-full bg-primary"
                      />
                    </div>
                  </div>
                  <div className="text-right pl-6 border-l border-border/50">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-1">总灵力</p>
                    <p className="text-3xl font-display font-bold text-primary">{scholar.xp.toLocaleString()}</p>
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