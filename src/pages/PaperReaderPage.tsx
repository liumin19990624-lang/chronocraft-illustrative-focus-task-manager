import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { FileText, Brain, Sparkles, Languages, Bookmark, Share2, Network, ChevronDown, ListTree, ArrowLeft, Search as SearchIcon } from 'lucide-react';
import { PAPER_DATA } from '@/lib/mock-academic';
import { PaperSearch } from '@/components/papers/PaperSearch';
import { AcademicPaper } from '@shared/types';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
export function PaperReaderPage() {
  const [viewMode, setViewMode] = useState<'search' | 'read'>('search');
  const [activeSection, setActiveSection] = useState('abstract');
  const [showAnalysis, setShowAnalysis] = useState(true);
  const [currentPaper, setCurrentPaper] = useState<AcademicPaper | null>(null);
  const structureNodes = [
    { label: "Abstract", id: "abstract", sub: ["Problem", "Method", "Result"] },
    { label: "Introduction", id: "intro", sub: ["Background", "Contribution"] },
    { label: "Methodology", id: "method", sub: ["Architecture", "Data"] },
    { label: "Experiments", id: "exp", sub: ["Metrics", "Baselines"] },
  ];
  const handleSelectPaper = (paper: AcademicPaper) => {
    setCurrentPaper(paper);
    setViewMode('read');
  };
  return (
    <AppLayout container>
      <div className="max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {viewMode === 'search' ? (
            <motion.div
              key="search-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-12"
            >
              <header className="text-center space-y-4">
                <div className="mx-auto h-20 w-20 rounded-3xl bg-primary text-primary-foreground flex items-center justify-center shadow-2xl rotate-[-4deg] mb-6">
                  <SearchIcon className="h-10 w-10" />
                </div>
                <h1 className="text-5xl font-display font-bold tracking-tight">藏经阁检索</h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto italic">
                  “书山有��，勤为径；学海无涯，搜作舟。” 探索��百万篇学术法诀。
                </p>
              </header>
              <PaperSearch onSelectPaper={handleSelectPaper} />
            </motion.div>
          ) : (
            <motion.div
              key="read-view"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <header className="mb-10 flex flex-col md:flex-row md:items-start justify-between gap-6 relative">
                <div className="space-y-3">
                  <Button 
                    variant="ghost" 
                    className="mb-4 rounded-xl font-bold gap-2 pl-0 hover:bg-transparent hover:text-primary" 
                    onClick={() => setViewMode('search')}
                  >
                    <ArrowLeft className="h-4 w-4" /> 返回检索
                  </Button>
                  <div className="flex items-center gap-2 text-primary font-bold">
                    <div className="p-1.5 bg-primary/10 rounded-lg">
                      <FileText className="h-4 w-4" />
                    </div>
                    <span className="uppercase tracking-widest text-[10px]">Paper Reader / 深度研习</span>
                  </div>
                  <h1 className="text-4xl font-display font-bold leading-tight max-w-4xl tracking-tight">
                    {currentPaper?.title || PAPER_DATA.title}
                  </h1>
                  <p className="text-muted-foreground font-medium text-lg italic">{currentPaper?.authors || PAPER_DATA.authors}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0 md:pt-14">
                  <Button variant="outline" size="icon" className="rounded-2xl h-12 w-12"><Bookmark className="h-5 w-5" /></Button>
                  <Button variant="outline" size="icon" className="rounded-2xl h-12 w-12"><Share2 className="h-5 w-5" /></Button>
                  <Button className="rounded-2xl font-bold h-12 px-8 bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-900/20">导出全篇摘录</Button>
                </div>
              </header>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                <Card className="lg:col-span-8 p-12 rounded-[3.5rem] border-none shadow-soft min-h-[800px] bg-card/60 backdrop-blur-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
                  <Tabs value={activeSection} onValueChange={setActiveSection} className="w-full relative z-10">
                    <TabsList className="bg-secondary/50 p-1.5 rounded-2xl mb-10 h-14 border border-border/50">
                      <TabsTrigger value="abstract" className="rounded-xl px-8 font-bold h-full">Abstract</TabsTrigger>
                      <TabsTrigger value="intro" className="rounded-xl px-8 font-bold h-full">Introduction</TabsTrigger>
                      <TabsTrigger value="method" className="rounded-xl px-8 font-bold h-full">Methodology</TabsTrigger>
                    </TabsList>
                    <TabsContent value="abstract" className="mt-0">
                      <div className="prose prose-slate dark:prose-invert max-w-none">
                        <p className="text-3xl font-display italic text-foreground/90 leading-relaxed first-letter:text-6xl first-letter:font-bold first-letter:mr-3 first-letter:float-left">
                          {currentPaper?.abstract || PAPER_DATA.abstract}
                        </p>
                        <div className="mt-12 p-6 rounded-3xl bg-primary/5 border border-primary/10 flex items-center justify-between group cursor-help">
                          <span className="text-sm font-bold text-muted-foreground flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-purple-500" /> 点击段落触发 AI 句法拆解
                          </span>
                          <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:translate-y-1 transition-transform" />
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="intro" className="mt-0">
                      <div className="space-y-8 text-xl leading-relaxed text-foreground/80 font-medium">
                        {PAPER_DATA.introduction.map((para, i) => (
                          <motion.p
                            key={i}
                            whileHover={{ x: 4 }}
                            className="hover:bg-primary/5 p-4 rounded-2xl transition-all cursor-text border-l-4 border-transparent hover:border-primary/20"
                          >
                            {para}
                          </motion.p>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </Card>
                <aside className="lg:col-span-4 space-y-8 sticky top-8">
                  <div className="flex items-center justify-between px-4">
                    <h2 className="text-2xl font-display font-bold flex items-center gap-3">
                      <Brain className="h-6 w-6 text-purple-500" /> 神识分析
                    </h2>
                    <Button variant="ghost" size="sm" onClick={() => setShowAnalysis(!showAnalysis)} className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      {showAnalysis ? "折叠" : "展开"}
                    </Button>
                  </div>
                  <AnimatePresence>
                    {showAnalysis && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="space-y-6"
                      >
                        <Tabs defaultValue="insights" className="w-full">
                          <TabsList className="w-full bg-secondary/30 rounded-2xl p-1 mb-4 h-12">
                            <TabsTrigger value="insights" className="flex-1 rounded-xl font-bold gap-2">核心</TabsTrigger>
                            <TabsTrigger value="structure" className="flex-1 rounded-xl font-bold gap-2">架构</TabsTrigger>
                            <TabsTrigger value="terms" className="flex-1 rounded-xl font-bold gap-2">术语</TabsTrigger>
                          </TabsList>
                          <TabsContent value="insights" className="space-y-6">
                            <Card className="p-8 rounded-[2.5rem] bg-purple-500/5 border-purple-500/10 space-y-6">
                              <div className="flex items-center gap-2 text-purple-500 font-bold uppercase tracking-widest text-[10px]">
                                <Sparkles className="h-4 w-4" /> 论文命脉
                              </div>
                              <ul className="space-y-4">
                                {PAPER_DATA.aiAnalysis.keyPoints.map((point, i) => (
                                  <li key={i} className="flex gap-4 text-sm font-medium leading-relaxed group">
                                    <div className="h-6 w-6 rounded-full bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0 font-bold text-[10px] group-hover:scale-110 transition-transform">{i+1}</div>
                                    {point}
                                  </li>
                                ))}
                              </ul>
                            </Card>
                          </TabsContent>
                          <TabsContent value="structure">
                            <Card className="p-8 rounded-[2.5rem] bg-emerald-500/5 border-emerald-500/10 space-y-6">
                              <div className="flex items-center gap-2 text-emerald-600 font-bold uppercase tracking-widest text-[10px]">
                                <ListTree className="h-4 w-4" /> 论证架构
                              </div>
                              <div className="space-y-3 relative pl-4 border-l-2 border-emerald-200">
                                {structureNodes.map(node => (
                                  <div key={node.id} className="space-y-1">
                                    <p className="font-bold text-sm text-emerald-800 flex items-center gap-2">
                                      <div className="h-2 w-2 rounded-full bg-emerald-500" /> {node.label}
                                    </p>
                                    <div className="flex flex-wrap gap-1.5 pl-4">
                                      {node.sub.map(s => <span key={s} className="text-[10px] px-2 py-0.5 bg-white/50 rounded-md border border-emerald-200/50 text-emerald-600">{s}</span>)}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </Card>
                          </TabsContent>
                          <TabsContent value="terms">
                            <Card className="p-8 rounded-[2.5rem] bg-blue-500/5 border-blue-500/10 space-y-6">
                              <div className="flex items-center gap-2 text-blue-600 font-bold uppercase tracking-widest text-[10px]">
                                <Languages className="h-4 w-4" /> 学术辞典
                              </div>
                              <div className="grid gap-3">
                                {PAPER_DATA.aiAnalysis.terminology.map((term) => (
                                  <div key={term.word} className="bg-card p-4 rounded-2xl border border-blue-100 shadow-sm hover:scale-[1.02] transition-transform cursor-help">
                                    <p className="font-bold text-blue-700 text-sm">{term.word}</p>
                                    <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed">{term.definition}</p>
                                  </div>
                                ))}
                              </div>
                            </Card>
                          </TabsContent>
                        </Tabs>
                        <div className="bg-slate-900 p-8 rounded-[2.5rem] text-center space-y-4">
                          <p className="text-xs italic text-slate-400 font-medium">“读万卷书，���如 AI 导读。”</p>
                          <Button variant="ghost" className="text-xs text-white hover:text-white/80 hover:bg-white/10 h-10 px-6 rounded-xl font-bold gap-2">
                            <Network className="h-4 w-4" /> 开启全域结构透视
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </aside>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppLayout>
  );
}