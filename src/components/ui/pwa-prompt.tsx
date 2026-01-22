import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sparkles, X, Download } from 'lucide-react';
export function PWAPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [show, setShow] = useState(false);
  useEffect(() => {
    // Check if user dismissed it this session
    const isDismissed = sessionStorage.getItem('pwa_prompt_dismissed');
    if (isDismissed) return;
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
  const handleDismiss = () => {
    setShow(false);
    sessionStorage.setItem('pwa_prompt_dismissed', 'true');
  };
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] w-[95%] max-w-md"
        >
          <div className="bg-primary text-primary-foreground p-6 rounded-[2.5rem] shadow-2xl flex items-center gap-6 relative overflow-hidden group border border-white/10">
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
            <div className="p-3 bg-white/20 rounded-2xl relative z-10 shrink-0">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1 relative z-10">
              <h3 className="font-display font-bold text-xl leading-tight">固化 ChronoCraft</h3>
              <p className="text-white/70 text-xs font-medium mt-1">获得��浸式修仙体验</p>
            </div>
            <div className="flex gap-2 relative z-10 shrink-0">
              <Button size="sm" variant="secondary" className="rounded-xl font-bold gap-2 px-4" onClick={handleInstall}>
                <Download className="h-4 w-4" /> 安装
              </Button>
              <Button size="icon" variant="ghost" className="rounded-xl hover:bg-white/10 h-10 w-10" onClick={handleDismiss}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}