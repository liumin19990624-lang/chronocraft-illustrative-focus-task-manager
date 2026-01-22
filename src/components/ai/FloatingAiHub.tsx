import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Brain, PenTool, FileText, Languages, X, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/use-app-store';
import { cn } from '@/lib/utils';
import { AiAssistantPanel } from './AiAssistantPanel';
import { AiAssistantResult } from '@shared/types';
export function FloatingAiHub() {
  const [isOpen, setIsOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [aiResult, setAiResult] = useState<AiAssistantResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const requestAi = useAppStore(s => s.requestAiAssistant);
  const spiritHealth = useAppStore(s => s.timer.spiritHealth);
  const handleAction = async (type: 'interpret' | 'modify' | 'evaluate') => {
    setIsOpen(false);
    setPanelOpen(true);
    setIsProcessing(true);
    const res = await requestAi("当前页面学术概览", type, 'mentor');
    setAiResult(res);
    setIsProcessing(false);
  };
  return (
    <>
      <div className="fixed bottom-24 right-8 z-[150] md:bottom-8">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ scale: 0, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0, opacity: 0, y: 20 }}
              className="absolute bottom-20 right-0 w-64 p-4 rounded-3xl bg-card border shadow-2xl space-y-2"
            >
              <div className="flex items-center gap-2 mb-4 px-2">
                <Zap className="h-4 w-4 text-amber-500" />
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">笔灵元气: {Math.floor(spiritHealth)}%</span>
              </div>
              <Button variant="ghost" className="w-full justify-start gap-3 rounded-xl h-12 font-bold" onClick={() => handleAction('interpret')}>
                <Brain className="h-5 w-5 text-purple-500" /> 总结当前页
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-3 rounded-xl h-12 font-bold" onClick={() => handleAction('modify')}>
                <PenTool className="h-5 w-5 text-blue-500" /> 快速润色
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-3 rounded-xl h-12 font-bold" onClick={() => handleAction('evaluate')}>
                <FileText className="h-5 w-5 text-emerald-500" /> 逻辑检测
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
        <Button
          size="icon"
          className={cn(
            "h-16 w-16 rounded-full shadow-2xl transition-all duration-300",
            isOpen ? "bg-destructive hover:bg-destructive/90" : "bg-primary hover:scale-110"
          )}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-8 w-8" /> : <Sparkles className="h-8 w-8 animate-pulse" />}
        </Button>
      </div>
      <AiAssistantPanel
        isOpen={panelOpen}
        onClose={() => setPanelOpen(false)}
        result={aiResult}
        isProcessing={isProcessing}
      />
    </>
  );
}