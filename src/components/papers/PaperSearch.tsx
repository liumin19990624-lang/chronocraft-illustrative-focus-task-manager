import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, FileText, ChevronDown, ChevronUp, Link as LinkIcon, Download, Sparkles, Loader2, BookmarkPlus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api-client';
import { AcademicPaper } from '@shared/types';
import { useAppStore } from '@/store/use-app-store';
import { toast } from 'sonner';
interface PaperSearchProps {
  onSelectPaper: (paper: AcademicPaper) => void;
}
export function PaperSearch({ onSelectPaper }: PaperSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<AcademicPaper[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const addTask = useAppStore(s => s.addTask);
  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setIsLoading(true);
    try {
      const data = await api<AcademicPaper[]>(`/api/papers/search?q=${encodeURIComponent(query)}`);
      setResults(data);
    } catch (err) {
      toast.error("灵力枯竭，无法检索藏经阁");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    handleSearch();
  }, []);
  const handleLinkToQuest = async (paper: AcademicPaper) => {
    try {
      await addTask({
        title: `研读论文: ${paper.title}`,
        type: 'reading',
        priority: 2,
        pomodoroEstimate: 4,
        dueDate: new Date().toISOString(),
        dueTime: "10:00",
        tags: paper.tags,
      });
      toast.success("已将此法诀关联至你的每日任务", { description: "祝道友早日大功告成" });
    } catch (err) {
      toast.error("识海同步失败");
    }
  };
  return (
    <div className="space-y-10 w-full">
      <div className="relative group max-w-3xl mx-auto">
        <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        <form onSubmit={handleSearch} className="relative flex items-center gap-4 bg-card/40 backdrop-blur-2xl p-2 rounded-[2.5rem] border border-border/50 shadow-soft focus-within:ring-4 ring-primary/5 transition-all">
          <Search className="ml-6 h-6 w-6 text-muted-foreground" />
          <Input 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="在万千卷轴中检索关键词、作者或标题..."
            className="flex-1 border-none bg-transparent h-16 text-xl font-medium focus-visible:ring-0 placeholder:text-muted-foreground/30"
          />
          <Button type="submit" className="rounded-[2rem] h-14 px-8 font-bold text-lg gap-2 shadow-lg shadow-primary/20">
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
            搜寻
          </Button>
        </form>
      </div>
      <div className="grid grid-cols-1 gap-6">
        <AnimatePresence mode="popLayout">
          {results.map((paper, idx) => (
            <motion.div
              key={paper.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className="group overflow-hidden rounded-[2.5rem] border-none bg-card/60 backdrop-blur-xl shadow-soft hover:shadow-xl transition-all">
                <div className="p-8 flex flex-col md:flex-row gap-8 items-start">
                  <div className="h-20 w-20 rounded-3xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/5 group-hover:rotate-6 transition-transform">
                    <FileText className="h-10 w-10 text-primary" />
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div>
                        <h3 className="text-2xl font-display font-bold leading-tight group-hover:text-primary transition-colors">{paper.title}</h3>
                        <p className="text-muted-foreground font-medium mt-1">{paper.authors} • {paper.year}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {paper.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="rounded-xl font-bold uppercase tracking-widest text-[10px] bg-primary/5 border-none">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-6 pt-2">
                      <Button variant="ghost" className="rounded-xl font-bold h-10 gap-2 text-xs" onClick={() => setExpandedId(expandedId === paper.id ? null : paper.id)}>
                        {expandedId === paper.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        {expandedId === paper.id ? "收起摘要" : "查看摘要"}
                      </Button>
                      <Button variant="ghost" className="rounded-xl font-bold h-10 gap-2 text-xs" asChild>
                        <a href={paper.pdfUrl} target="_blank" rel="noopener noreferrer">
                          <Download className="h-4 w-4" /> 预��� PDF
                        </a>
                      </Button>
                      <div className="flex-1 md:flex justify-end gap-3 hidden">
                        <Button variant="outline" className="rounded-2xl font-bold h-12 gap-2 border-primary/10 hover:bg-primary/5" onClick={() => handleLinkToQuest(paper)}>
                          <BookmarkPlus className="h-4 w-4" /> 关联为法诀
                        </Button>
                        <Button className="rounded-2xl font-bold h-12 px-8" onClick={() => onSelectPaper(paper)}>
                          进入研习模式
                        </Button>
                      </div>
                    </div>
                    <AnimatePresence>
                      {expandedId === paper.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="pt-6 border-t border-border/50 mt-4">
                            <p className="text-lg font-display italic leading-relaxed text-muted-foreground">
                              {paper.abstract}
                            </p>
                            <div className="mt-4 flex items-center gap-2 text-primary font-bold">
                              <Sparkles className="h-4 w-4" />
                              <span className="text-xs uppercase tracking-widest">被引用 {paper.citations} 次</span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    {/* Mobile buttons */}
                    <div className="flex md:hidden gap-3 pt-4 border-t border-border/50">
                        <Button variant="outline" className="flex-1 rounded-xl font-bold h-12" onClick={() => handleLinkToQuest(paper)}>
                          <BookmarkPlus className="h-4 w-4" />
                        </Button>
                        <Button className="flex-[2] rounded-xl font-bold h-12" onClick={() => onSelectPaper(paper)}>
                          研习
                        </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
        {results.length === 0 && !isLoading && (
          <div className="py-20 text-center space-y-4 opacity-30">
            <Search className="h-16 w-16 mx-auto" />
            <p className="text-xl font-display font-bold">暂无对应法诀��试着调整检索词</p>
          </div>
        )}
      </div>
    </div>
  );
}