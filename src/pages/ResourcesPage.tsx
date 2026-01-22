import React, { useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Library, BookOpen, Clock, Star, Download, Search, FileCheck, CheckCircle2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useAppStore } from '@/store/use-app-store';
import { useShallow } from 'zustand/react/shallow';
import { format } from 'date-fns';
export default function ResourcesPage() {
  const tasks = useAppStore(useShallow(s => s.tasks));
  const userStats = useAppStore(s => s.userStats);
  const [search, setSearch] = useState("");
  const archivedQuests = useMemo(() => {
    return tasks.filter(t => t.isArchived && t.title.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => new Date(b.completedAt || 0).getTime() - new Date(a.completedAt || 0).getTime());
  }, [tasks, search]);
  const handleDownloadReport = () => {
    if (!userStats) return;
    const report = `CHRONOCRAFT 修行报���\n====================\n道号: ${userStats.nickname}\n当前境界: ${userStats.level}\n总专注时长: ${userStats.totalFocusMinutes} 分钟\n已圆满蓝图: ${userStats.totalTasksCompleted} 个\n生成时间: ${new Date().toLocaleString()}\n\n天道酬勤，道友自强不息，未来可期。`;
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chronocraft_report_${userStats.nickname}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12">
      <header className="mb-16 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-2">
            <h1 className="text-6xl font-display font-bold">资源藏经阁</h1>
            <p className="text-muted-foreground text-xl italic">“书山有路勤为径，学海无涯苦作舟。”</p>
          </div>
          <div className="relative w-full max-w-md">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              className="pl-14 h-16 rounded-[2rem] bg-secondary/50 border-none font-bold text-lg shadow-inner" 
              placeholder="在归档蓝图中检索..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-4">
          <Button onClick={handleDownloadReport} className="rounded-2xl h-14 px-8 font-bold gap-3 shadow-lg shadow-primary/20">
            <Download className="h-5 w-5" /> 导出修行月报
          </Button>
        </div>
      </header>
      <div className="space-y-10">
        <div className="flex items-center justify-between border-b border-border/50 pb-6">
          <h2 className="text-3xl font-display font-bold flex items-center gap-3">
            <FileCheck className="h-8 w-8 text-emerald-500" /> 已圆满蓝图 (Archived Quests)
          </h2>
          <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">{archivedQuests.length} 个历史记录</span>
        </div>
        {archivedQuests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-secondary/10 rounded-[4rem] border-4 border-dashed border-muted-foreground/10 text-center">
             <Library className="h-20 w-20 text-muted-foreground/20 mb-6" />
             <p className="text-xl font-display font-bold text-muted-foreground">尚未有圆满的���诀归于藏经阁</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {archivedQuests.map((quest) => (
              <Card key={quest.id} className="group p-10 rounded-[3.5rem] border-none shadow-soft hover:shadow-2xl transition-all relative overflow-hidden bg-card/60 backdrop-blur-xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700" />
                <div className="space-y-6 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="px-3 py-1 bg-emerald-500/10 text-emerald-600 rounded-xl text-[10px] font-bold uppercase tracking-widest border border-emerald-500/20 flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" /> 已圆满
                    </div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                      {quest.completedAt ? format(new Date(quest.completedAt), 'yyyy-MM-dd') : '历史数据'}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold font-display leading-tight group-hover:text-primary transition-colors">
                    {quest.title}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {quest.tags.map(tag => (
                      <span key={tag} className="text-[10px] font-bold text-muted-foreground/60 bg-secondary px-2 py-0.5 rounded-lg">#{tag}</span>
                    ))}
                  </div>
                  <div className="pt-6 flex items-center justify-between border-t border-border/20">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">修为转化</span>
                      <span className="text-sm font-bold text-primary">{quest.pomodoroSpent * 25} 分钟专注</span>
                    </div>
                    <Button variant="ghost" size="icon" className="rounded-xl h-12 w-12 bg-secondary/50 hover:bg-secondary">
                      <Download className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}