import { create } from 'zustand';
import { Task, TimerState, TimerMode, UserStats, SocialPost, UserSettings, AiAssistantResult, AiTaskType, AiRole } from '@shared/types';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';
import { MOCK_AI_RESPONSES, ACHIEVEMENT_LIST } from '@/lib/mock-academic';
interface AppStore {
  tasks: Task[];
  socialPosts: SocialPost[];
  userStats: UserStats | null;
  isLoading: boolean;
  isOffline: boolean;
  isSyncing: boolean;
  error: string | null;
  timer: TimerState;
  showArchived: boolean;
  isStreaming: boolean;
  isCheckingIn: boolean;
  streamingContent: string;
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
  drainSpirit: (amount: number) => void;
  awardRewards: (xp: number, coins: number) => void;
  requestAiAssistant: (text: string, type: AiTaskType, role?: AiRole) => Promise<AiAssistantResult>;
  performCheckin: () => Promise<void>;
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
  isOffline: false,
  isSyncing: false,
  error: null,
  showArchived: false,
  timer: { mode: 'focus', timeLeft: POMODORO_TIME, isRunning: false, activeTaskId: null, isPaused: false, isDistracted: false, spiritHealth: 100 },
  isStreaming: false,
  isCheckingIn: false,
  streamingContent: '',
  initUser: (nickname: string) => {
    const newUser: UserStats = {
      id: 'me', nickname, avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${nickname}`,
      level: 1, xp: 0, coins: 0, streak: 0, totalFocusMinutes: 0, totalTasksCompleted: 0, unlockedAchievements: [],
      checkinHistory: [], focusHistory: {}, lastActiveDate: new Date().toISOString(), settings: DEFAULT_SETTINGS,
    };
    localStorage.setItem('xian_user', JSON.stringify(newUser));
    set({ userStats: newUser });
    api('/api/stats', { method: 'PATCH', body: JSON.stringify({ nickname, avatar: newUser.avatar }) }).catch(() => set({ isOffline: true }));
  },
  fetchTasks: async () => {
    const user = get().userStats;
    if (!user) return;
    set({ isLoading: true });
    try {
      const tasks = await api<Task[]>(`/api/tasks?userId=${user.id}`);
      set({ tasks, isLoading: false, isOffline: false });
    } catch (e) {
      set({ error: "Working Offline", isLoading: false, isOffline: true });
    }
  },
  fetchStats: async () => {
    const localUserStr = localStorage.getItem('xian_user');
    let localStats: UserStats | null = null;
    if (localUserStr) {
      try { localStats = JSON.parse(localUserStr); } catch (e) { console.error(e); }
    }
    try {
      const remote = await api<UserStats>('/api/stats');
      const remoteStats = { ...remote, focusHistory: remote.focusHistory ?? {} };
      const merged = { ...localStats, ...remoteStats, settings: { ...localStats?.settings, ...remoteStats.settings } };
      set({ userStats: merged as UserStats, isOffline: false });
      localStorage.setItem('xian_user', JSON.stringify(merged));
    } catch (e) {
      if (localStats) set({ userStats: { ...localStats, focusHistory: localStats.focusHistory ?? {} }, isOffline: true });
    }
    set({ isLoading: false });
  },
  fetchPosts: async () => {
    try {
      const posts = await api<SocialPost[]>('/api/community');
      set({ socialPosts: posts, isOffline: false });
    } catch (e) { set({ isOffline: true }); }
  },
  createPost: async (postData) => {
    const user = get().userStats;
    if (!user) return;
    try {
      const newPost = await api<SocialPost>('/api/community', {
        method: 'POST',
        body: JSON.stringify({ ...postData, userId: user.id, userName: user.nickname, userAvatar: user.avatar })
      });
      set(state => ({ socialPosts: [newPost, ...state.socialPosts], isOffline: false }));
    } catch (e) { 
      set({ isOffline: true });
      toast.error("网络波动��发布失败");
    }
  },
  likePost: async (id) => {
    set(state => ({ socialPosts: state.socialPosts.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p) }));
    try { await api(`/api/community/${id}/like`, { method: 'POST' }); } catch (e) { set({ isOffline: true }); }
  },
  updateSettings: async (updates) => {
    const stats = get().userStats;
    if (!stats) return;
    const newStats = { ...stats, settings: { ...stats.settings, ...updates } };
    set({ userStats: newStats });
    localStorage.setItem('xian_user', JSON.stringify(newStats));
    try { await api('/api/stats', { method: 'PATCH', body: JSON.stringify({ settings: updates }) }); } catch (e) { set({ isOffline: true }); }
  },
  awardRewards: async (xpGain, coinGain) => {
    const stats = get().userStats;
    if (!stats) return;
    const newXP = stats.xp + xpGain;
    const newLevel = Math.floor(newXP / 1000) + 1;
    const updated = { ...stats, xp: newXP, level: newLevel, coins: stats.coins + coinGain, lastActiveDate: new Date().toISOString() };
    set({ userStats: updated });
    localStorage.setItem('xian_user', JSON.stringify(updated));
    try {
      await api('/api/stats', { method: 'PATCH', body: JSON.stringify({ xp: updated.xp, level: updated.level, coins: updated.coins, lastActiveDate: updated.lastActiveDate }) });
      set({ isOffline: false });
    } catch(e) { set({ isOffline: true }); }
    get().checkAchievements();
  },
  addTask: async (taskData) => {
    const user = get().userStats;
    if (!user) return;
    try {
      const newTask = await api<Task>('/api/tasks', { method: 'POST', body: JSON.stringify({ ...taskData, userId: user.id, status: 0 }) });
      set(s => ({ tasks: [newTask, ...s.tasks], isOffline: false }));
    } catch(e) {
      set({ isOffline: true });
      const localTask: Task = {
        id: crypto.randomUUID(), userId: user.id, title: taskData.title || "", priority: taskData.priority || 3,
        status: 0, type: taskData.type || 'other', dueDate: taskData.dueDate || new Date().toISOString(),
        dueTime: taskData.dueTime || "09:00", pomodoroEstimate: taskData.pomodoroEstimate || 1,
        pomodoroSpent: 0, tags: taskData.tags || [], isArchived: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
      };
      set(s => ({ tasks: [localTask, ...s.tasks] }));
      toast.info("已保存至本地结界", { description: "网络恢复后将同步至宗门。" });
    }
  },
  updateTask: async (id, updates) => {
    set(s => ({ tasks: s.tasks.map(t => t.id === id ? { ...t, ...updates } : t) }));
    try { await api(`/api/tasks/${id}`, { method: 'PATCH', body: JSON.stringify(updates) }); set({ isOffline: false }); } catch (e) { set({ isOffline: true }); }
  },
  deleteTask: async (id) => {
    set(s => ({ tasks: s.tasks.filter(t => t.id !== id) }));
    try { await api(`/api/tasks/${id}`, { method: 'DELETE' }); set({ isOffline: false }); } catch (e) { set({ isOffline: true }); }
  },
  completeTask: (id) => {
    const task = get().tasks.find(t => t.id === id);
    if (!task || task.status === 2) return;
    get().updateTask(id, { status: 2, completedAt: new Date().toISOString(), isArchived: true });
    get().awardRewards(150, 50);
    set(s => ({ userStats: s.userStats ? { ...s.userStats, totalTasksCompleted: s.userStats.totalTasksCompleted + 1 } : null }));
  },
  completePomodoro: async () => {
    const { timer, tasks, userStats } = get();
    if (!timer.activeTaskId) return;
    const today = new Date().toISOString().split('T')[0];
    const task = tasks.find(t => t.id === timer.activeTaskId);
    if (task) {
      await get().updateTask(task.id, { pomodoroSpent: task.pomodoroSpent + 1 });
      const spiritBonus = Math.floor(timer.spiritHealth / 10);
      await get().awardRewards(100 + spiritBonus * 10, 20 + spiritBonus);
      if (userStats) {
        const history = { ...(userStats.focusHistory ?? {}) };
        history[today] = (history[today] || 0) + 25;
        const updatedStats = { ...userStats, totalFocusMinutes: userStats.totalFocusMinutes + 25, focusHistory: history };
        set({ userStats: updatedStats });
        localStorage.setItem('xian_user', JSON.stringify(updatedStats));
        api('/api/stats', { method: 'PATCH', body: JSON.stringify({ focusHistory: history, totalFocusMinutes: updatedStats.totalFocusMinutes }) }).catch(() => set({ isOffline: true }));
      }
    }
    get().stopFocus();
  },
  checkAchievements: () => {
    const { userStats } = get();
    if (!userStats) return;
    const currentUnlocked = userStats.unlockedAchievements ?? [];
    const newUnlocks: string[] = [];
    if (userStats.level >= 5 && !currentUnlocked.includes('a2')) newUnlocks.push('a2');
    if (userStats.totalTasksCompleted >= 10 && !currentUnlocked.includes('a3')) newUnlocks.push('a3');
    if (userStats.streak >= 7 && !currentUnlocked.includes('a1')) newUnlocks.push('a1');
    if (userStats.totalFocusMinutes >= 1500 && !currentUnlocked.includes('a5')) newUnlocks.push('a5');
    if (newUnlocks.length > 0) {
      const updated = { ...userStats, unlockedAchievements: [...currentUnlocked, ...newUnlocks] };
      set({ userStats: updated });
      localStorage.setItem('xian_user', JSON.stringify(updated));
      newUnlocks.forEach(id => {
        const ach = ACHIEVEMENT_LIST.find(a => a.id === id);
        if (ach) toast.success(`成就解锁: ${ach.name}`, { description: ach.description });
      });
    }
  },
  requestAiAssistant: async (text, type, role = 'mentor') => {
    set({ isStreaming: true, streamingContent: '' });
    const responseContent = MOCK_AI_RESPONSES[type] || "笔灵元��不足，未能给出回应。";
    return new Promise((resolve) => {
      let index = 0;
      const interval = setInterval(() => {
        if (index < responseContent.length) {
          set(s => ({ streamingContent: s.streamingContent + responseContent[index] }));
          index++;
        } else {
          clearInterval(interval);
          set({ isStreaming: false });
          const result: AiAssistantResult = {
            taskId: crypto.randomUUID(), type, content: responseContent, originalText: text,
            versions: type === 'modify' ? [ responseContent, "改写版2", "改写版3" ] : undefined,
            metadata: { score: { grammar: 92, logic: 95, originality: 98, innovation: 88 }, suggestions: ["逻辑严密", "原创度高"] }
          };
          resolve(result);
        }
      }, 30);
    });
  },
  performCheckin: async () => {
    const stats = get().userStats;
    if (!stats) return;
    const today = new Date().toISOString().split('T')[0];
    if (stats.lastCheckinDate === today) {
      toast.info("今日已领过��旨", { description: "道友明日再来。" });
      return;
    }
    set({ isCheckingIn: true });
    try {
      const res = await api<UserStats>('/api/checkin', { method: 'POST' });
      const statsWithHistory = { ...res, focusHistory: res.focusHistory ?? {} };
      set({ userStats: statsWithHistory, isOffline: false });
      localStorage.setItem('xian_user', JSON.stringify(statsWithHistory));
      toast.success("掌门令准���");
    } catch (e) {
      set({ isOffline: true });
      toast.error("网络波动，本地法旨生效");
    } finally {
      set({ isCheckingIn: false });
    }
  },
  toggleShowArchived: () => set(s => ({ showArchived: !s.showArchived })),
  startFocus: (taskId) => set(s => ({ timer: { ...s.timer, activeTaskId: taskId, isRunning: true, isPaused: false, mode: 'focus', timeLeft: POMODORO_TIME, isDistracted: false, spiritHealth: 100 } })),
  stopFocus: () => set(s => ({ timer: { ...s.timer, isRunning: false, activeTaskId: null, timeLeft: POMODORO_TIME, isDistracted: false } })),
  tick: () => {
    const { timer } = get();
    if (!timer.isRunning || timer.isPaused || timer.timeLeft <= 0) return;
    set(s => ({ timer: { ...s.timer, timeLeft: s.timer.timeLeft - 1, spiritHealth: s.timer.mode !== 'focus' ? Math.min(100, s.timer.spiritHealth + 0.1) : s.timer.spiritHealth } }));
  },
  drainSpirit: (amount) => set(s => ({ timer: { ...s.timer, spiritHealth: Math.max(0, s.timer.spiritHealth - amount) } })),
  setDistracted: (distracted) => set(s => ({ timer: { ...s.timer, isDistracted: distracted, isPaused: distracted, isRunning: !distracted } })),
  toggleTimer: () => set(s => ({ timer: { ...s.timer, isRunning: !s.timer.isRunning, isPaused: s.timer.isRunning } })),
  setTimerMode: (mode) => set(s => ({ timer: { ...s.timer, mode, timeLeft: mode === 'focus' ? POMODORO_TIME : 300, isRunning: false } }))
}));