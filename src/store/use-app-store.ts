import { create } from 'zustand';
import { Task, TimerState, TimerMode, TaskStatus, UserStats } from '@shared/types';
import { api } from '@/lib/api-client';
import { isYesterday, isToday, parseISO } from 'date-fns';
import { toast } from 'sonner';
interface AppStore {
  tasks: Task[];
  userStats: UserStats | null;
  isLoading: boolean;
  error: string | null;
  timer: TimerState;
  showArchived: boolean;
  initUser: (nickname: string) => void;
  fetchTasks: () => Promise<void>;
  fetchStats: () => Promise<void>;
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
}
const POMODORO_TIME = 25 * 60;
const SHORT_BREAK = 5 * 60;
const LONG_BREAK = 15 * 60;
export const useAppStore = create<AppStore>((set, get) => ({
  tasks: [],
  userStats: null,
  isLoading: true,
  error: null,
  showArchived: false,
  timer: {
    mode: 'focus',
    timeLeft: POMODORO_TIME,
    isRunning: false,
    activeTaskId: null,
    isPaused: false,
    isDistracted: false,
  },
  initUser: (nickname: string) => {
    const uid = crypto.randomUUID();
    const newUser: UserStats = {
      id: uid,
      nickname,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${nickname}`,
      level: 1,
      xp: 0,
      coins: 0,
      streak: 0,
      totalFocusMinutes: 0,
      totalTasksCompleted: 0,
      unlockedAchievements: [],
    };
    localStorage.setItem('xian_user', JSON.stringify(newUser));
    set({ userStats: newUser });
  },
  fetchTasks: async () => {
    const user = get().userStats;
    if (!user) return;
    set({ isLoading: true, error: null });
    try {
      const tasks = await api<Task[]>(`/api/tasks?userId=${user.id}`);
      set({ tasks, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },
  fetchStats: async () => {
    const localUser = localStorage.getItem('xian_user');
    if (localUser) {
      const parsed = JSON.parse(localUser);
      set({ userStats: parsed });
      try {
        const remote = await api<UserStats>(`/api/stats?userId=${parsed.id}`);
        set({ userStats: remote });
        localStorage.setItem('xian_user', JSON.stringify(remote));
      } catch (e) { console.error("Sync failed", e); }
    }
    set({ isLoading: false });
  },
  awardRewards: async (xpGain: number, coinGain: number) => {
    const stats = get().userStats;
    if (!stats) return;
    const newXP = stats.xp + xpGain;
    const currentLevel = stats.level;
    const newLevel = Math.floor(newXP / 1000) + 1;
    if (newLevel > currentLevel) {
      toast.success(`境界突破��`, { description: `恭喜道友晋升至第 ${newLevel} 重天！` });
    }
    const updatedStats = { 
      ...stats, 
      xp: newXP, 
      level: newLevel, 
      coins: stats.coins + coinGain 
    };
    set({ userStats: updatedStats });
    localStorage.setItem('xian_user', JSON.stringify(updatedStats));
    api('/api/stats', { method: 'PATCH', body: JSON.stringify(updatedStats) });
  },
  addTask: async (taskData) => {
    const user = get().userStats;
    if (!user) return;
    try {
      const newTask = await api<Task>('/api/tasks', {
        method: 'POST',
        body: JSON.stringify({ ...taskData, userId: user.id, status: 0 }),
      });
      set((state) => ({ tasks: [newTask, ...state.tasks] }));
    } catch (error) {
      console.error("Add task failed", error);
      throw error;
    }
  },
  updateTask: async (id, updates) => {
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    }));
    try {
      await api(`/api/tasks/${id}`, { method: 'PATCH', body: JSON.stringify(updates) });
    } catch (error) {
      get().fetchTasks();
    }
  },
  deleteTask: async (id) => {
    set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) }));
    try {
      await api(`/api/tasks/${id}`, { method: 'DELETE' });
    } catch (error) {
      get().fetchTasks();
    }
  },
  completeTask: (id) => {
    const task = get().tasks.find(t => t.id === id);
    if (!task || task.status === 2) return;
    get().updateTask(id, { status: 2, completedAt: new Date().toISOString() });
    get().awardRewards(150, 50);
    const stats = get().userStats;
    if (!stats) return;
    const lastActive = stats.lastActiveDate ? parseISO(stats.lastActiveDate) : null;
    let newStreak = stats.streak;
    if (!lastActive || isYesterday(lastActive)) {
      newStreak += 1;
    } else if (!isToday(lastActive)) {
      newStreak = 1;
    }
    const updatedStats = {
      ...stats,
      streak: newStreak,
      totalTasksCompleted: stats.totalTasksCompleted + 1,
      lastActiveDate: new Date().toISOString()
    };
    set({ userStats: updatedStats });
    localStorage.setItem('xian_user', JSON.stringify(updatedStats));
    if (get().timer.activeTaskId === id) get().stopFocus();
  },
  toggleShowArchived: () => set((state) => ({ showArchived: !state.showArchived })),
  startFocus: (taskId) => set((state) => ({
    timer: { ...state.timer, activeTaskId: taskId, isRunning: true, isPaused: false, mode: 'focus', timeLeft: POMODORO_TIME, isDistracted: false }
  })),
  stopFocus: () => set((state) => ({
    timer: { ...state.timer, isRunning: false, isPaused: false, activeTaskId: null, timeLeft: POMODORO_TIME, isDistracted: false }
  })),
  tick: () => {
    const { timer, tasks } = get();
    if (!timer.isRunning || timer.isPaused || timer.timeLeft <= 0) return;
    const newTime = timer.timeLeft - 1;
    set((state) => ({ timer: { ...state.timer, timeLeft: newTime } }));
    if (newTime === 0 && timer.activeTaskId) {
      const task = tasks.find(t => t.id === timer.activeTaskId);
      if (task) {
        get().updateTask(task.id, { pomodoroSpent: task.pomodoroSpent + 1 });
        get().awardRewards(100, 20);
      }
    }
  },
  setDistracted: (distracted) => set((state) => ({
    timer: { ...state.timer, isDistracted: distracted, isPaused: distracted, isRunning: !distracted }
  })),
  toggleTimer: () => set((state) => ({
    timer: { ...state.timer, isRunning: !state.timer.isRunning, isPaused: state.timer.isRunning }
  })),
  setTimerMode: (mode) => set((state) => ({
    timer: {
      ...state.timer,
      mode,
      timeLeft: mode === 'focus' ? POMODORO_TIME : mode === 'short-break' ? SHORT_BREAK : LONG_BREAK,
      isRunning: false,
      isPaused: false
    }
  }))
}));