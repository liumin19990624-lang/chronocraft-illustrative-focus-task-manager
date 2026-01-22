import React from "react";
import { cn } from "@/lib/utils";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { MobileNav } from "./MobileNav";
import { FocusOverlay } from "@/components/focus/FocusOverlay";
import { useAppStore } from "@/store/use-app-store";
import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
export function AppLayout(): JSX.Element {
  const isFocusActive = useAppStore(s => !!s.timer.activeTaskId);
  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />
      <SidebarInset className="relative">
        <div className="absolute left-2 top-2 z-20">
          <SidebarTrigger />
        </div>
        {/* Persistent Focus Overlay always on top */}
        <FocusOverlay />
        {/* Child routes with shared layout */}
        <div className={cn(
          "min-h-screen pb-24 md:pb-0 transition-all duration-700",
          isFocusActive && "blur-2xl opacity-40 pointer-events-none scale-95"
        )}>
          <Outlet />
        </div>
        <MobileNav />
        <Toaster richColors position="top-center" />
      </SidebarInset>
    </SidebarProvider>
  );
}