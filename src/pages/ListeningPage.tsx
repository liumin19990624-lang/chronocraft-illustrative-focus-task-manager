import React, { useState, useMemo } from 'react';
import { LISTENING_DATA } from '@/lib/mock-academic';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, RotateCcw, Mic, SkipForward, BookOpen, Repeat, StickyNote, Info } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
export function ListeningPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSentence, setActiveSentence] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [scores, setScores] = useState<Record<number, number>>({});
  const [showNotes, setShowNotes] = useState(false);
  const [loopMode, setLoopMode] = useState(false);
  const waveformData = useMemo(() => {
    return LISTENING_DATA[activeSentence].amplitude.map((val, i) => ({ x: i, y: val }));
  }, [activeSentence]);
  const handleMic = (index: number) => {
    toast.info("正在分析���音...", { duration: 1500 });
    setTimeout(() => {
      const score = Math.floor(Math.random() * (99 - 80 + 1) + 80);
      setScores(prev => ({ ...prev, [index]: score }));
      toast.success(`识别成功：��似度 ${score}%`, { description: "发音圆润，神识通达！" });
    }, 1500);
  };
  return (
    <div className="bg-[#0F172A] text-slate-100 min-h-screen px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-10">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-4xl font-display font-bold text-blue-400">精听悟道</h1>
                  <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/30 rounded-lg px-2 py-0 text-[10px] font-bold uppercase tracking-widest">
                    Level: C1 Academic
                  </Badge>
                </div>
                <p className="text-slate-400 text-sm font-medium">AI辅���分片精听，当前研习：��Transduction Models in AI》</p>
              </div>
              <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
                {[0.8, 1, 1.2, 1.5].map(s => (
                  <Button
                    key={s}
                    variant={speed === s ? "secondary" : "ghost"}
                    size="sm"
                    className="rounded-xl px-4 font-mono font-bold h-9"
                    onClick={() => setSpeed(s)}
                  >
                    {s}x
                  </Button>
                ))}
              </div>
            </header>
            <Card className="p-10 bg-slate-900 border-slate-800 rounded-[3rem] shadow-2xl overflow-hidden relative">
              <div className="h-44 w-full mb-10 cursor-pointer group">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={waveformData}>
                    <defs>
                      <linearGradient id="waveColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#60A5FA" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#60A5FA" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="y"
                      stroke="#60A5FA"
                      strokeWidth={4}
                      fill="url(#waveColor)"
                      animationDuration={500}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center justify-center gap-8">
                <Button variant="ghost" size="icon" className={cn("h-12 w-12 rounded-2xl", loopMode && "text-blue-400 bg-blue-400/10")} onClick={() => setLoopMode(!loopMode)}>
                  <Repeat className="h-5 w-5" />
                </Button>
                <Button size="icon" variant="ghost" className="h-14 w-14 rounded-2xl hover:bg-slate-800" onClick={() => setActiveSentence(Math.max(0, activeSentence - 1))}>
                  <RotateCcw className="h-6 w-6" />
                </Button>
                <Button size="icon" className="h-24 w-24 rounded-full bg-blue-600 hover:bg-blue-500 shadow-2xl shadow-blue-900/40" onClick={() => setIsPlaying(!isPlaying)}>
                  {isPlaying ? <Pause className="h-12 w-12 fill-current" /> : <Play className="h-12 w-12 ml-2 fill-current" />}
                </Button>
                <Button size="icon" variant="ghost" className="h-14 w-14 rounded-2xl hover:bg-slate-800" onClick={() => setActiveSentence(Math.min(LISTENING_DATA.length - 1, activeSentence + 1))}>
                  <SkipForward className="h-6 w-6" />
                </Button>
                <Button variant="ghost" size="icon" className={cn("h-12 w-12 rounded-2xl", showNotes && "text-blue-400 bg-blue-400/10")} onClick={() => setShowNotes(!showNotes)}>
                  <StickyNote className="h-5 w-5" />
                </Button>
              </div>
            </Card>
            <div className="space-y-4">
              {LISTENING_DATA.map((item, index) => (
                <div
                  key={item.id}
                  className={cn(
                    "group relative p-8 rounded-[2.5rem] border-2 transition-all cursor-pointer",
                    activeSentence === index
                      ? "bg-blue-600/10 border-blue-500/40 shadow-xl"
                      : "bg-slate-900/40 border-transparent hover:border-slate-800"
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
                        <div className="flex items-center gap-3">
                          <div className="h-2 w-32 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                            <div className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" style={{ width: `${scores[index]}%` }} />
                          </div>
                          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">相似度 {scores[index]}%</span>
                        </div>
                      )}
                    </div>
                    <Button
                      size="icon"
                      variant={activeSentence === index ? "default" : "secondary"}
                      className="h-14 w-14 rounded-2xl shrink-0"
                      onClick={(e) => { e.stopPropagation(); handleMic(index); }}
                    >
                      <Mic className="h-6 w-6" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <aside className="lg:col-span-4 space-y-6">
            <Card className="p-8 rounded-[2.5rem] bg-slate-900 border-slate-800 space-y-6 shadow-2xl">
              <h2 className="text-xl font-display font-bold flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-400" /> 精听笔录 (Study Notes)
              </h2>
              <textarea
                className="w-full h-80 bg-slate-800/50 rounded-2xl p-4 text-sm font-medium border-none focus:ring-1 focus:ring-blue-500 resize-none placeholder:text-slate-600"
                placeholder="在此记录关键学术短语、生词或修行心得..."
              />
              <Button className="w-full h-14 rounded-2xl bg-blue-600 font-bold">同步至识海</Button>
            </Card>
            <Card className="p-8 rounded-[2.5rem] bg-blue-600/5 border border-blue-500/10 space-y-4">
              <div className="flex items-center gap-2 text-blue-400">
                <Info className="h-5 w-5" />
                <span className="text-xs font-bold uppercase tracking-widest">学术技巧</span>
              </div>
              <p className="text-sm text-slate-400 italic leading-relaxed">
                “学术听��中，注意捕捉转折词如 'However' 和 'Conversely'，它们通常预示着核心论点的出现。”
              </p>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}