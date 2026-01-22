import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Library, BookOpen, Clock, Star, Download, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
export default function ResourcesPage() {
  const resourceCategories = [
    { title: "最近研读", icon: Clock, count: 12 },
    { title: "收藏法诀", icon: Star, count: 45 },
    { title: "核心词汇", icon: BookOpen, count: 1200 },
    { title: "写作模版", icon: Library, count: 8 },
  ];
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12">
      <header className="mb-16 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-2">
            <h1 className="text-6xl font-display font-bold">资源藏经阁</h1>
            <p className="text-muted-foreground text-xl italic">“书山有���勤为径，学海无涯苦作舟。”</p>
          </div>
          <div className="relative w-full max-w-md">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input className="pl-14 h-16 rounded-[2rem] bg-secondary/50 border-none font-bold text-lg shadow-inner" placeholder="搜索论文、单词或模版..." />
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {resourceCategories.map((cat) => (
            <Card key={cat.title} className="p-8 rounded-[2.5rem] border-none shadow-soft hover:scale-[1.05] transition-all cursor-pointer bg-card/40 backdrop-blur-xl group">
              <div className="flex items-center gap-5">
                <div className="h-16 w-16 rounded-3xl bg-primary/10 text-primary flex items-center justify-center group-hover:rotate-12 transition-transform shadow-lg">
                  <cat.icon className="h-8 w-8" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-1">{cat.title}</p>
                  <p className="text-3xl font-display font-bold">{cat.count}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </header>
      <div className="space-y-10">
        <div className="flex items-center justify-between border-b border-border/50 pb-6">
          <h2 className="text-3xl font-display font-bold">论文档案 (Archives)</h2>
          <Button variant="ghost" className="font-bold text-primary hover:bg-transparent px-0 text-lg">查���全部</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="group p-10 rounded-[3.5rem] border-none shadow-soft hover:shadow-2xl transition-all relative overflow-hidden bg-card/60 backdrop-blur-xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700" />
              <div className="space-y-6 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="px-3 py-1 bg-emerald-500/10 text-emerald-600 rounded-xl text-[10px] font-bold uppercase tracking-widest border border-emerald-500/20">研读中</div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">2024-05-{i}0</span>
                </div>
                <h3 className="text-2xl font-bold font-display leading-tight group-hover:text-primary transition-colors">
                  Generative Pre-trained Transformers (GPT-{i}) Technical Report
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed font-medium">
                  本文介绍了 GPT-{i} 模型在大规模语料库上的预训练过程及其在下游任务中的卓越表现。详细探讨了模型架构的演进。
                </p>
                <div className="pt-6 flex items-center justify-between">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">已用 15 番茄</span>
                  <Button variant="ghost" size="sm" className="rounded-2xl h-12 px-6 font-bold gap-3 bg-secondary/50 hover:bg-secondary">
                    <Download className="h-5 w-5" /> PDF
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}