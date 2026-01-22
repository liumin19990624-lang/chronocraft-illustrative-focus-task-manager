import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, FileText, ChevronDown, ChevronUp, Download, Sparkles, Loader2, BookmarkPlus, Globe, BookOpen } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { api } from '@/lib/api-client';
import { AcademicPaper, PaperSource } from '@shared/types';
import { useAppStore } from '@/store/use-app-store';
import { toast } from 'sonner';
interface PaperSearchProps {
  onSelectPaper: (paper: AcademicPaper) => void;
}
export function PaperSearch({ onSelectPaper }: PaperSearchProps) {
  const [query, setQuery] = useState('');
  const [source, setSource] = useState<PaperSource | 'All'>('All');
  const [onlyOA, setOnlyOA] = useState(false);
  const [results, setResults] = useState<AcademicPaper[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const addTask = useAppStore(s => s.addTask);
  const handleSearch = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();
    setIsLoading(true);
    try {
      const url = `/api/papers/search?q=${encodeURIComponent(query)}&source=${source}&oa=${onlyOA}`;
      const data = await api<AcademicPaper[]>(url);
      setResults(data);
    } catch (err) {
      toast.error("灵力枯竭，无法检索藏经阁");
    } finally {
      setIsLoading(false);
    }
  }, [query, source, onlyOA]);
  useEffect(() => {
    handleSearch();
  }, [handleSearch]);
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
      toast.success("已将此法诀关联至��的每日任务");
    } catch (err) {
      toast.error("识海同步失败");
    }
  };
  return (
    <div className="space-y-10 w-full">
      <div className="flex flex-col gap-6 max-w-4xl mx-auto">
        <Tabs value={source} onValueChange={(v) => setSource(v as any)} className="w-full">
          <TabsList className="grid grid-cols-4 md:grid-cols-7 h-12 bg-secondary/50 rounded-2xl p-1">
            <TabsTrigger value="All" className="rounded-xl font-bold">全部</TabsTrigger>
            <TabsTrigger value="arXiv" className="rounded-xl font-bold">arXiv</TabsTrigger>
            <TabsTrigger value="CNKI" className="rounded-xl font-bold">CNKI</TabsTrigger>
            <TabsTrigger value="PubMed" className="rounded-xl font-bold">PubMed</TabsTrigger>
            <TabsTrigger value="Wanfang" className="rounded-xl font-bold">万方</TabsTrigger>
            <TabsTrigger value="IEEE" className="rounded-xl font-bold">IEEE</TabsTrigger>
            <TabsTrigger value="Nature" className="rounded-xl font-bold">Nature</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex flex-col md:flex-row items-center gap-6 bg-card/40 backdrop-blur-2xl p-4 rounded-[2.5rem] border border-border/50 shadow-soft">
          <div className="flex-1 flex items-center gap-4 w-full">
            <Search className="ml-4 h-6 w-6 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索标题、DOI、作者或关键词..."
              className="flex-1 border-none bg-transparent h-14 text-lg font-medium focus-visible:ring-0"
            />
          </div>
          <div className="flex items-center gap-6 px-4 border-l border-border/50">
            <div className="flex items-center gap-2">
              <Switch checked={onlyOA} onCheckedChange={setOnlyOA} id="oa-filter" />
              <Label htmlFor="oa-filter" className="text-sm font-bold whitespace-nowrap">仅OA</Label>
            </div>
            <Button onClick={() => handleSearch()} className="rounded-2xl h-12 px-8 font-bold gap-2">
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
              检索
            </Button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 max-w-5xl mx-auto">
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
                  <div className="h-20 w-20 rounded-3xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/5">
                    <FileText className="h-10 w-10 text-primary" />
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-primary/20 text-primary border-none">{paper.source}</Badge>
                          {paper.isOA && <Badge className="bg-emerald-500/20 text-emerald-600 border-none">OA</Badge>}
                        </div>
                        <h3 className="text-2xl font-display font-bold leading-tight group-hover:text-primary transition-colors">{paper.title}</h3>
                        <p className="text-muted-foreground font-medium">{paper.authors} • {paper.year}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 pt-2">
                      <Button variant="ghost" size="sm" className="rounded-xl font-bold gap-2" onClick={() => setExpandedId(expandedId === paper.id ? null : paper.id)}>
                        {expandedId === paper.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        摘��
                      </Button>
                      <Button variant="outline" className="rounded-2xl font-bold h-10 gap-2 border-primary/10" onClick={() => handleLinkToQuest(paper)}>
                        <BookmarkPlus className="h-4 w-4" /> 关联法诀
                      </Button>
                      <Button className="rounded-2xl font-bold h-10 px-6 ml-auto" onClick={() => onSelectPaper(paper)}>
                        开始研习
                      </Button>
                    </div>
                    {expandedId === paper.id && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="pt-6 border-t border-border/50 mt-4">
                        <p className="text-lg font-display italic text-muted-foreground leading-relaxed">{paper.abstract}</p>
                      </motion.div>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}