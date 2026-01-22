import React from "react";
import { cn } from "@/lib/utils";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { MobileNav } from "./MobileNav";
import { FocusOverlay } from "@/components/focus/FocusOverlay";
import { FloatingAiHub } from "@/components/ai/FloatingAiHub";
import { useAppStore } from "@/store/use-app-store";
import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { WifiOff, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
export function AppLayout(): JSX.Element {
  const isFocusActive = useAppStore(s => !!s.timer.activeTaskId);
  const isOffline = useAppStore(s => s.isOffline);
  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />
      <SidebarInset className="relative">
        <div className="absolute left-2 top-2 z-20">
          <SidebarTrigger />
        </div>
        {/* Offline Banner */}
        <AnimatePresence>
          {isOffline && (
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              className="fixed top-0 left-0 right-0 z-[250] bg-amber-500 text-white px-4 py-2 flex items-center justify-center gap-3 font-bold text-sm shadow-lg"
            >
              <WifiOff className="h-4 w-4" />
              断网潜修模式���部分功能受限，数据将本地保存。
              <AlertTriangle className="h-4 w-4" />
            </motion.div>
          )}
        </AnimatePresence>
        {/* Persistent Focus Overlay always on top */}
        <FocusOverlay />
        {/* Child routes with shared layout */}
        <div className={cn(
          "min-h-screen transition-all duration-700",
          isFocusActive && "blur-2xl opacity-40 pointer-events-none scale-95"
        )}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 md:pb-12">
            <Outlet />
          </div>
        </div>
        {/* Global AI Hub accessible from any route */}
        {!isFocusActive && <FloatingAiHub />}
        <MobileNav />
        <Toaster richColors position="top-center" />
      </SidebarInset>
    </SidebarProvider>
  );
}