import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sparkles } from 'lucide-react';
import { useAppStore } from '@/store/use-app-store';
import { toast } from 'sonner';
export function RegisterDialog() {
  const [nickname, setNickname] = React.useState('');
  const initUser = useAppStore(s => s.initUser);
  const userStats = useAppStore(s => s.userStats);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nickname.trim().length < 2) {
      toast.error("道号太短，恐怕难载天命");
      return;
    }
    initUser(nickname.trim());
    toast.success(`欢迎踏入仙途，${nickname}道友！`);
  };
  return (
    <Dialog open={!userStats}>
      <DialogContent className="sm:max-w-[425px] rounded-5xl border-none shadow-2xl p-8" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader className="space-y-4">
          <div className="mx-auto bg-primary/10 h-20 w-20 rounded-3xl flex items-center justify-center shadow-inner rotate-[-4deg]">
            <Sparkles className="h-10 w-10 text-primary" />
          </div>
          <div className="text-center space-y-2">
            <DialogTitle className="text-4xl font-display font-bold">��识仙缘</DialogTitle>
            <DialogDescription className="text-lg">
              请赐予你在 ChronoCraft 世界中的“道号”，开启你的修仙构筑之旅。
            </DialogDescription>
          </div>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-8 py-6">
          <div className="space-y-3">
            <Label htmlFor="nickname" className="text-sm font-bold uppercase tracking-widest text-muted-foreground ml-1">
              修行道号
            </Label>
            <Input
              id="nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="输入你的名号..."
              className="rounded-2xl h-16 bg-secondary/50 border-none text-xl font-bold px-6 focus-visible:ring-primary/20"
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button type="submit" className="w-full h-16 rounded-3xl text-xl font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all">
              踏入仙途
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}