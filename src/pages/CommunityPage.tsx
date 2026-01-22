import React, { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useAppStore } from '@/store/use-app-store';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquare, Heart, Share2, Plus, Sparkles, BookOpen, Brain, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useShallow } from 'zustand/react/shallow';
export function CommunityPage() {
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
    <AppLayout container>
      <header className="mb-12 space-y-4">
        <h1 className="text-5xl font-display font-bold flex items-center gap-4">
          <Users className="h-10 w-10 text-primary" /> 论道广场
        </h1>
        <p className="text-muted-foreground text-lg italic">“三人行，必有��师焉。集众智，筑学术之巅。”</p>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-8">
          <Card className="p-8 rounded-[2.5rem] border-none shadow-soft bg-card/60 backdrop-blur-xl">
            <div className="flex gap-4">
              <Avatar className="h-12 w-12 rounded-2xl">
                <AvatarImage src={userStats?.avatar} />
                <AvatarFallback>Me</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-4">
                <Input 
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="分享你的学术心得或修行感悟..." 
                  className="h-14 rounded-2xl bg-secondary/50 border-none px-6"
                />
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <Badge variant="outline" className="rounded-lg cursor-pointer hover:bg-primary/5"># 论文研读</Badge>
                    <Badge variant="outline" className="rounded-lg cursor-pointer hover:bg-primary/5"># 英语提升</Badge>
                  </div>
                  <Button onClick={handleCreatePost} className="rounded-xl font-bold h-12 px-8">
                    <Plus className="h-4 w-4 mr-2" /> 发布动态
                  </Button>
                </div>
              </div>
            </div>
          </Card>
          <Tabs defaultValue="dynamics" className="w-full">
            <TabsList className="bg-secondary/50 rounded-2xl h-14 p-1 mb-8">
              <TabsTrigger value="dynamics" className="rounded-xl px-8 font-bold h-full">论道动态</TabsTrigger>
              <TabsTrigger value="collaborative" className="rounded-xl px-8 font-bold h-full">共修卷轴</TabsTrigger>
              <TabsTrigger value="qna" className="rounded-xl px-8 font-bold h-full">疑难解惑</TabsTrigger>
            </TabsList>
            <TabsContent value="dynamics" className="space-y-6 mt-0">
              {socialPosts.map(post => (
                <Card key={post.id} className="p-8 rounded-[2.5rem] border-none shadow-soft bg-card/60 backdrop-blur-xl group hover:scale-[1.01] transition-transform">
                  <div className="flex gap-4 mb-6">
                    <Avatar className="h-12 w-12 rounded-2xl shadow-lg group-hover:rotate-6 transition-transform">
                      <AvatarImage src={post.userAvatar} />
                      <AvatarFallback>{post.userName[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-bold text-lg">{post.userName}</p>
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <p className="text-xl font-display leading-relaxed mb-8">{post.content}</p>
                  <div className="flex items-center gap-8 border-t border-border/50 pt-6">
                    <button onClick={() => likePost(post.id)} className="flex items-center gap-2 text-muted-foreground hover:text-red-500 transition-colors">
                      <Heart className="h-5 w-5" />
                      <span className="text-sm font-bold">{post.likes}</span>
                    </button>
                    <button className="flex items-center gap-2 text-muted-foreground hover:text-blue-500 transition-colors">
                      <MessageSquare className="h-5 w-5" />
                      <span className="text-sm font-bold">{post.comments}</span>
                    </button>
                    <button className="flex items-center gap-2 text-muted-foreground hover:text-emerald-500 transition-colors">
                      <Share2 className="h-5 w-5" />
                    </button>
                  </div>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>
        <aside className="lg:col-span-4 space-y-8">
          <Card className="p-8 rounded-[3rem] bg-slate-900 text-white space-y-6 shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -mr-16 -mt-16" />
            <h2 className="text-2xl font-display font-bold flex items-center gap-3">
              <Sparkles className="h-6 w-6 text-yellow-500" /> 宗门公���
            </h2>
            <div className="space-y-4 relative z-10">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 italic text-sm">
                “本周六晚 20:00，藏经��阁长将开启《GPT-4 架构演进》共修研讨会。”
              </div>
              <Button variant="outline" className="w-full rounded-xl border-white/20 hover:bg-white/10 text-white font-bold h-12">立��参与</Button>
            </div>
          </Card>
          <Card className="p-8 rounded-[3rem] bg-card/60 backdrop-blur-xl border-none shadow-soft space-y-6">
            <h2 className="text-2xl font-display font-bold">推荐共修组</h2>
            <div className="space-y-4">
              {[
                { name: "NLP 炼丹学徒", icon: Brain, members: 124 },
                { name: "托福 110+ 冲刺", icon: BookOpen, members: 89 },
              ].map(group => (
                <div key={group.name} className="flex items-center justify-between p-4 bg-secondary/50 rounded-2xl hover:bg-secondary transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center">
                      <group.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">{group.name}</p>
                      <p className="text-[10px] text-muted-foreground">{group.members} 位道友共修</p>
                    </div>
                  </div>
                  <Plus className="h-4 w-4 text-muted-foreground" />
                </div>
              ))}
            </div>
          </Card>
        </aside>
      </div>
    </AppLayout>
  );
}