import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Copy, Check, Loader2, Brain, X, RotateCcw, PenTool, Languages, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AiAssistantResult, AiTaskType } from '@shared/types';
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
  interpret: { icon: Brain, color: "text-purple-500 bg-purple-500/10", label: "学术解读" },
  modify: { icon: PenTool, color: "text-blue-500 bg-blue-500/10", label: "风格优化" },
  translate: { icon: Languages, color: "text-orange-500 bg-orange-500/10", label: "语境转译" },
  evaluate: { icon: FileText, color: "text-emerald-500 bg-emerald-500/10", label: "监督学习" }
};
export function AiAssistantPanel({ isOpen, onClose, result, isProcessing, onApply, onRetry }: AiAssistantPanelProps) {
  const [copied, setCopied] = React.useState(false);
  const handleCopy = () => {
    if (!result?.content) return;
    navigator.clipboard.writeText(result.content);
    setCopied(true);
    toast.success("已复制到识海");
    setTimeout(() => setCopied(false), 2000);
  };
  if (!isOpen) return null;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: 400, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 400, opacity: 0 }}
        className="fixed top-0 right-0 h-full w-[400px] z-[200] bg-card/80 backdrop-blur-2xl border-l border-border/50 shadow-2xl flex flex-col"
      >
        <header className="p-8 border-b border-border/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold">笔灵助理</h2>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">AI Academic Assistant</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full" onClick={onClose}><X className="h-5 w-5" /></Button>
        </header>
        <ScrollArea className="flex-1 p-8">
          {isProcessing ? (
            <div className="h-full flex flex-col items-center justify-center space-y-6 pt-20">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full animate-pulse" />
                <Loader2 className="h-16 w-16 text-primary animate-spin relative z-10" />
              </div>
              <div className="text-center space-y-2">
                <p className="text-lg font-display font-bold">神识参悟中...</p>
                <p className="text-xs text-muted-foreground italic">“千淘��漉虽辛苦，吹尽狂沙始到金。”</p>
              </div>
            </div>
          ) : result ? (
            <div className="space-y-8 animate-fade-in">
              <div className="flex items-center justify-between">
                <Badge className={cn("rounded-xl px-4 py-1.5 font-bold flex items-center gap-2", taskConfig[result.type].color)}>
                  {React.createElement(taskConfig[result.type].icon, { className: "h-3 w-3" })}
                  {taskConfig[result.type].label}
                </Badge>
                {onRetry && <Button variant="ghost" size="sm" onClick={onRetry} className="text-xs gap-1"><RotateCcw className="h-3 w-3" /> 重构</Button>}
              </div>
              {result.originalText && (
                <div className="space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">原文字句</p>
                  <div className="p-4 bg-secondary/30 rounded-2xl border border-border/50 italic text-sm text-muted-foreground line-clamp-3">
                    {result.originalText}
                  </div>
                </div>
              )}
              <div className="space-y-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary">笔灵结论</p>
                <Card className="p-6 rounded-3xl border-none shadow-soft bg-white/50 text-base leading-relaxed font-medium">
                  {result.content}
                </Card>
              </div>
              {result.metadata?.score && (
                <div className="grid grid-cols-3 gap-4">
                  {Object.entries(result.metadata.score).map(([key, val]) => (
                    <div key={key} className="text-center p-3 bg-primary/5 rounded-2xl border border-primary/10">
                      <p className="text-[8px] font-bold uppercase text-muted-foreground">{key}</p>
                      <p className="text-lg font-display font-bold text-primary">{val}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center opacity-20 pt-20 text-center">
              <Brain className="h-24 w-24 mb-6" />
              <p className="text-lg font-display font-bold">暂无任务指令</p>
              <p className="text-sm">选中文本并点击下方按钮以召唤笔灵</p>
            </div>
          )}
        </ScrollArea>
        <footer className="p-8 border-t border-border/50 bg-secondary/20 flex gap-4">
          <Button variant="outline" className="flex-1 rounded-2xl h-14 font-bold gap-2" onClick={handleCopy}>
            {copied ? <Check className="h-5 w-5 text-emerald-500" /> : <Copy className="h-5 w-5" />}
            复制识海
          </Button>
          {onApply && (
            <Button className="flex-[2] rounded-2xl h-14 font-bold shadow-lg" onClick={() => onApply(result?.content || "")}>
              应用修改
            </Button>
          )}
        </footer>
      </motion.div>
    </AnimatePresence>
  );
}