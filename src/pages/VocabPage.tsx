import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { VOCAB_DATA } from '@/lib/mock-academic';
import { useSwipeable } from 'react-swipeable';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, XCircle, Volume2, Sparkles, RefreshCcw, Brain, History } from 'lucide-react';
import { triggerTaskCompletionConfetti } from '@/components/ui/confetti';
import { playSound } from '@/lib/audio';
import { useAppStore } from '@/store/use-app-store';
export function VocabPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const awardRewards = useAppStore(s => s.awardRewards);
  const currentWord = VOCAB_DATA[currentIndex];
  const progress = ((currentIndex) / VOCAB_DATA.length) * 100;
  const handleSwipe = (direction: 'left' | 'right') => {
    if (direction === 'right') {
      triggerTaskCompletionConfetti(window.innerWidth / 2, window.innerHeight / 2);
      playSound('success');
      awardRewards(20, 5);
    } else {
      playSound('click');
    }
    if (currentIndex < VOCAB_DATA.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsFlipped(false);
    } else {
      setCurrentIndex(0);
      setIsFlipped(false);
    }
  };
  const handlers = useSwipeable({
    onSwipedLeft: () => handleSwipe('left'),
    onSwipedRight: () => handleSwipe('right'),
    preventScrollOnSwipe: true,
    trackMouse: true
  });
  return (
    <AppLayout container contentClassName="min-h-screen bg-[#0F172A] text-slate-100 overflow-hidden">
      <div className="max-w-md mx-auto space-y-8 py-10">
        <header className="space-y-4">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-display font-bold text-orange-400 flex items-center gap-2">
                <Sparkles className="h-6 w-6" /> 词汇对战
              </h1>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Ebbinghaus Memory Forge</p>
            </div>
            <span className="text-sm font-mono text-slate-400">{currentIndex + 1} / {VOCAB_DATA.length}</span>
          </div>
          <Progress value={progress} className="h-2 bg-slate-800" />
        </header>
        <div {...handlers} className="relative h-[550px] w-full perspective-1000">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentWord.id + (isFlipped ? 'back' : 'front')}
              initial={{ rotateY: isFlipped ? -180 : 180, opacity: 0, scale: 0.9 }}
              animate={{ rotateY: 0, opacity: 1, scale: 1 }}
              exit={{ rotateY: isFlipped ? 180 : -180, opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              onClick={() => setIsFlipped(!isFlipped)}
              className="w-full h-full cursor-pointer"
            >
              <Card className="w-full h-full flex flex-col items-center justify-center p-8 bg-slate-900 border-slate-800 shadow-2xl rounded-5xl text-center space-y-6 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent pointer-events-none" />
                {!isFlipped ? (
                  <div className="space-y-8">
                    <div className="space-y-2">
                      <div className="flex justify-center gap-1 mb-4">
                        <History className="h-4 w-4 text-orange-400" />
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">1st Review / 3 Days Left</span>
                      </div>
                      <h2 className="text-6xl font-bold tracking-tight text-white group-hover:scale-105 transition-transform">{currentWord.word}</h2>
                    </div>
                    <div className="flex items-center justify-center gap-3 text-xl text-slate-400 font-mono bg-slate-800/50 py-2 px-6 rounded-2xl border border-slate-700">
                      <span>{currentWord.phonetic}</span>
                      <Volume2 className="h-5 w-5 text-orange-400" />
                    </div>
                    <div className="pt-10 space-y-2">
                      <p className="text-slate-500 text-xs font-bold uppercase tracking-widest animate-pulse">点击翻转释义</p>
                      <div className="flex justify-center gap-4 opacity-30">
                        <XCircle className="h-5 w-5" />
                        <CheckCircle2 className="h-5 w-5" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6 w-full text-left">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-orange-400 flex items-center gap-1">
                        <Brain className="h-3 w-3" /> 识海真意 (释义)
                      </span>
                      <p className="text-3xl font-bold text-white">{currentWord.definition}</p>
                    </div>
                    <div className="space-y-2 bg-slate-800/40 p-4 rounded-2xl border border-slate-700/50">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">艾宾��斯建议 (Memory Tip)</span>
                      <p className="text-sm text-slate-300 leading-relaxed italic">{currentWord.mnemonic}</p>
                    </div>
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">实战演练 (Example)</span>
                      <p className="text-sm italic text-slate-400 leading-relaxed">"{currentWord.example}"</p>
                    </div>
                    <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-500 font-bold uppercase">
                      <span>难度系数: S</span>
                      <span>熟练度: 15%</span>
                    </div>
                  </div>
                )}
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="flex justify-between gap-4 relative z-10">
          <Button
            variant="outline"
            className="flex-1 h-16 rounded-3xl border-red-900/30 bg-red-950/10 text-red-400 hover:bg-red-900/20 gap-2 font-bold"
            onClick={(e) => { e.stopPropagation(); handleSwipe('left'); }}
          >
            <XCircle className="h-6 w-6" /> 需复习
          </Button>
          <Button
            className="flex-1 h-16 rounded-3xl bg-emerald-600 hover:bg-emerald-500 text-white gap-2 shadow-xl shadow-emerald-900/20 font-bold"
            onClick={(e) => { e.stopPropagation(); handleSwipe('right'); }}
          >
            <CheckCircle2 className="h-6 w-6" /> 已掌握
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}