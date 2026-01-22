import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { useAppStore } from '@/store/use-app-store';
import { User, Settings2, Bell, Shield, Database, Trash2, Download, Palette, Type, Moon, Sun } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
export function SettingsPage() {
  const userStats = useAppStore(s => s.userStats);
  const updateSettings = useAppStore(s => s.updateSettings);
  const handleFontScale = (val: number[]) => {
    updateSettings({ fontScale: val[0] });
  };
  const handleReset = () => {
    if (confirm("确���要重置修行进度吗？此操作不可撤销，���力值将归零。")) {
      localStorage.clear();
      window.location.href = '/';
    }
  };
  if (!userStats) return null;
  return (
    <AppLayout container>
      <header className="mb-12">
        <h1 className="text-5xl font-display font-bold tracking-tight">个人��心</h1>
        <p className="text-muted-foreground text-lg mt-2 italic">“修身、齐家、治国、平天下。首先从构筑个人领域开始。”</p>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <aside className="lg:col-span-4 space-y-8">
          <Card className="rounded-[3rem] p-10 border-none shadow-soft bg-card/60 backdrop-blur-xl text-center">
            <Avatar className="h-32 w-32 mx-auto rounded-[3rem] shadow-2xl border-4 border-white mb-6">
              <AvatarImage src={userStats.avatar} />
              <AvatarFallback>{userStats.nickname[0]}</AvatarFallback>
            </Avatar>
            <h2 className="text-3xl font-display font-bold">{userStats.nickname}</h2>
            <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs mt-2">等级 {userStats.level} · 境界稳固</p>
            <div className="mt-8 flex gap-4">
              <Button variant="outline" className="flex-1 rounded-2xl h-12 font-bold">更换道号</Button>
              <Button variant="outline" className="flex-1 rounded-2xl h-12 font-bold">导出名片</Button>
            </div>
          </Card>
          <nav className="space-y-2">
            {[
              { label: "偏好设置", icon: Palette },
              { label: "通知与隐私", icon: Shield },
              { label: "数据管理", icon: Database },
            ].map(item => (
              <button key={item.label} className="w-full flex items-center gap-4 px-8 py-5 rounded-[2rem] hover:bg-card/40 transition-colors text-left group">
                <item.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="font-bold text-lg">{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>
        <main className="lg:col-span-8 space-y-8">
          <Card className="rounded-[3rem] border-none shadow-soft p-12 bg-card/60 backdrop-blur-xl space-y-12">
            <section className="space-y-8">
              <div className="flex items-center gap-3">
                <Palette className="h-6 w-6 text-primary" />
                <h3 className="text-2xl font-display font-bold">界面定制</h3>
              </div>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-lg font-bold">文字缩放</Label>
                    <p className="text-sm text-muted-foreground">调整系统显示字体的大小比例</p>
                  </div>
                  <div className="w-48 flex items-center gap-4">
                    <Type className="h-4 w-4 text-muted-foreground" />
                    <Slider 
                      value={[userStats.settings.fontScale]} 
                      min={0.8} 
                      max={1.2} 
                      step={0.1} 
                      onValueChange={handleFontScale}
                    />
                    <span className="font-mono font-bold text-sm">{userStats.settings.fontScale}x</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-lg font-bold">沉浸深色模式</Label>
                    <p className="text-sm text-muted-foreground">根据系统或手动开启修行护眼模式</p>
                  </div>
                  <Switch 
                    checked={userStats.settings.themePreference === 'dark'} 
                    onCheckedChange={(checked) => updateSettings({ themePreference: checked ? 'dark' : 'light' })} 
                  />
                </div>
              </div>
            </section>
            <section className="space-y-8">
              <div className="flex items-center gap-3">
                <Shield className="h-6 w-6 text-primary" />
                <h3 className="text-2xl font-display font-bold">通知与隐私</h3>
              </div>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-lg font-bold">隐身模式 (Incognito)</Label>
                    <p className="text-sm text-muted-foreground">在广场中隐藏你的在线状态和当前进度</p>
                  </div>
                  <Switch 
                    checked={userStats.settings.privacyMode} 
                    onCheckedChange={(checked) => updateSettings({ privacyMode: checked })} 
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-lg font-bold">任务灵响</Label>
                    <p className="text-sm text-muted-foreground">开启任务到期与社区回复的即���通知</p>
                  </div>
                  <Switch 
                    checked={userStats.settings.notificationsEnabled} 
                    onCheckedChange={(checked) => updateSettings({ notificationsEnabled: checked })} 
                  />
                </div>
              </div>
            </section>
            <section className="space-y-8 pt-8 border-t border-border/50">
              <div className="flex items-center gap-3">
                <Database className="h-6 w-6 text-primary" />
                <h3 className="text-2xl font-display font-bold">归档管理</h3>
              </div>
              <div className="flex flex-wrap gap-4">
                <Button variant="outline" className="rounded-2xl h-14 px-8 font-bold gap-2">
                  <Download className="h-4 w-4" /> 导出全部研习记录
                </Button>
                <Button variant="destructive" className="rounded-2xl h-14 px-8 font-bold gap-2" onClick={handleReset}>
                  <Trash2 className="h-4 w-4" /> 焚毁神识 (重置进度)
                </Button>
              </div>
            </section>
          </Card>
        </main>
      </div>
    </AppLayout>
  );
}