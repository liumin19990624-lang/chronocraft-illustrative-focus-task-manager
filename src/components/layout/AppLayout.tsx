import React from "react";
import { cn } from "@/lib/utils";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { MobileNav } from "./MobileNav";
import { FocusOverlay } from "@/components/focus/FocusOverlay";
import { useAppStore } from "@/store/use-app-store";
type AppLayoutProps = {
  children: React.ReactNode;
  container?: boolean;
  className?: string;
  contentClassName?: string;
};
export function AppLayout({ children, container = false, className, contentClassName }: AppLayoutProps): JSX.Element {
  const isFocusActive = useAppStore(s => !!s.timer.activeTaskId);
  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />
      <SidebarInset className={cn(className, "relative")}>
        <div className="absolute left-2 top-2 z-20">
          <SidebarTrigger />
        </div>
        {/* Persistent Focus Overlay */}
        <FocusOverlay />
        <div className={cn(
          "min-h-screen pb-24 md:pb-0 transition-all duration-700",
          isFocusActive && "blur-2xl opacity-40 pointer-events-none scale-95",
          container && "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12",
          contentClassName
        )}>
          {children}
        </div>
        <MobileNav />
      </SidebarInset>
    </SidebarProvider>
  );
}