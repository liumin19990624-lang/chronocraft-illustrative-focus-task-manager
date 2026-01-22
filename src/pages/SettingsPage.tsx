import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { useAppStore } from '@/store/use-app-store';
import { Palette, Shield, Database, Trash2, Download, Type, User, ShieldCheck, BellRing } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
export default function SettingsPage() {
  const userStats = useAppStore(s => s.userStats);
  const updateSettings = useAppStore(s => s.updateSettings);
  const handleFontScale = (val: number[]) => {
    updateSettings({ fontScale: val[0] });
  };
  const handleReset = () => {
    if (confirm("确认要重置修行进度吗？此操作不可撤销，修为值将归��。")) {
      localStorage.clear();
      window.location.href = '/';
    }
  };
  if (!userStats) return null;
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12">
      <header className="mb-16">
        <h1 className="text-6xl font-display font-bold tracking-tight">修行偏好</h1>
        <p className="text-muted-foreground text-xl mt-4 italic">“工欲善其事，��先利其器。定制你的个人修行法域。”</p>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <aside className="lg:col-span-4 space-y-8">
          <Card className="rounded-[3.5rem] p-12 border-none shadow-soft bg-card/60 backdrop-blur-xl text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16" />
            <Avatar className="h-40 w-40 mx-auto rounded-[3.5rem] shadow-2xl border-4 border-white mb-8">
              <AvatarImage src={userStats.avatar} />
              <AvatarFallback>{userStats.nickname[0]}</AvatarFallback>
            </Avatar>
            <h2 className="text-4xl font-display font-bold mb-2">{userStats.nickname}</h2>
            <p className="text-muted-foreground font-black uppercase tracking-[0.3em] text-[10px] bg-secondary/50 inline-block px-4 py-1.5 rounded-full">第 {userStats.level} 重���界</p>
            <div className="mt-10 flex flex-col gap-3">
              <Button variant="outline" className="rounded-2xl h-14 font-bold border-primary/10">更换道��</Button>
              <Button variant="outline" className="rounded-2xl h-14 font-bold border-primary/10">导出修行名片</Button>
            </div>
          </Card>
          <nav className="space-y-3">
            {[
              { label: "界面定制", icon: Palette },
              { label: "通知与隐私", icon: ShieldCheck },
              { label: "神识存储", icon: Database },
            ].map(item => (
              <button key={item.label} className="w-full flex items-center justify-between px-8 py-6 rounded-[2.5rem] hover:bg-card/40 transition-all text-left group">
                <div className="flex items-center gap-4">
                  <item.icon className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                  <span className="font-bold text-xl">{item.label}</span>
                </div>
              </button>
            ))}
          </nav>
        </aside>
        <main className="lg:col-span-8 space-y-10">
          <Card className="rounded-[3.5rem] border-none shadow-soft p-14 bg-card/60 backdrop-blur-xl space-y-16">
            <section className="space-y-10">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                  <Palette className="h-6 w-6" />
                </div>
                <h3 className="text-3xl font-display font-bold">界面定制</h3>
              </div>
              <div className="space-y-10">
                <div className="flex items-center justify-between gap-10">
                  <div className="space-y-2">
                    <Label className="text-xl font-bold">文字缩��� (Font Scale)</Label>
                    <p className="text-sm text-muted-foreground font-medium">调整系统显示字体的大小比例，以适配你的研读习惯。</p>
                  </div>
                  <div className="w-64 flex items-center gap-6">
                    <Type className="h-5 w-5 text-muted-foreground shrink-0" />
                    <Slider
                      value={[userStats.settings.fontScale]}
                      min={0.8}
                      max={1.2}
                      step={0.1}
                      onValueChange={handleFontScale}
                      className="flex-1"
                    />
                    <span className="font-mono font-bold text-lg text-primary w-12">{userStats.settings.fontScale}x</span>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-border/30 pt-10">
                  <div className="space-y-2">
                    <Label className="text-xl font-bold">沉浸深色模式</Label>
                    <p className="text-sm text-muted-foreground font-medium">根据系统或手动开启护眼模式，减少神识损耗。</p>
                  </div>
                  <Switch
                    checked={userStats.settings.themePreference === 'dark'}
                    onCheckedChange={(checked) => updateSettings({ themePreference: checked ? 'dark' : 'light' })}
                    className="scale-125"
                  />
                </div>
              </div>
            </section>
            <section className="space-y-10">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                  <BellRing className="h-6 w-6" />
                </div>
                <h3 className="text-3xl font-display font-bold">通知与隐私</h3>
              </div>
              <div className="space-y-10">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Label className="text-xl font-bold">隐身修行 (Incognito)</Label>
                    <p className="text-sm text-muted-foreground font-medium">在宗门广场中隐���你的在线状态和当前研读进度。</p>
                  </div>
                  <Switch
                    checked={userStats.settings.privacyMode}
                    onCheckedChange={(checked) => updateSettings({ privacyMode: checked })}
                    className="scale-125"
                  />
                </div>
              </div>
            </section>
            <section className="pt-10 border-t border-border/50">
              <div className="flex items-center gap-4 mb-8">
                <Database className="h-6 w-6 text-primary" />
                <h3 className="text-3xl font-display font-bold">神识管理</h3>
              </div>
              <div className="flex flex-wrap gap-4">
                <Button variant="outline" className="rounded-2xl h-16 px-10 font-bold gap-3 border-primary/10 shadow-sm">
                  <Download className="h-5 w-5" /> 导出全部研习记��
                </Button>
                <Button variant="destructive" className="rounded-2xl h-16 px-10 font-bold gap-3 shadow-lg shadow-destructive/10" onClick={handleReset}>
                  <Trash2 className="h-5 w-5" /> 焚毁神识 (重置)
                </Button>
              </div>
            </section>
          </Card>
        </main>
      </div>
    </div>
  );
}