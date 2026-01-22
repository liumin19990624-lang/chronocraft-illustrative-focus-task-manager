import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sparkles, X, Download } from 'lucide-react';
export function PWAPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [show, setShow] = useState(false);
  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Only show if not already installed
      if (!window.matchMedia('(display-mode: standalone)').matches) {
        setShow(true);
      }
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);
  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShow(false);
    }
    setDeferredPrompt(null);
  };
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] w-[90%] max-w-md"
        >
          <div className="bg-primary text-primary-foreground p-6 rounded-[2rem] shadow-2xl flex items-center gap-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
            <div className="p-3 bg-white/20 rounded-xl relative z-10">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1 relative z-10">
              <h3 className="font-display font-bold text-lg leading-tight">将 ChronoCraft 固化到桌面</h3>
              <p className="text-white/70 text-xs font-medium mt-1">获得沉浸式的完整构筑体验</p>
            </div>
            <div className="flex gap-2 relative z-10">
              <Button size="sm" variant="secondary" className="rounded-xl font-bold gap-2" onClick={handleInstall}>
                <Download className="h-4 w-4" /> 安装
              </Button>
              <Button size="icon" variant="ghost" className="rounded-xl hover:bg-white/10" onClick={() => setShow(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}