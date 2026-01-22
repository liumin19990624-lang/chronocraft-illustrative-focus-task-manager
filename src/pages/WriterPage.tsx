import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { PenTool, Sparkles, Zap, Languages, Brain, FileText } from 'lucide-react';
import { AiAssistantPanel } from '@/components/ai/AiAssistantPanel';
import { useAppStore } from '@/store/use-app-store';
import { AiAssistantResult } from '@shared/types';
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
    setAiPanelOpen(true);
    setIsAiProcessing(true);
    const result = await requestAi(text, type);
    setAiResult(result);
    setIsAiProcessing(false);
    drainSpirit(20);
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12">
      <header className="mb-12 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-2">
          <h1 className="text-5xl font-display font-bold text-purple-600 flex items-center gap-4">
            <PenTool className="h-10 w-10" /> 灵感演武场
          </h1>
          <p className="text-muted-foreground text-lg">��灵助阵的学术写作空间</p>
        </div>
        <div className="flex items-center gap-8">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">笔灵元气</p>
            <div className="flex items-center gap-4 mt-1">
              <Zap className="h-5 w-5 text-amber-500 fill-current" />
              <Progress value={spiritHealth} className="h-3 w-40 bg-amber-500/10" />
            </div>
          </div>
          <Button onClick={() => handleAiAction('modify')} className="rounded-3xl h-16 px-10 bg-purple-600 shadow-2xl gap-3 text-lg font-bold">
            <Sparkles className="h-6 w-6" /> 灵感爆发
          </Button>
        </div>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <Card className="lg:col-span-8 p-12 rounded-[3.5rem] border-none shadow-soft bg-white/40 backdrop-blur-2xl flex flex-col min-h-[700px]">
          <div className="flex items-center gap-3 mb-8 border-b border-border/50 pb-6">
             <Button variant="outline" className="rounded-2xl font-bold gap-2" onClick={() => handleAiAction('modify')}>
              <Languages className="h-4 w-4" /> 风格优化
            </Button>
            <Button variant="outline" className="rounded-2xl font-bold gap-2" onClick={() => handleAiAction('evaluate')}>
              <FileText className="h-4 w-4" /> 监督学习
            </Button>
          </div>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="在此开始��的学术创作..."
            className="flex-1 border-none focus-visible:ring-0 text-2xl font-medium bg-transparent p-0 resize-none leading-relaxed"
          />
        </Card>
        <aside className="lg:col-span-4 space-y-8">
          <Card className="p-8 rounded-[2.5rem] bg-card/60 backdrop-blur-xl border-none shadow-soft">
            <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-3">
              <Brain className="h-6 w-6 text-purple-500" /> 笔灵建议
            </h2>
            <div className="flex flex-col items-center justify-center py-20 opacity-30 text-center">
              <PenTool className="h-12 w-12 mb-4" />
              <p className="text-lg font-bold">挥毫书写，笔灵��显</p>
            </div>
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