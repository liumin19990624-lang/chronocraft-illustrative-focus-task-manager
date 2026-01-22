import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Library, BookOpen, Clock, Star, Download, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
export function ResourcesPage() {
  const resourceCategories = [
    { title: "最近研读", icon: Clock, count: 12 },
    { title: "收藏法诀", icon: Star, count: 45 },
    { title: "核心词汇", icon: BookOpen, count: 1200 },
    { title: "写作模版", icon: Library, count: 8 },
  ];
  return (
    <AppLayout container>
      <header className="mb-12 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-display font-bold">资源藏经阁</h1>
            <p className="text-muted-foreground font-medium">整理、归档、复习你的所有修行成果</p>
          </div>
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input className="pl-12 h-14 rounded-2xl bg-secondary/50 border-none font-medium" placeholder="搜索论文、单词或模版..." />
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {resourceCategories.map((cat) => (
            <Card key={cat.title} className="p-6 rounded-4xl border-none shadow-soft hover:scale-[1.02] transition-all cursor-pointer bg-card/40 backdrop-blur-xl">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                  <cat.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{cat.title}</p>
                  <p className="text-xl font-display font-bold">{cat.count}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </header>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-display font-bold">论文档案 (Archives)</h2>
          <Button variant="link" className="font-bold">查看全部</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="group p-8 rounded-[2.5rem] border-none shadow-soft hover:shadow-xl transition-all relative overflow-hidden bg-card/60 backdrop-blur-xl">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform" />
              <div className="space-y-4 relative z-10">
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1 bg-emerald-500/10 text-emerald-600 rounded-lg text-[10px] font-bold uppercase tracking-widest">研读中</div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">2024-05-{i}0</span>
                </div>
                <h3 className="text-lg font-bold font-display leading-tight group-hover:text-primary transition-colors">
                  Generative Pre-trained Transformers (GPT-{i}) Technical Report
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  本文介绍�� GPT-{i} 模型在大规模语料库上的预训练过程及其在下游任务中的卓越表��。
                </p>
                <div className="pt-4 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">已用 15 番茄</span>
                  <Button variant="ghost" size="sm" className="rounded-xl h-10 px-4 font-bold gap-2">
                    <Download className="h-4 w-4" /> PDF
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}