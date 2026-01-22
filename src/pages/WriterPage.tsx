import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import {
  PenTool, Sparkles, Wand2, Zap, LayoutTemplate,
  Settings2, Languages, SearchCode, Loader2, Bold, Italic, Quote, Link2, List, Brain
} from 'lucide-react';
import { WRITING_SUGGESTIONS } from '@/lib/mock-academic';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/use-app-store';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
export function WriterPage() {
  const [text, setText] = useState('');
  const [spirit, setSpirit] = useState(85);
  const [isProcessing, setIsProcessing] = useState(false);
  const [plagiarismScore, setPlagiarismScore] = useState<number | null>(null);
  const awardRewards = useAppStore(s => s.awardRewards);
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const handleTranslate = () => {
    if (spirit < 30) {
      toast.error("精神力不足，请稍作休息");
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setSpirit(prev => Math.max(0, prev - 30));
      awardRewards(50, 10);
      toast.success("神识转译成功", { description: "已将口语化表达优化为标准学术辞令" });
    }, 2000);
  };
  const handlePlagiarismCheck = () => {
    if (text.length < 100) {
      toast.error("文墨不足，难以查重");
      return;
    }
    setPlagiarismScore(null);
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const score = 95 + Math.random() * 4;
      setPlagiarismScore(score);
      toast.info("查重完毕", { description: `原创度：${score.toFixed(1)}%。笔触清奇，并无雷同。` });
    }, 1500);
  };
  return (
    <AppLayout container>
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center md:text-left">
            <h1 className="text-5xl font-display font-bold text-purple-600 flex items-center justify-center md:justify-start gap-4">
              <PenTool className="h-10 w-10" /> 灵感演武场
            </h1>
            <p className="text-muted-foreground text-lg font-medium">笔灵助阵，点石成金的学术写作空间</p>
          </div>
          <div className="flex items-center gap-8">
            <div className="text-right hidden sm:block space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">笔灵元气 (Spirit Power)</p>
              <div className="flex items-center gap-4">
                <Zap className="h-5 w-5 text-amber-500 fill-current" />
                <Progress value={spirit} className="h-3 w-40 bg-amber-500/10" />
                <span className="font-mono font-bold text-base text-amber-600">{spirit}%</span>
              </div>
            </div>
            <Button className="rounded-[1.5rem] h-16 px-10 bg-purple-600 hover:bg-purple-50 font-bold shadow-2xl shadow-purple-900/20 gap-3 text-lg">
              <Sparkles className="h-6 w-6" /> 灵感爆发
            </Button>
          </div>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-8">
            <Card className="rounded-[3.5rem] border-none shadow-soft p-12 bg-white/40 backdrop-blur-2xl relative overflow-hidden group min-h-[850px] flex flex-col">
              <div className="flex items-center justify-between mb-10 pb-6 border-b border-border/50">
                <div className="flex items-center gap-1.5 p-1 bg-secondary/50 rounded-2xl border border-border/50">
                  <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-background"><Bold className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-background"><Italic className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-background"><Quote className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-background"><Link2 className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-background"><List className="h-4 w-4" /></Button>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    className="rounded-2xl font-bold h-12 gap-2 border-purple-200 text-purple-600 hover:bg-purple-50 px-6"
                    onClick={handleTranslate}
                    disabled={isProcessing}
                  >
                    {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Languages className="h-4 w-4" />}
                    神识转译
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-2xl font-bold h-12 gap-2 border-blue-200 text-blue-600 hover:bg-blue-50 px-6"
                    onClick={handlePlagiarismCheck}
                    disabled={isProcessing}
                  >
                    <SearchCode className="h-4 w-4" />
                    查重
                  </Button>
                </div>
              </div>
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="在此挥毫泼墨，开启学术篇��..."
                className="flex-1 border-none focus-visible:ring-0 text-2xl font-medium bg-transparent p-0 placeholder:text-muted-foreground/20 resize-none leading-relaxed"
              />
              <div className="mt-10 pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-10">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Words</p>
                    <p className="font-display font-bold text-xl">{wordCount}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Characters</p>
                    <p className="font-display font-bold text-xl">{text.length}</p>
                  </div>
                  {plagiarismScore !== null && (
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Originality</p>
                      <p className="font-display font-bold text-xl text-emerald-600">{plagiarismScore.toFixed(1)}%</p>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl hover:bg-secondary"><LayoutTemplate className="h-6 w-6" /></Button>
                  <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl hover:bg-secondary"><Settings2 className="h-6 w-6" /></Button>
                  <Button className="rounded-2xl h-12 px-8 font-bold bg-slate-900">完成定稿</Button>
                </div>
              </div>
            </Card>
          </div>
          <aside className="lg:col-span-4 space-y-8">
            <h2 className="text-2xl font-display font-bold px-4 flex items-center gap-3">
              <Brain className="h-6 w-6 text-purple-500" /> 笔灵建议 (AI)
            </h2>
            <AnimatePresence mode="popLayout">
              {text.length > 50 ? WRITING_SUGGESTIONS.map((suggestion, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="p-8 rounded-[2.5rem] bg-card/40 backdrop-blur-xl border-none shadow-soft space-y-6 hover:shadow-xl transition-all group relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full bg-purple-500/10 text-purple-600">
                        <Wand2 className="h-5 w-5" />
                      </Button>
                    </div>
                    <div className={cn("px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest w-fit",
                      suggestion.type === 'grammar' ? 'bg-red-500/10 text-red-600' : 'bg-blue-500/10 text-blue-600'
                    )}>
                      {suggestion.type}
                    </div>
                    <div className="space-y-4">
                      <p className="text-sm font-bold text-muted-foreground line-through decoration-red-500/30 italic">"{suggestion.original}"</p>
                      <div className="p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
                        <p className="text-base font-bold text-foreground">建议：<span className="text-emerald-600 underline decoration-emerald-500/30 underline-offset-8">{suggestion.refined}</span></p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground italic leading-relaxed font-medium">{suggestion.explanation}</p>
                  </Card>
                </motion.div>
              )) : (
                <div className="flex flex-col items-center justify-center py-32 text-center space-y-6 opacity-30">
                  <div className="h-24 w-24 rounded-full border-4 border-dashed border-muted-foreground flex items-center justify-center">
                    <PenTool className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <p className="text-lg font-display font-bold">挥毫书写，笔灵方显</p>
                </div>
              )}
            </AnimatePresence>
          </aside>
        </div>
      </div>
    </AppLayout>
  );
}