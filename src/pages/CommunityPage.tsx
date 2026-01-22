import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useAppStore } from '@/store/use-app-store';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquare, Heart, Share2, Plus, Sparkles, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useShallow } from 'zustand/react/shallow';
export default function CommunityPage() {
  const socialPosts = useAppStore(useShallow(s => s.socialPosts));
  const fetchPosts = useAppStore(s => s.fetchPosts);
  const likePost = useAppStore(s => s.likePost);
  const createPost = useAppStore(s => s.createPost);
  const userStats = useAppStore(s => s.userStats);
  const [newPostContent, setNewPostContent] = useState('');
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);
  const handleCreatePost = () => {
    if (!newPostContent.trim()) return;
    createPost({ content: newPostContent, category: 'dynamics', tags: ['学术'] });
    setNewPostContent('');
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12">
      <header className="mb-12 space-y-4">
        <h1 className="text-6xl font-display font-bold flex items-center gap-6">
          <div className="p-4 bg-primary rounded-[2rem] text-primary-foreground shadow-2xl">
            <Users className="h-10 w-10" />
          </div>
          论道广场
        </h1>
        <p className="text-muted-foreground text-xl italic max-w-2xl">“君子博学而日参��乎己，则知明而行无过矣。”</p>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-8">
          <Card className="p-8 rounded-[3.5rem] border-none shadow-soft bg-card/40 backdrop-blur-xl">
            <div className="flex gap-6">
              <Avatar className="h-14 w-14 rounded-2xl shadow-lg border-2 border-white">
                <AvatarImage src={userStats?.avatar} />
                <AvatarFallback>Me</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-5">
                <Input
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="分享你的学术灵感或修行心得..."
                  className="h-16 rounded-2xl bg-secondary/50 border-none px-6 text-lg font-medium placeholder:text-muted-foreground/30 focus-visible:ring-primary/20"
                />
                <div className="flex justify-between items-center">
                  <div className="flex gap-3">
                    <Badge variant="outline" className="rounded-xl px-3 py-1 cursor-pointer hover:bg-primary/5 font-bold transition-all border-primary/10"># 论文研读</Badge>
                    <Badge variant="outline" className="rounded-xl px-3 py-1 cursor-pointer hover:bg-primary/5 font-bold transition-all border-primary/10"># 英语提升</Badge>
                  </div>
                  <Button onClick={handleCreatePost} className="rounded-2xl font-bold h-14 px-10 shadow-lg shadow-primary/10">
                    <Plus className="h-5 w-5 mr-2" /> ��布动态
                  </Button>
                </div>
              </div>
            </div>
          </Card>
          <Tabs defaultValue="dynamics" className="w-full">
            <TabsList className="bg-secondary/50 rounded-2xl h-14 p-1 mb-10 border border-border/50">
              <TabsTrigger value="dynamics" className="rounded-xl px-10 font-bold h-full">论道动态</TabsTrigger>
              <TabsTrigger value="collaborative" className="rounded-xl px-10 font-bold h-full">共修卷轴</TabsTrigger>
              <TabsTrigger value="qna" className="rounded-xl px-10 font-bold h-full">疑难解惑</TabsTrigger>
            </TabsList>
            <TabsContent value="dynamics" className="space-y-8 mt-0">
              {socialPosts.map(post => (
                <Card key={post.id} className="p-10 rounded-[3.5rem] border-none shadow-soft bg-card/60 backdrop-blur-xl group hover:scale-[1.01] transition-all">
                  <div className="flex gap-5 mb-8">
                    <Avatar className="h-14 w-14 rounded-2xl shadow-xl group-hover:rotate-6 transition-transform border-2 border-white">
                      <AvatarImage src={post.userAvatar} />
                      <AvatarFallback>{post.userName[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-bold text-xl">{post.userName}</p>
                      <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em] mt-1">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <p className="text-2xl font-display leading-relaxed mb-10 text-foreground/90">{post.content}</p>
                  <div className="flex items-center gap-10 border-t border-border/50 pt-8">
                    <button onClick={() => likePost(post.id)} className="flex items-center gap-2.5 text-muted-foreground hover:text-red-500 transition-colors">
                      <Heart className="h-6 w-6" />
                      <span className="text-sm font-bold">{post.likes}</span>
                    </button>
                    <button className="flex items-center gap-2.5 text-muted-foreground hover:text-blue-500 transition-colors">
                      <MessageSquare className="h-6 w-6" />
                      <span className="text-sm font-bold">{post.comments}</span>
                    </button>
                    <button className="flex items-center gap-2.5 text-muted-foreground hover:text-emerald-500 transition-colors ml-auto">
                      <Share2 className="h-6 w-6" />
                    </button>
                  </div>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>
        <aside className="lg:col-span-4 space-y-10">
          <Card className="p-8 rounded-[3rem] bg-slate-900 text-white space-y-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/20 rounded-full blur-3xl -mr-20 -mt-20" />
            <div className="flex items-center gap-3">
              <Sparkles className="h-6 w-6 text-yellow-500" />
              <h2 className="text-2xl font-display font-bold">宗门公告</h2>
            </div>
            <div className="space-y-6 relative z-10">
              <div className="p-5 bg-white/5 rounded-2xl border border-white/10 italic text-sm leading-relaxed text-slate-300">
                “本周六晚 20:00，藏经阁阁长将开启《LLM 架构���进》共修研讨会。诚邀各位道友共话玄机。”
              </div>
              <Button variant="outline" className="w-full rounded-2xl border-white/20 hover:bg-white/10 text-white font-bold h-14 text-lg">立即参与</Button>
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}