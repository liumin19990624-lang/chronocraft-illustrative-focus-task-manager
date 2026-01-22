import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Target, Trophy, Sparkles, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/use-app-store';
export function MobileNav() {
  // Zero-Tolerance selectors
  const lastCheckinDate = useAppStore(s => s.userStats?.lastCheckinDate);
  const today = new Date().toISOString().split('T')[0];
  const needsCheckin = lastCheckinDate !== today;

  const navItems = [
    { label: "大厅", icon: LayoutDashboard, path: "/", hasNotif: false },
    { label: "点卯", icon: Sparkles, path: "/checkin", hasNotif: needsCheckin },
    { label: "任务", icon: Target, path: "/stats", hasNotif: false },
    { label: "成就", icon: Trophy, path: "/achievements", hasNotif: false },
    { label: "我的", icon: User, path: "/settings", hasNotif: false },
  ];
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/70 backdrop-blur-2xl border-t border-border/50 px-4 py-3 pb-8">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "relative flex flex-col items-center gap-1.5 px-3 py-2 rounded-2xl transition-all duration-300",
              isActive ? "text-primary scale-110" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {({ isActive }) => (
              <>
                <div className="relative">
                  <item.icon className={cn("h-6 w-6 transition-all", isActive && "fill-primary/10")} />
                  {item.hasNotif && (
                    <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 bg-red-500 border-2 border-background rounded-full animate-notification-pulse" />
                  )}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="mobile-nav-pill"
                    className="absolute inset-0 bg-primary/10 rounded-2xl -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}