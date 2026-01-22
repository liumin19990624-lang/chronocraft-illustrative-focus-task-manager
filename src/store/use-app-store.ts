import { create } from 'zustand';
import { Task, TimerState, TimerMode, UserStats, SocialPost, UserSettings, AiAssistantResult, AiTaskType } from '@shared/types';
import { api } from '@/lib/api-client';
import { isYesterday, isToday, parseISO } from 'date-fns';
import { toast } from 'sonner';
import { MOCK_AI_RESPONSES, ACHIEVEMENT_LIST } from '@/lib/mock-academic';
interface AppStore {
  tasks: Task[];
  socialPosts: SocialPost[];
  userStats: UserStats | null;
  isLoading: boolean;
  error: string | null;
  timer: TimerState;
  showArchived: boolean;
  initUser: (nickname: string) => void;
  fetchTasks: () => Promise<void>;
  fetchStats: () => Promise<void>;
  fetchPosts: () => Promise<void>;
  createPost: (post: Partial<SocialPost>) => Promise<void>;
  likePost: (id: string) => Promise<void>;
  updateSettings: (settings: Partial<UserSettings>) => Promise<void>;
  addTask: (taskData: Partial<Task>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  completeTask: (id: string) => void;
  toggleShowArchived: () => void;
  startFocus: (taskId: string) => void;
  stopFocus: () => void;
  tick: () => void;
  toggleTimer: () => void;
  setTimerMode: (mode: TimerMode) => void;
  setDistracted: (distracted: boolean) => void;
  awardRewards: (xp: number, coins: number) => void;
  requestAiAssistant: (text: string, type: AiTaskType) => Promise<AiAssistantResult>;
  completePomodoro: () => Promise<void>;
  checkAchievements: () => void;
}
const POMODORO_TIME = 25 * 60;
const DEFAULT_SETTINGS: UserSettings = { fontScale: 1.0, themePreference: 'system', privacyMode: false, notificationsEnabled: true, accentColor: '#88C0D0' };
export const useAppStore = create<AppStore>((set, get) => ({
  tasks: [],
  socialPosts: [],
  userStats: null,
  isLoading: true,
  error: null,
  showArchived: false,
  timer: { mode: 'focus', timeLeft: POMODORO_TIME, isRunning: false, activeTaskId: null, isPaused: false, isDistracted: false },
  initUser: (nickname: string) => {
    const newUser: UserStats = {
      id: crypto.randomUUID(), nickname, avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${nickname}`,
      level: 1, xp: 0, coins: 0, streak: 0, totalFocusMinutes: 0, totalTasksCompleted: 0, unlockedAchievements: [], settings: DEFAULT_SETTINGS,
    };
    localStorage.setItem('xian_user', JSON.stringify(newUser));
    set({ userStats: newUser });
  },
  fetchTasks: async () => {
    const user = get().userStats;
    if (!user) return;
    set({ isLoading: true });
    try {
      const tasks = await api<Task[]>(`/api/tasks?userId=${user.id}`);
      set({ tasks, isLoading: false });
    } catch (e) { set({ error: "Failed to load tasks", isLoading: false }); }
  },
  fetchStats: async () => {
    const localUserStr = localStorage.getItem('xian_user');
    let localStats: UserStats | null = null;
    if (localUserStr) {
      try { localStats = JSON.parse(localUserStr); } catch (e) { console.error(e); }
    }
    try {
      const remote = await api<UserStats>(`/api/stats?userId=${localStats?.id || 'me'}`);
      // Deep merge logic to prevent data loss
      const merged = { ...localStats, ...remote, settings: { ...localStats?.settings, ...remote.settings } };
      set({ userStats: merged });
      localStorage.setItem('xian_user', JSON.stringify(merged));
    } catch (e) {
      if (localStats) set({ userStats: localStats });
      console.warn("[CONSOLE] Local state active, sync deferred", e);
    }
    set({ isLoading: false });
  },
  fetchPosts: async () => {
    try {
      const posts = await api<SocialPost[]>('/api/community');
      set({ socialPosts: posts });
    } catch (e) { console.error(e); }
  },
  createPost: async (postData) => {
    const user = get().userStats;
    if (!user) return;
    try {
      const newPost = await api<SocialPost>('/api/community', {
        method: 'POST',
        body: JSON.stringify({ ...postData, userId: user.id, userName: user.nickname, userAvatar: user.avatar })
      });
      set(state => ({ socialPosts: [newPost, ...state.socialPosts] }));
    } catch (e) { console.error(e); }
  },
  likePost: async (id) => {
    set(state => ({ socialPosts: state.socialPosts.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p) }));
    try { await api(`/api/community/${id}/like`, { method: 'POST' }); } catch (e) { get().fetchPosts(); }
  },
  updateSettings: async (updates) => {
    const stats = get().userStats;
    if (!stats) return;
    const newStats = { ...stats, settings: { ...stats.settings, ...updates } };
    set({ userStats: newStats });
    localStorage.setItem('xian_user', JSON.stringify(newStats));
    try { await api('/api/stats', { method: 'PATCH', body: JSON.stringify({ settings: updates }) }); } catch (e) { console.error(e); }
  },
  awardRewards: async (xpGain, coinGain) => {
    const stats = get().userStats;
    if (!stats) return;
    const newXP = stats.xp + xpGain;
    const newLevel = Math.floor(newXP / 1000) + 1;
    const updated = { ...stats, xp: newXP, level: newLevel, coins: stats.coins + coinGain };
    set({ userStats: updated });
    localStorage.setItem('xian_user', JSON.stringify(updated));
    api('/api/stats', { method: 'PATCH', body: JSON.stringify({ xp: updated.xp, level: updated.level, coins: updated.coins }) });
    get().checkAchievements();
  },
  addTask: async (taskData) => {
    const user = get().userStats;
    if (!user) return;
    const newTask = await api<Task>('/api/tasks', { method: 'POST', body: JSON.stringify({ ...taskData, userId: user.id, status: 0 }) });
    set(s => ({ tasks: [newTask, ...s.tasks] }));
  },
  updateTask: async (id, updates) => {
    set(s => ({ tasks: s.tasks.map(t => t.id === id ? { ...t, ...updates } : t) }));
    try { await api(`/api/tasks/${id}`, { method: 'PATCH', body: JSON.stringify(updates) }); } catch (e) { get().fetchTasks(); }
  },
  deleteTask: async (id) => {
    set(s => ({ tasks: s.tasks.filter(t => t.id !== id) }));
    try { await api(`/api/tasks/${id}`, { method: 'DELETE' }); } catch (e) { get().fetchTasks(); }
  },
  completeTask: (id) => {
    const task = get().tasks.find(t => t.id === id);
    if (!task || task.status === 2) return;
    get().updateTask(id, { status: 2, completedAt: new Date().toISOString() });
    get().awardRewards(150, 50);
    set(s => ({ userStats: s.userStats ? { ...s.userStats, totalTasksCompleted: s.userStats.totalTasksCompleted + 1 } : null }));
  },
  completePomodoro: async () => {
    const { timer, tasks, userStats } = get();
    if (!timer.activeTaskId) return;
    const task = tasks.find(t => t.id === timer.activeTaskId);
    if (task) {
      const newSpent = task.pomodoroSpent + 1;
      await get().updateTask(task.id, { pomodoroSpent: newSpent });
      // Calculate reward based on spirit/quality (mocked 100 here for simplicity)
      const xpReward = 100;
      const coinReward = 20;
      await get().awardRewards(xpReward, coinReward);
      if (userStats) {
        const updatedStats = { ...userStats, totalFocusMinutes: userStats.totalFocusMinutes + 25 };
        set({ userStats: updatedStats });
        localStorage.setItem('xian_user', JSON.stringify(updatedStats));
      }
    }
    get().stopFocus();
  },
  checkAchievements: () => {
    const { userStats, tasks } = get();
    if (!userStats) return;
    const currentUnlocked = userStats.unlockedAchievements;
    const newUnlocks: string[] = [];
    // Simple logic checks
    if (userStats.level >= 5 && !currentUnlocked.includes('a2')) newUnlocks.push('a2');
    if (userStats.totalTasksCompleted >= 10 && !currentUnlocked.includes('a3')) newUnlocks.push('a3');
    if (newUnlocks.length > 0) {
      const updated = { ...userStats, unlockedAchievements: [...currentUnlocked, ...newUnlocks] };
      set({ userStats: updated });
      localStorage.setItem('xian_user', JSON.stringify(updated));
      newUnlocks.forEach(id => {
        const ach = ACHIEVEMENT_LIST.find(a => a.id === id);
        if (ach) toast.success(`��就解锁: ${ach.name}`, { description: ach.description });
      });
    }
  },
  requestAiAssistant: async (text, type) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const responseContent = MOCK_AI_RESPONSES[type] || "笔��由于法力不支，未能给出回应。";
        const result: AiAssistantResult = {
          taskId: crypto.randomUUID(),
          type,
          content: responseContent,
          originalText: text,
          metadata: type === 'evaluate' ? {
            score: { grammar: 92, logic: 95, originality: 98 },
            suggestions: ["逻辑严密", "原创度高"]
          } : undefined
        };
        resolve(result);
      }, 2000);
    });
  },
  toggleShowArchived: () => set(s => ({ showArchived: !s.showArchived })),
  startFocus: (taskId) => set(s => ({ timer: { ...s.timer, activeTaskId: taskId, isRunning: true, isPaused: false, mode: 'focus', timeLeft: POMODORO_TIME, isDistracted: false } })),
  stopFocus: () => set(s => ({ timer: { ...s.timer, isRunning: false, activeTaskId: null, timeLeft: POMODORO_TIME, isDistracted: false } })),
  tick: () => {
    const { timer } = get();
    if (!timer.isRunning || timer.isPaused || timer.timeLeft <= 0) return;
    set(s => ({ timer: { ...s.timer, timeLeft: s.timer.timeLeft - 1 } }));
  },
  setDistracted: (distracted) => set(s => ({ timer: { ...s.timer, isDistracted: distracted, isPaused: distracted, isRunning: !distracted } })),
  toggleTimer: () => set(s => ({ timer: { ...s.timer, isRunning: !s.timer.isRunning, isPaused: s.timer.isRunning } })),
  setTimerMode: (mode) => set(s => ({ timer: { ...s.timer, mode, timeLeft: mode === 'focus' ? POMODORO_TIME : 300, isRunning: false } }))
}));