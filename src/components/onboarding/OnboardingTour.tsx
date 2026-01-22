import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, LayoutDashboard, BookOpen, FileText, CheckCircle2, ArrowRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
const STEPS = [
  {
    title: "学术大厅",
    desc: "你的修行指挥部。在这里管理每日蓝图，查看今日运势与修行等级。",
    icon: LayoutDashboard,
    color: "text-blue-500",
    bg: "bg-blue-500/10"
  },
  {
    title: "词汇对战",
    desc: "利用艾宾��斯遗忘曲线，通过翻卡对战强化记忆，获取灵石奖励。",
    icon: BookOpen,
    color: "text-orange-500",
    bg: "bg-orange-500/10"
  },
  {
    title: "双栏研习社",
    desc: "沉浸式论文阅读体验，集成 AI 笔灵助教，一键总结与翻译。",
    icon: FileText,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10"
  },
  {
    title: "深度潜修",
    desc: "开启番茄钟进入静音结界，积攒专注���气，完成周天运行。",
    icon: Sparkles,
    color: "text-purple-500",
    bg: "bg-purple-500/10"
  }
];
export function OnboardingTour() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const hasCompleted = localStorage.getItem('onboarding_completed');
    if (!hasCompleted) {
      setIsVisible(true);
    }
  }, []);
  const handleComplete = () => {
    localStorage.setItem('onboarding_completed', 'true');
    setIsVisible(false);
  };
  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(s => s + 1);
    } else {
      handleComplete();
    }
  };
  if (!isVisible) return null;
  const StepIcon = STEPS[currentStep].icon;
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-background/80 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-lg bg-card border shadow-2xl rounded-[3rem] overflow-hidden"
        >
          <div className="p-10 space-y-8">
            <div className="flex justify-between items-center">
              <div className="flex gap-1.5">
                {STEPS.map((_, i) => (
                  <div 
                    key={i} 
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-300",
                      i === currentStep ? "w-8 bg-primary" : "w-2 bg-muted"
                    )} 
                  />
                ))}
              </div>
              <Button variant="ghost" size="icon" onClick={handleComplete} className="rounded-full">
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="text-center space-y-6">
              <motion.div
                key={currentStep}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className={cn("mx-auto h-24 w-24 rounded-3xl flex items-center justify-center", STEPS[currentStep].bg)}
              >
                <StepIcon className={cn("h-12 w-12", STEPS[currentStep].color)} />
              </motion.div>
              <div className="space-y-2">
                <h2 className="text-3xl font-display font-bold">{STEPS[currentStep].title}</h2>
                <p className="text-muted-foreground leading-relaxed">{STEPS[currentStep].desc}</p>
              </div>
            </div>
            <Button 
              onClick={nextStep} 
              className="w-full h-16 rounded-2xl text-xl font-bold shadow-xl shadow-primary/20"
            >
              {currentStep === STEPS.length - 1 ? "开启修行" : "下一步"}
              <ArrowRight className="ml-2 h-6 w-6" />
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}