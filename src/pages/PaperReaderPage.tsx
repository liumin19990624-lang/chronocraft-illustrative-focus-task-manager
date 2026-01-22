import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { FileText, Brain, Sparkles, Languages, Bookmark, Share2, ArrowLeft, Search as SearchIcon, ListTree } from 'lucide-react';
import { PAPER_DATA } from '@/lib/mock-academic';
import { PaperSearch } from '@/components/papers/PaperSearch';
import { AiAssistantPanel } from '@/components/ai/AiAssistantPanel';
import { AcademicPaper, AiAssistantResult } from '@shared/types';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/use-app-store';
export function PaperReaderPage() {
  const [viewMode, setViewMode] = useState<'search' | 'read'>('search');
  const [activeSection, setActiveSection] = useState('abstract');
  const [currentPaper, setCurrentPaper] = useState<AcademicPaper | null>(null);
  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const [aiResult, setAiResult] = useState<AiAssistantResult | null>(null);
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const requestAi = useAppStore(s => s.requestAiAssistant);
  const handleSelectPaper = (paper: AcademicPaper) => {
    setCurrentPaper(paper);
    setViewMode('read');
  };
  const handleAiAction = async (text: string, type: 'interpret' | 'translate') => {
    setAiPanelOpen(true);
    setIsAiProcessing(true);
    const result = await requestAi(text, type);
    setAiResult(result);
    setIsAiProcessing(false);
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12">
      <AnimatePresence mode="wait">
        {viewMode === 'search' ? (
          <motion.div key="search-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <header className="text-center space-y-4 mb-12">
              <div className="mx-auto h-20 w-20 rounded-3xl bg-primary text-primary-foreground flex items-center justify-center shadow-2xl rotate-[-4deg]">
                <SearchIcon className="h-10 w-10" />
              </div>
              <h1 className="text-5xl font-display font-bold tracking-tight">藏经阁���索</h1>
              <p className="text-muted-foreground text-lg italic">探索全球学术法诀</p>
            </header>
            <PaperSearch onSelectPaper={handleSelectPaper} />
          </motion.div>
        ) : (
          <motion.div key="read-view" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <header className="mb-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="space-y-3">
                <Button variant="ghost" className="mb-4 rounded-xl font-bold gap-2 pl-0" onClick={() => setViewMode('search')}>
                  <ArrowLeft className="h-4 w-4" /> 返回检索
                </Button>
                <h1 className="text-4xl font-display font-bold leading-tight max-w-4xl">{currentPaper?.title || PAPER_DATA.title}</h1>
              </div>
              <div className="flex items-center gap-3 md:pt-14">
                <Button variant="outline" size="icon" className="rounded-2xl h-12 w-12"><Bookmark className="h-5 w-5" /></Button>
                <Button className="rounded-2xl font-bold h-12 px-8 bg-emerald-600 shadow-lg shadow-emerald-900/20">导出全部摘录</Button>
              </div>
            </header>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <Card className="lg:col-span-8 p-12 rounded-[3.5rem] border-none shadow-soft min-h-[800px] bg-card/60 backdrop-blur-xl relative">
                <Tabs value={activeSection} onValueChange={setActiveSection}>
                  <TabsList className="bg-secondary/50 rounded-2xl mb-10 h-14">
                    <TabsTrigger value="abstract" className="rounded-xl px-8 font-bold h-full">摘要</TabsTrigger>
                    <TabsTrigger value="intro" className="rounded-xl px-8 font-bold h-full">引言</TabsTrigger>
                  </TabsList>
                  <TabsContent value="abstract">
                    <div className="group relative prose prose-slate dark:prose-invert max-w-none">
                      <p className="text-2xl font-display italic leading-relaxed text-foreground/90">
                        {currentPaper?.abstract || PAPER_DATA.abstract}
                      </p>
                      <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                        <Button size="sm" variant="secondary" className="rounded-lg gap-1" onClick={() => handleAiAction(currentPaper?.abstract || PAPER_DATA.abstract, 'interpret')}>
                          <Brain className="h-3 w-3" /> 解读
                        </Button>
                        <Button size="sm" variant="secondary" className="rounded-lg gap-1" onClick={() => handleAiAction(currentPaper?.abstract || PAPER_DATA.abstract, 'translate')}>
                          <Languages className="h-3 w-3" /> 翻译
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="intro">
                    <div className="space-y-8">
                      {PAPER_DATA.introduction.map((para, i) => (
                        <div key={i} className="group relative p-4 rounded-2xl hover:bg-primary/5 transition-all">
                          <p className="text-lg leading-relaxed">{para}</p>
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                            <Button size="sm" variant="secondary" className="rounded-lg h-8" onClick={() => handleAiAction(para, 'interpret')}>解读</Button>
                            <Button size="sm" variant="secondary" className="rounded-lg h-8" onClick={() => handleAiAction(para, 'translate')}>翻译</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </Card>
              <aside className="lg:col-span-4 space-y-8">
                 <Card className="p-8 rounded-[2.5rem] bg-card/40 backdrop-blur-xl border-none shadow-soft space-y-6">
                  <h2 className="text-xl font-display font-bold flex items-center gap-3">
                    <ListTree className="h-5 w-5 text-emerald-500" /> 结构概览
                  </h2>
                  <div className="space-y-3 pl-4 border-l-2 border-primary/10">
                    {['Abstract', 'Introduction', 'Methodology', 'Experiments'].map(s => (
                      <div 
                        key={s} 
                        onClick={() => setActiveSection(s === 'Abstract' ? 'abstract' : 'intro')}
                        className={cn("text-sm font-bold cursor-pointer transition-colors", 
                        (activeSection === s.toLowerCase() || (s === 'Introduction' && activeSection === 'intro')) ? "text-primary" : "text-muted-foreground")}
                      >
                        {s}
                      </div>
                    ))}
                  </div>
                </Card>
              </aside>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AiAssistantPanel
        isOpen={aiPanelOpen}
        onClose={() => setAiPanelOpen(false)}
        result={aiResult}
        isProcessing={isAiProcessing}
      />
    </div>
  );
}