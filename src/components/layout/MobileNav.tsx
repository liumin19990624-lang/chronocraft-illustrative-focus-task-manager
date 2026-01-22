import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Target, Trophy, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
export function MobileNav() {
  const navItems = [
    { label: "大厅", icon: LayoutDashboard, path: "/" },
    { label: "任务", icon: Target, path: "/stats" },
    { label: "成就", icon: Trophy, path: "/achievements" },
    { label: "资料", icon: BookOpen, path: "/resources" },
  ];
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/80 backdrop-blur-2xl border-t border-border/50 px-4 py-3 pb-8">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "relative flex flex-col items-center gap-1.5 px-4 py-2 rounded-2xl transition-all duration-300",
              isActive ? "text-primary scale-110" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {({ isActive }) => (
              <>
                <item.icon className={cn("h-6 w-6", isActive && "fill-primary/10")} />
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