import React, { useState, useMemo } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { LISTENING_DATA } from '@/lib/mock-academic';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, Mic, SkipForward, FastForward } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
export function ListeningPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSentence, setActiveSentence] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [scores, setScores] = useState<Record<number, number>>({});
  const waveformData = useMemo(() => {
    return LISTENING_DATA[activeSentence].amplitude.map((val, i) => ({ x: i, y: val }));
  }, [activeSentence]);
  const handleMic = (index: number) => {
    toast.info("正在分析发音...", { duration: 1500 });
    setTimeout(() => {
      const score = Math.floor(Math.random() * (99 - 80 + 1) + 80);
      setScores(prev => ({ ...prev, [index]: score }));
      toast.success(`识别成功：相似度 ${score}%`, { description: "发音圆润，神识通达！" });
    }, 1500);
  };
  return (
    <AppLayout container contentClassName="bg-[#0F172A] text-slate-100">
      <div className="max-w-4xl mx-auto space-y-10 py-10">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-display font-bold text-blue-400">精听悟道</h1>
            <p className="text-slate-400">AI辅助分句精听，掌握���术听力脉络</p>
          </div>
          <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
            {[0.5, 1, 1.5, 2].map(s => (
              <Button
                key={s}
                variant={speed === s ? "secondary" : "ghost"}
                size="sm"
                className="rounded-xl px-4 font-mono font-bold"
                onClick={() => setSpeed(s)}
              >
                {s}x
              </Button>
            ))}
          </div>
        </header>
        <Card className="p-8 bg-slate-900 border-slate-800 rounded-[2.5rem] shadow-2xl overflow-hidden relative">
          <div className="h-40 w-full mb-8">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={waveformData}>
                <defs>
                  <linearGradient id="waveColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#60A5FA" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#60A5FA" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area 
                  type="monotone" 
                  dataKey="y" 
                  stroke="#60A5FA" 
                  strokeWidth={3} 
                  fill="url(#waveColor)" 
                  animationDuration={500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-6">
            <Button size="icon" variant="ghost" className="h-14 w-14 rounded-full hover:bg-slate-800" onClick={() => setActiveSentence(Math.max(0, activeSentence - 1))}>
              <RotateCcw className="h-6 w-6" />
            </Button>
            <Button size="icon" className="h-20 w-20 rounded-full bg-blue-600 hover:bg-blue-500 shadow-xl shadow-blue-900/40" onClick={() => setIsPlaying(!isPlaying)}>
              {isPlaying ? <Pause className="h-10 w-10 fill-current" /> : <Play className="h-10 w-10 ml-1 fill-current" />}
            </Button>
            <Button size="icon" variant="ghost" className="h-14 w-14 rounded-full hover:bg-slate-800" onClick={() => setActiveSentence(Math.min(LISTENING_DATA.length - 1, activeSentence + 1))}>
              <SkipForward className="h-6 w-6" />
            </Button>
          </div>
        </Card>
        <div className="space-y-6">
          {LISTENING_DATA.map((item, index) => (
            <div 
              key={item.id}
              className={cn(
                "group relative p-8 rounded-4xl border-2 transition-all cursor-pointer",
                activeSentence === index 
                  ? "bg-blue-600/10 border-blue-500/50 shadow-lg" 
                  : "bg-slate-900/50 border-transparent hover:border-slate-800"
              )}
              onClick={() => setActiveSentence(index)}
            >
              <div className="flex items-start justify-between gap-6">
                <div className="flex-1 space-y-4">
                  <p className={cn(
                    "text-xl leading-relaxed font-medium transition-colors",
                    activeSentence === index ? "text-white" : "text-slate-400"
                  )}>
                    {item.text}
                  </p>
                  {scores[index] && (
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-24 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{ width: `${scores[index]}%` }} />
                      </div>
                      <span className="text-xs font-bold text-emerald-400">相似度 {scores[index]}%</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <Button 
                    size="icon" 
                    variant={activeSentence === index ? "default" : "secondary"} 
                    className="h-12 w-12 rounded-2xl"
                    onClick={(e) => { e.stopPropagation(); handleMic(index); }}
                  >
                    <Mic className="h-5 w-5" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-12 w-12 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity">
                    <FastForward className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}