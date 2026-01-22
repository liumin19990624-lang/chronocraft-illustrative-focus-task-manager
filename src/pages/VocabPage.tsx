import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { VOCAB_DATA } from '@/lib/mock-academic';
import { useSwipeable } from 'react-swipeable';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, XCircle, Volume2, Sparkles, RefreshCcw } from 'lucide-react';
import { triggerConfetti } from '@/components/ui/confetti';
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
      triggerConfetti();
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
    <AppLayout container contentClassName="min-h-screen bg-[#0F172A] text-slate-100">
      <div className="max-w-md mx-auto space-y-8 py-10">
        <header className="space-y-4">
          <div className="flex justify-between items-end">
            <h1 className="text-3xl font-display font-bold text-orange-400 flex items-center gap-2">
              <Sparkles className="h-6 w-6" /> 词汇对战
            </h1>
            <span className="text-sm font-mono text-slate-400">{currentIndex + 1} / {VOCAB_DATA.length}</span>
          </div>
          <Progress value={progress} className="h-2 bg-slate-800" />
        </header>
        <div {...handlers} className="relative h-[500px] w-full perspective-1000">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentWord.id + (isFlipped ? 'back' : 'front')}
              initial={{ rotateY: isFlipped ? -90 : 90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: isFlipped ? 90 : -90, opacity: 0 }}
              transition={{ duration: 0.4 }}
              onClick={() => setIsFlipped(!isFlipped)}
              className="w-full h-full cursor-pointer"
            >
              <Card className="w-full h-full flex flex-col items-center justify-center p-10 bg-slate-900 border-slate-800 shadow-2xl rounded-5xl text-center space-y-6">
                {!isFlipped ? (
                  <>
                    <h2 className="text-5xl font-bold tracking-tight text-white">{currentWord.word}</h2>
                    <div className="flex items-center gap-2 text-xl text-slate-400 font-mono">
                      <span>{currentWord.phonetic}</span>
                      <Volume2 className="h-5 w-5 text-orange-400" />
                    </div>
                    <p className="text-slate-500 text-sm mt-10 animate-pulse">点击或空格翻转查看释义</p>
                  </>
                ) : (
                  <div className="space-y-8 w-full">
                    <div className="space-y-2">
                      <span className="text-xs font-bold uppercase tracking-widest text-orange-400">释义</span>
                      <p className="text-3xl font-bold text-white">{currentWord.definition}</p>
                    </div>
                    <div className="space-y-2 bg-slate-800/50 p-4 rounded-2xl border border-slate-700">
                      <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">记忆术</span>
                      <p className="text-sm text-slate-300 leading-relaxed">{currentWord.mnemonic}</p>
                    </div>
                    <div className="space-y-2 text-left">
                      <span className="text-xs font-bold uppercase tracking-widest text-blue-400">例句</span>
                      <p className="text-sm italic text-slate-400">"{currentWord.example}"</p>
                    </div>
                  </div>
                )}
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="flex justify-between gap-4">
          <Button 
            variant="outline" 
            className="flex-1 h-16 rounded-3xl border-red-900/50 bg-red-950/20 text-red-400 hover:bg-red-900/30 gap-2"
            onClick={() => handleSwipe('left')}
          >
            <XCircle className="h-6 w-6" /> 需复习
          </Button>
          <Button 
            className="flex-1 h-16 rounded-3xl bg-emerald-600 hover:bg-emerald-500 text-white gap-2 shadow-lg shadow-emerald-900/20"
            onClick={() => handleSwipe('right')}
          >
            <CheckCircle2 className="h-6 w-6" /> 已掌握
          </Button>
        </div>
        <div className="flex items-center justify-center gap-2 text-slate-500 text-sm font-medium">
          <RefreshCcw className="h-4 w-4" /> ���宾浩斯记忆模式已激��
        </div>
      </div>
    </AppLayout>
  );
}