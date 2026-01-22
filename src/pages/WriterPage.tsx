import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { PenTool, Sparkles, Wand2, Zap, LayoutTemplate, Settings2 } from 'lucide-react';
import { WRITING_SUGGESTIONS } from '@/lib/mock-academic';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/use-app-store';
export function WriterPage() {
  const [text, setText] = useState('');
  const [spirit, setSpirit] = useState(85);
  const awardRewards = useAppStore(s => s.awardRewards);
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const handleOptimization = () => {
    if (spirit < 20) return;
    setSpirit(prev => prev - 20);
    awardRewards(10, 2);
  };
  return (
    <AppLayout container>
      <header className="mb-10 flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-4xl font-display font-bold text-purple-600 flex items-center gap-3">
            <PenTool className="h-8 w-8" /> 灵感演武场
          </h1>
          <p className="text-muted-foreground font-medium">笔灵��阵，点石成金的���术写作空间</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">笔灵元气</p>
            <div className="flex items-center gap-3 mt-1">
              <Zap className="h-4 w-4 text-amber-500 fill-current" />
              <Progress value={spirit} className="h-2 w-32 bg-amber-500/10" />
              <span className="font-mono font-bold text-sm">{spirit}%</span>
            </div>
          </div>
          <Button className="rounded-2xl h-14 px-8 bg-purple-600 hover:bg-purple-500 font-bold shadow-xl shadow-purple-900/20 gap-2">
            <Sparkles className="h-5 w-5" /> 灵感爆发
          </Button>
        </div>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-6">
          <Card className="rounded-[3rem] border-none shadow-soft p-12 bg-white/50 backdrop-blur-xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 group-focus-within:opacity-100 transition-opacity" />
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="在��挥毫泼墨，开启学术篇章..."
              className="min-h-[600px] border-none focus-visible:ring-0 text-2xl font-medium bg-transparent p-0 placeholder:text-muted-foreground/30 resize-none leading-relaxed"
            />
            <div className="mt-8 pt-8 border-t border-border/50 flex items-center justify-between text-muted-foreground">
              <div className="flex items-center gap-8">
                <span className="text-sm font-bold tracking-widest uppercase">Words: {wordCount}</span>
                <span className="text-sm font-bold tracking-widest uppercase">Characters: {text.length}</span>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="rounded-xl"><LayoutTemplate className="h-5 w-5" /></Button>
                <Button variant="ghost" size="icon" className="rounded-xl"><Settings2 className="h-5 w-5" /></Button>
              </div>
            </div>
          </Card>
        </div>
        <aside className="lg:col-span-4 space-y-6">
          <h2 className="text-xl font-display font-bold px-2">笔灵建议 (AI Optimization)</h2>
          <AnimatePresence>
            {text.length > 50 && WRITING_SUGGESTIONS.map((suggestion, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="p-6 rounded-4xl bg-secondary/30 border-none shadow-sm space-y-4 hover:shadow-md transition-shadow group">
                  <div className="flex items-center justify-between">
                    <div className={cn("px-3 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider", 
                      suggestion.type === 'grammar' ? 'bg-red-500/10 text-red-600' : 'bg-blue-500/10 text-blue-600'
                    )}>
                      {suggestion.type}
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" onClick={handleOptimization}>
                      <Wand2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-muted-foreground line-through decoration-red-500/50 italic">"{suggestion.original}"</p>
                    <p className="text-sm font-bold text-foreground">建议：<span className="text-emerald-600 underline decoration-emerald-500/30 underline-offset-4">{suggestion.refined}</span></p>
                  </div>
                  <p className="text-xs text-muted-foreground italic leading-relaxed">{suggestion.explanation}</p>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
          {text.length <= 50 && (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 opacity-40">
              <PenTool className="h-12 w-12 text-muted-foreground" />
              <p className="text-sm font-medium">开始书写，笔灵将��动分析文法</p>
            </div>
          )}
        </aside>
      </div>
    </AppLayout>
  );
}