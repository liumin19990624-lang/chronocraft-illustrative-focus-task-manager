import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Copy, Check, Loader2, Brain, X, RotateCcw, PenTool, Languages, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { AiAssistantResult, AiTaskType } from '@shared/types';
import { useAppStore } from '@/store/use-app-store';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
interface AiAssistantPanelProps {
  isOpen: boolean;
  onClose: () => void;
  result: AiAssistantResult | null;
  isProcessing: boolean;
  onApply?: (content: string) => void;
  onRetry?: () => void;
}
const taskConfig: Record<AiTaskType, { icon: any, color: string, label: string }> = {
  interpret: { icon: Brain, color: "text-purple-500 bg-purple-500/10", label: "学术解��" },
  modify: { icon: PenTool, color: "text-blue-500 bg-blue-500/10", label: "风格优化" },
  translate: { icon: Languages, color: "text-orange-500 bg-orange-500/10", label: "语境转译" },
  evaluate: { icon: FileText, color: "text-emerald-500 bg-emerald-500/10", label: "监督学习" }
};
export function AiAssistantPanel({ isOpen, onClose, result, isProcessing, onApply, onRetry }: AiAssistantPanelProps) {
  const [copied, setCopied] = useState(false);
  const [activeVersion, setActiveVersion] = useState("0");
  const isStreaming = useAppStore(s => s.isStreaming);
  const streamingContent = useAppStore(s => s.streamingContent);
  const handleCopy = () => {
    const contentToCopy = result?.versions ? result.versions[parseInt(activeVersion)] : (result?.content || streamingContent);
    if (!contentToCopy) return;
    navigator.clipboard.writeText(contentToCopy);
    setCopied(true);
    toast.success("已复制到识海");
    setTimeout(() => setCopied(false), 2000);
  };
  const radarData = useMemo(() => {
    if (!result?.metadata?.score) return [];
    const score = result.metadata.score;
    return [
      { subject: 'Grammar', A: score.grammar },
      { subject: 'Logic', A: score.logic },
      { subject: 'Originality', A: score.originality },
      { subject: 'Innovation', A: score.innovation || 80 },
    ];
  }, [result]);
  if (!isOpen) return null;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: 400, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 400, opacity: 0 }}
        className="fixed top-0 right-0 h-full w-[400px] z-[200] bg-card/90 backdrop-blur-2xl border-l border-border/50 shadow-2xl flex flex-col"
      >
        <header className="p-8 border-b border-border/50 flex items-center justify-between bg-secondary/10">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold">笔灵助理</h2>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">AI Academic Assistant</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-destructive/10 hover:text-destructive" onClick={onClose}><X className="h-5 w-5" /></Button>
        </header>
        <ScrollArea className="flex-1 p-8">
          {(isProcessing || isStreaming) ? (
            <div className="space-y-8 animate-fade-in">
              <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-primary animate-pulse" />
                <p className="text-base leading-relaxed font-medium whitespace-pre-wrap min-h-[100px]">
                  {streamingContent}
                  <span className="inline-block w-2 h-5 ml-1 bg-primary animate-pulse" />
                </p>
              </div>
              <div className="flex flex-col items-center justify-center gap-4 py-10 opacity-40">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-sm font-display italic">神识��鸣中...</p>
              </div>
            </div>
          ) : result ? (
            <div className="space-y-8 animate-fade-in">
              <div className="flex items-center justify-between">
                <Badge className={cn("rounded-xl px-4 py-1.5 font-bold flex items-center gap-2", taskConfig[result.type].color)}>
                  {React.createElement(taskConfig[result.type].icon, { className: "h-3 w-3" })}
                  {taskConfig[result.type].label}
                </Badge>
                {onRetry && <Button variant="ghost" size="sm" onClick={onRetry} className="text-xs gap-1 h-8 rounded-lg"><RotateCcw className="h-3 w-3" /> 重构</Button>}
              </div>
              {result.versions && result.versions.length > 0 ? (
                <Tabs value={activeVersion} onValueChange={setActiveVersion} className="w-full">
                  <TabsList className="grid grid-cols-3 bg-secondary/50 rounded-xl h-10 p-1 mb-6">
                    <TabsTrigger value="0" className="rounded-lg text-xs font-bold">方案一</TabsTrigger>
                    <TabsTrigger value="1" className="rounded-lg text-xs font-bold">方案二</TabsTrigger>
                    <TabsTrigger value="2" className="rounded-lg text-xs font-bold">方案三</TabsTrigger>
                  </TabsList>
                  {result.versions.map((v, i) => (
                    <TabsContent key={i} value={String(i)} className="mt-0">
                      <Card className="p-6 rounded-3xl border-none shadow-soft bg-white/60 dark:bg-slate-900/40 text-base leading-relaxed font-medium min-h-[150px]">
                        {v}
                      </Card>
                    </TabsContent>
                  ))}
                </Tabs>
              ) : (
                <Card className="p-6 rounded-3xl border-none shadow-soft bg-white/60 dark:bg-slate-900/40 text-base leading-relaxed font-medium">
                  {result.content}
                </Card>
              )}
              {result.metadata?.score && (
                <div className="space-y-6">
                  <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                        <PolarGrid stroke="hsl(var(--muted-foreground)/0.2)" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 700 }} />
                        <Radar
                          name="Scholar"
                          dataKey="A"
                          stroke="hsl(var(--primary))"
                          fill="hsl(var(--primary))"
                          fillOpacity={0.4}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {result.metadata.suggestions?.map((s, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs font-medium text-muted-foreground p-3 rounded-xl bg-secondary/30">
                        <Check className="h-3 w-3 text-emerald-500 mt-0.5 shrink-0" />
                        {s}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center opacity-20 pt-20 text-center">
              <Brain className="h-24 w-24 mb-6" />
              <p className="text-lg font-display font-bold">暂无神识指��</p>
              <p className="text-sm">选中段落以���唤笔灵解读</p>
            </div>
          )}
        </ScrollArea>
        <footer className="p-8 border-t border-border/50 bg-secondary/20 flex gap-4">
          <Button variant="outline" className="flex-1 rounded-2xl h-14 font-bold gap-2" onClick={handleCopy}>
            {copied ? <Check className="h-5 w-5 text-emerald-500" /> : <Copy className="h-5 w-5" />}
            复制识海
          </Button>
          {onApply && (
            <Button className="flex-[2] rounded-2xl h-14 font-bold shadow-lg" onClick={() => onApply(result?.versions ? result.versions[parseInt(activeVersion)] : result?.content || "")}>
              应用建议
            </Button>
          )}
        </footer>
      </motion.div>
    </AnimatePresence>
  );
}