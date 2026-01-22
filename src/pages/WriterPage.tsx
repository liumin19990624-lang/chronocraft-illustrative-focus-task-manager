import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { PenTool, Sparkles, Zap, Languages, Brain, FileText, Target, Trophy } from 'lucide-react';
import { AiAssistantPanel } from '@/components/ai/AiAssistantPanel';
import { useAppStore } from '@/store/use-app-store';
import { AiAssistantResult } from '@shared/types';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
export function WriterPage() {
  const [text, setText] = useState('');
  const spiritHealth = useAppStore(s => s.timer.spiritHealth);
  const drainSpirit = useAppStore(s => s.drainSpirit);
  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const [aiResult, setAiResult] = useState<AiAssistantResult | null>(null);
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const requestAi = useAppStore(s => s.requestAiAssistant);
  const handleAiAction = async (type: 'modify' | 'evaluate') => {
    if (!text.trim()) return toast.warning("请先挥毫泼墨");
    if (spiritHealth < 10) return toast.error("笔灵元气���足，请开启番茄钟潜修回复。");
    setAiPanelOpen(true);
    setIsAiProcessing(true);
    const result = await requestAi(text, type, 'reviewer');
    setAiResult(result);
    setIsAiProcessing(false);
    drainSpirit(15);
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12">
      <header className="mb-12 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-2">
          <h1 className="text-5xl font-display font-bold text-purple-600 flex items-center gap-4">
            <PenTool className="h-10 w-10" /> 灵感演武��
          </h1>
          <p className="text-muted-foreground text-lg">“笔灵助阵，共筑不世学术之章。”</p>
        </div>
        <div className="flex items-center gap-8 bg-secondary/20 p-4 rounded-3xl border border-border/50 backdrop-blur-sm">
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">笔灵元气 (Immersion)</p>
            <div className="flex items-center gap-4 mt-1">
              <Zap className={cn("h-5 w-5", spiritHealth < 20 ? "text-red-500 animate-pulse" : "text-amber-500")} />
              <Progress value={spiritHealth} className="h-2.5 w-40" />
            </div>
          </div>
          <Button onClick={() => handleAiAction('modify')} className="rounded-2xl h-14 px-8 bg-purple-600 shadow-xl gap-3 text-lg font-bold hover:scale-105 transition-all">
            <Sparkles className="h-6 w-6" /> 灵感改写
          </Button>
        </div>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <Card className="lg:col-span-8 p-12 rounded-[3.5rem] border-none shadow-soft bg-card/40 backdrop-blur-2xl flex flex-col min-h-[700px] relative group">
          <div className="flex items-center gap-3 mb-8 border-b border-border/50 pb-6 overflow-x-auto no-scrollbar">
             <Button variant="outline" className="rounded-2xl font-bold gap-2 whitespace-nowrap" onClick={() => handleAiAction('modify')}>
              <Languages className="h-4 w-4" /> 学术润色 (3版本)
            </Button>
            <Button variant="outline" className="rounded-2xl font-bold gap-2 whitespace-nowrap" onClick={() => handleAiAction('evaluate')}>
              <FileText className="h-4 w-4" /> 深度批改 (雷达图)
            </Button>
            <Button variant="outline" className="rounded-2xl font-bold gap-2 whitespace-nowrap">
              <Target className="h-4 w-4" /> 检查重复率
            </Button>
          </div>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="在此开始你的学术创作，或粘贴草稿以供笔灵解读..."
            className="flex-1 border-none focus-visible:ring-0 text-xl font-medium bg-transparent p-0 resize-none leading-relaxed placeholder:text-muted-foreground/30"
          />
          <div className="absolute bottom-10 right-10 flex items-center gap-2 opacity-30 group-hover:opacity-100 transition-opacity">
            <span className="text-xs font-mono font-bold">{text.length} ��</span>
            <span className="text-xs font-mono font-bold">|</span>
            <span className="text-xs font-mono font-bold">~{Math.ceil(text.length / 5)} 词</span>
          </div>
        </Card>
        <aside className="lg:col-span-4 space-y-8">
          <Card className="p-8 rounded-[3rem] bg-card/60 backdrop-blur-xl border-none shadow-soft overflow-hidden">
            <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-3">
              <Brain className="h-6 w-6 text-purple-500" /> 宗门批注
            </h2>
            <div className="space-y-6">
              {!aiResult ? (
                <div className="flex flex-col items-center justify-center py-24 opacity-20 text-center space-y-4">
                  <div className="p-6 rounded-full bg-secondary">
                    <PenTool className="h-12 w-12" />
                  </div>
                  <p className="text-base font-bold">请挥毫书写，笔灵���可入世</p>
                </div>
              ) : (
                <div className="space-y-6 animate-slide-up">
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                    <p className="text-xs font-bold uppercase tracking-widest text-emerald-600 mb-1">修行得分</p>
                    <div className="flex items-end gap-2">
                      <span className="text-4xl font-display font-bold text-emerald-600">{aiResult.metadata?.score?.logic}</span>
                      <span className="text-xs text-emerald-600/60 font-bold pb-1">/ 100</span>
                    </div>
                  </div>
                  {aiResult.metadata?.suggestions?.map((s, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-secondary/50 border border-border/50 text-sm font-medium leading-relaxed">
                      {s}
                    </div>
                  ))}
                  <Button className="w-full rounded-2xl h-12 font-bold" variant="secondary" onClick={() => setAiPanelOpen(true)}>
                    <Trophy className="h-4 w-4 mr-2" /> 详���报告
                  </Button>
                </div>
              )}
            </div>
          </Card>
          <Card className="p-8 rounded-[3rem] bg-slate-900 text-white shadow-2xl">
            <h3 className="font-display font-bold text-xl mb-4">创作法��</h3>
            <p className="text-sm text-slate-400 italic leading-relaxed">
              “��学术创作，须言之有物，论之有据。���忌辞藻堆砌，宜以逻辑为骨，以创新为神。”
            </p>
          </Card>
        </aside>
      </div>
      <AiAssistantPanel
        isOpen={aiPanelOpen}
        onClose={() => setAiPanelOpen(false)}
        result={aiResult}
        isProcessing={isAiProcessing}
        onApply={(content) => { setText(content); setAiPanelOpen(false); }}
      />
    </div>
  );
}