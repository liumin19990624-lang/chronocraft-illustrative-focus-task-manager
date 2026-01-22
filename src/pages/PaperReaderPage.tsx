import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { FileText, Brain, Sparkles, Languages, Bookmark, Share2 } from 'lucide-react';
import { PAPER_DATA } from '@/lib/mock-academic';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
export function PaperReaderPage() {
  const [activeSection, setActiveSection] = useState('abstract');
  const [showAnalysis, setShowAnalysis] = useState(true);
  return (
    <AppLayout container>
      <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary font-bold">
            <FileText className="h-5 w-5" />
            <span className="uppercase tracking-widest text-sm">Paper Reader / 论文研习</span>
          </div>
          <h1 className="text-4xl font-display font-bold leading-tight max-w-3xl">
            {PAPER_DATA.title}
          </h1>
          <p className="text-muted-foreground font-medium">{PAPER_DATA.authors}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" className="rounded-2xl"><Bookmark className="h-5 w-5" /></Button>
          <Button variant="outline" size="icon" className="rounded-2xl"><Share2 className="h-5 w-5" /></Button>
          <Button className="rounded-2xl font-bold px-6 bg-emerald-600 hover:bg-emerald-500">导出摘���</Button>
        </div>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Pane: Reader */}
        <Card className="lg:col-span-8 p-10 rounded-[3rem] border-none shadow-soft min-h-[700px] bg-card/40 backdrop-blur-xl">
          <Tabs value={activeSection} onValueChange={setActiveSection} className="w-full">
            <TabsList className="bg-secondary/50 p-1 rounded-2xl mb-8">
              <TabsTrigger value="abstract" className="rounded-xl px-6 font-bold">Abstract</TabsTrigger>
              <TabsTrigger value="intro" className="rounded-xl px-6 font-bold">Introduction</TabsTrigger>
              <TabsTrigger value="method" className="rounded-xl px-6 font-bold">Methodology</TabsTrigger>
            </TabsList>
            <TabsContent value="abstract" className="mt-0">
              <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
                <p className="text-2xl font-display italic text-muted-foreground leading-relaxed">
                  {PAPER_DATA.abstract}
                </p>
              </div>
            </TabsContent>
            <TabsContent value="intro" className="mt-0">
              <div className="space-y-6 text-lg leading-relaxed text-foreground/80 font-medium">
                {PAPER_DATA.introduction.map((para, i) => (
                  <p key={i} className="hover:bg-primary/5 p-2 rounded-lg transition-colors cursor-text">
                    {para}
                  </p>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </Card>
        {/* Right Pane: AI Analysis */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-display font-bold flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-500" /> 神识分�� (AI)
            </h2>
            <Button variant="ghost" size="sm" onClick={() => setShowAnalysis(!showAnalysis)} className="text-xs font-bold uppercase">
              {showAnalysis ? "隐藏" : "显示"}
            </Button>
          </div>
          {showAnalysis && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <Card className="p-6 rounded-4xl bg-purple-500/5 border-purple-500/10 space-y-4">
                <div className="flex items-center gap-2 text-purple-500 font-bold">
                  <Sparkles className="h-4 w-4" />
                  <span className="text-xs uppercase tracking-widest">核心论点</span>
                </div>
                <ul className="space-y-3">
                  {PAPER_DATA.aiAnalysis.keyPoints.map((point, i) => (
                    <li key={i} className="flex gap-3 text-sm font-medium">
                      <div className="h-5 w-5 rounded-full bg-purple-500/20 text-purple-600 flex items-center justify-center shrink-0 font-bold text-[10px]">{i+1}</div>
                      {point}
                    </li>
                  ))}
                </ul>
              </Card>
              <Card className="p-6 rounded-4xl bg-blue-500/5 border-blue-500/10 space-y-4">
                <div className="flex items-center gap-2 text-blue-500 font-bold">
                  <Languages className="h-4 w-4" />
                  <span className="text-xs uppercase tracking-widest">关键术语</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {PAPER_DATA.aiAnalysis.terminology.map((term) => (
                    <div key={term.word} className="bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl text-xs border border-blue-500/20 shadow-sm cursor-help hover:scale-105 transition-transform">
                      <span className="font-bold text-blue-600">{term.word}</span>
                    </div>
                  ))}
                </div>
              </Card>
              <div className="bg-secondary/30 p-8 rounded-[2.5rem] border border-border/50 text-center space-y-4">
                <p className="text-sm italic text-muted-foreground font-medium">“书山有���勤为径，AI助航灵气生。”</p>
                <div className="flex justify-center gap-4">
                  <div className="h-2 w-16 bg-primary/10 rounded-full" />
                  <div className="h-2 w-8 bg-primary/30 rounded-full" />
                  <div className="h-2 w-24 bg-primary/5 rounded-full" />
                </div>
              </div>
            </motion.div>
          )}
        </aside>
      </div>
    </AppLayout>
  );
}