import React, { useState, useCallback, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { FileText, Brain, Sparkles, Languages, Bookmark, ArrowLeft, Search as SearchIcon, ListTree, MousePointer2 } from 'lucide-react';
import { PAPER_DATA } from '@/lib/mock-academic';
import { PaperSearch } from '@/components/papers/PaperSearch';
import { AiAssistantPanel } from '@/components/ai/AiAssistantPanel';
import { AcademicPaper, AiAssistantResult, AiTaskType } from '@shared/types';
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
  const [bubblePos, setBubblePos] = useState<{ x: number, y: number } | null>(null);
  const [selection, setSelection] = useState('');
  const requestAi = useAppStore(s => s.requestAiAssistant);
  const readerRef = useRef<HTMLDivElement>(null);
  const handleSelectPaper = (paper: AcademicPaper) => {
    setCurrentPaper(paper);
    setViewMode('read');
  };
  const handleAiAction = async (text: string, type: AiTaskType) => {
    setAiPanelOpen(true);
    setIsAiProcessing(true);
    setBubblePos(null);
    const result = await requestAi(text, type, 'mentor');
    setAiResult(result);
    setIsAiProcessing(false);
  };
  const onTextSelection = useCallback(() => {
    const sel = window.getSelection();
    if (sel && sel.toString().trim().length > 5) {
      const range = sel.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setSelection(sel.toString().trim());
      setBubblePos({
        x: rect.left + rect.width / 2,
        y: rect.top - 10
      });
    } else {
      setBubblePos(null);
    }
  }, []);
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12" onMouseUp={onTextSelection}>
      <AnimatePresence mode="wait">
        {viewMode === 'search' ? (
          <motion.div key="search-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <header className="text-center space-y-4 mb-12">
              <div className="mx-auto h-20 w-20 rounded-3xl bg-primary text-primary-foreground flex items-center justify-center shadow-2xl rotate-[-4deg]">
                <SearchIcon className="h-10 w-10" />
              </div>
              <h1 className="text-5xl font-display font-bold tracking-tight">藏经阁检索</h1>
              <p className="text-muted-foreground text-lg italic">“博观而约取，厚积而���发。”</p>
            </header>
            <PaperSearch onSelectPaper={handleSelectPaper} />
          </motion.div>
        ) : (
          <motion.div key="read-view" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <header className="mb-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="space-y-3">
                <Button variant="ghost" className="mb-4 rounded-xl font-bold gap-2 pl-0 hover:bg-transparent" onClick={() => setViewMode('search')}>
                  <ArrowLeft className="h-4 w-4" /> 返回藏经阁
                </Button>
                <h1 className="text-4xl font-display font-bold leading-tight max-w-4xl">{currentPaper?.title || PAPER_DATA.title}</h1>
                <p className="text-muted-foreground font-medium">{currentPaper?.authors || PAPER_DATA.authors} • {currentPaper?.year || 2024}</p>
              </div>
              <div className="flex items-center gap-3 md:pt-14">
                <Button variant="outline" size="icon" className="rounded-2xl h-12 w-12 border-primary/20"><Bookmark className="h-5 w-5" /></Button>
                <Button className="rounded-2xl font-bold h-12 px-8 bg-emerald-600 shadow-xl shadow-emerald-900/10">离线参悟</Button>
              </div>
            </header>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <Card ref={readerRef} className="lg:col-span-8 p-12 rounded-[3.5rem] border-none shadow-soft min-h-[800px] bg-card/40 backdrop-blur-xl relative select-text">
                <Tabs value={activeSection} onValueChange={setActiveSection}>
                  <TabsList className="bg-secondary/50 rounded-2xl mb-10 h-14 p-1">
                    <TabsTrigger value="abstract" className="rounded-xl px-8 font-bold h-full">摘要 (Abstract)</TabsTrigger>
                    <TabsTrigger value="intro" className="rounded-xl px-8 font-bold h-full">引言 (Introduction)</TabsTrigger>
                  </TabsList>
                  <TabsContent value="abstract" className="mt-0">
                    <div className="prose prose-slate dark:prose-invert max-w-none">
                      <p className="text-2xl font-display italic leading-relaxed text-foreground/80 first-letter:text-5xl first-letter:font-bold first-letter:mr-1">
                        {currentPaper?.abstract || PAPER_DATA.abstract}
                      </p>
                    </div>
                  </TabsContent>
                  <TabsContent value="intro" className="mt-0">
                    <div className="space-y-10">
                      {PAPER_DATA.introduction.map((para, i) => (
                        <div key={i} className="group relative p-6 rounded-3xl hover:bg-primary/5 transition-all">
                          <p className="text-lg leading-relaxed text-foreground/90">{para}</p>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </Card>
              <aside className="lg:col-span-4 space-y-8">
                 <Card className="p-8 rounded-[3rem] bg-card/60 backdrop-blur-xl border-none shadow-soft space-y-6">
                  <h2 className="text-xl font-display font-bold flex items-center gap-3">
                    <ListTree className="h-5 w-5 text-emerald-500" /> 法诀结构
                  </h2>
                  <div className="space-y-4 pl-4 border-l-2 border-primary/10">
                    {['Abstract', 'Introduction', 'Methodology', 'Results', 'Conclusion'].map(s => (
                      <div
                        key={s}
                        onClick={() => setActiveSection(s === 'Abstract' ? 'abstract' : 'intro')}
                        className={cn("text-sm font-bold cursor-pointer transition-colors hover:text-primary",
                        (activeSection === s.toLowerCase() || (s === 'Introduction' && activeSection === 'intro')) ? "text-primary translate-x-1" : "text-muted-foreground")}
                      >
                        {s}
                      </div>
                    ))}
                  </div>
                </Card>
                <Card className="p-8 rounded-[3rem] bg-slate-900 text-white space-y-6 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16" />
                  <div className="flex items-center gap-3">
                    <Brain className="h-6 w-6 text-purple-400" />
                    <h2 className="text-xl font-display font-bold">笔灵洞察</h2>
                  </div>
                  <div className="space-y-4 relative z-10">
                    {PAPER_DATA.aiAnalysis.keyPoints.map((pt, i) => (
                      <div key={i} className="flex gap-3 text-sm font-medium text-slate-300">
                        <Sparkles className="h-4 w-4 text-purple-400 shrink-0 mt-1" />
                        {pt}
                      </div>
                    ))}
                  </div>
                </Card>
              </aside>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {bubblePos && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            style={{ left: bubblePos.x, top: bubblePos.y }}
            className="fixed z-[250] -translate-x-1/2 -translate-y-full mb-4 flex items-center gap-1 bg-slate-900/95 backdrop-blur-md p-1.5 rounded-2xl shadow-2xl border border-white/10"
          >
            <Button size="sm" variant="ghost" className="h-9 px-3 rounded-xl text-white hover:bg-white/10 text-xs font-bold gap-2" onClick={() => handleAiAction(selection, 'interpret')}>
              <Brain className="h-3.5 w-3.5 text-purple-400" /> 通俗解释
            </Button>
            <div className="w-[1px] h-4 bg-white/10" />
            <Button size="sm" variant="ghost" className="h-9 px-3 rounded-xl text-white hover:bg-white/10 text-xs font-bold gap-2" onClick={() => handleAiAction(selection, 'translate')}>
              <Languages className="h-3.5 w-3.5 text-orange-400" /> 翻���
            </Button>
            <div className="w-[1px] h-4 bg-white/10" />
            <Button size="sm" variant="ghost" className="h-9 px-3 rounded-xl text-white hover:bg-white/10 text-xs font-bold" onClick={() => handleAiAction(selection, 'evaluate')}>
              <MousePointer2 className="h-3.5 w-3.5 text-emerald-400" /> 逻辑检测
            </Button>
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