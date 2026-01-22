import React from "react";
import { LayoutDashboard, BarChart3, Settings, Sparkles, Flame, Trophy } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Progress } from "@/components/ui/progress";
import { useAppStore } from "@/store/use-app-store";
import { cn } from "@/lib/utils";
export function AppSidebar(): JSX.Element {
  const location = useLocation();
  const level = useAppStore(s => s.userStats.level);
  const xp = useAppStore(s => s.userStats.xp);
  const streak = useAppStore(s => s.userStats.streak);
  const nextLevelXP = level * 1000;
  const progress = (xp % 1000) / 10;
  const menuItems = [
    { title: "���作台", icon: LayoutDashboard, path: "/" },
    { title: "时间视野", icon: BarChart3, path: "/stats" },
  ];
  return (
    <Sidebar className="border-r border-border/50">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary rounded-xl text-primary-foreground shadow-lg rotate-[-5deg]">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight">ChronoCraft</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-3">
        <SidebarGroup>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton 
                  asChild 
                  isActive={location.pathname === item.path}
                  className={cn(
                    "rounded-xl h-12 px-4 transition-all",
                    location.pathname === item.path ? "bg-primary text-primary-foreground shadow-md" : "hover:bg-accent"
                  )}
                >
                  <Link to={item.path}>
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-6 space-y-6 bg-accent/30">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-yellow-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">等级 {level}</span>
            </div>
            <span className="text-[10px] font-bold text-muted-foreground">{xp % 1000} / 1000 XP</span>
          </div>
          <Progress value={progress} className="h-1.5 rounded-full" />
        </div>
        <div className="flex items-center gap-3 p-3 bg-background/50 rounded-2xl border border-border/50">
          <div className="p-2 bg-orange-500/10 rounded-lg">
            <Flame className="h-4 w-4 text-orange-500" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">连续构筑</p>
            <p className="font-display font-bold text-sm leading-none mt-0.5">{streak} 天</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}