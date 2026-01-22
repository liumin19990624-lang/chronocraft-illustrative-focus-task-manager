import { create } from 'zustand';
import { Task, TimerState, TimerMode, TaskStatus, UserStats, Achievement } from '@shared/types';
import { api } from '@/lib/api-client';
import { isYesterday, isToday, parseISO, startOfDay } from 'date-fns';
import { toast } from 'sonner';
interface AppStore {
  tasks: Task[];
  userStats: UserStats;
  isLoading: boolean;
  error: string | null;
  timer: TimerState;
  showArchived: boolean;
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
  saveSessionNote: (taskId: string, note: string) => void;
  awardXP: (amount: number) => void;
}
const POMODORO_TIME = 25 * 60;
const SHORT_BREAK = 5 * 60;
const LONG_BREAK = 15 * 60;
const INITIAL_STATS: UserStats = {
  id: 'me',
  level: 1,
  xp: 0,
  streak: 0,
  totalFocusMinutes: 0,
  totalTasksCompleted: 0,
  unlockedAchievements: [],
};
export const useAppStore = create<AppStore>((set, get) => ({
  tasks: [],
  userStats: INITIAL_STATS,
  isLoading: true,
  error: null,
  showArchived: false,
  timer: {
    mode: 'focus',
    timeLeft: POMODORO_TIME,
    isRunning: false,
    activeTaskId: null,
    isPaused: false,
  },
  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const tasks = await api<Task[]>('/api/tasks');
      set({ tasks, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },
  fetchStats: async () => {
    try {
      const stats = await api<UserStats>('/api/stats');
      set({ userStats: stats });
    } catch (error) {
      console.error("Failed to fetch stats", error);
    }
  },
  awardXP: async (amount: number) => {
    const stats = get().userStats;
    const newXP = stats.xp + amount;
    const currentLevel = stats.level;
    const nextLevelXP = currentLevel * 1000;
    let newLevel = currentLevel;
    if (newXP >= nextLevelXP) {
      newLevel = Math.floor(newXP / 1000) + 1;
      if (newLevel > currentLevel) {
        toast.success(`等��提升！`, { description: `恭喜你达到了等级 ${newLevel}，资深建��师！` });
      }
    }
    const updatedStats = { ...stats, xp: newXP, level: newLevel };
    set({ userStats: updatedStats });
    try {
      await api('/api/stats', { method: 'PATCH', body: JSON.stringify(updatedStats) });
    } catch (e) {
      console.error("Failed to sync XP", e);
    }
  },
  addTask: async (taskData) => {
    try {
      const newTask = await api<Task>('/api/tasks', {
        method: 'POST',
        body: JSON.stringify(taskData),
      });
      set((state) => ({ tasks: [newTask, ...state.tasks] }));
    } catch (error) {
      console.error("Add task failed", error);
      throw error;
    }
  },
  updateTask: async (id, updates) => {
    const previousTasks = get().tasks;
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    }));
    try {
      await api(`/api/tasks/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
      });
    } catch (error) {
      set({ tasks: previousTasks });
      throw error;
    }
  },
  deleteTask: async (id) => {
    const previousTasks = get().tasks;
    set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) }));
    try {
      await api(`/api/tasks/${id}`, { method: 'DELETE' });
    } catch (error) {
      set({ tasks: previousTasks });
    }
  },
  completeTask: (id) => {
    const task = get().tasks.find(t => t.id === id);
    if (!task || task.status === 'completed') return;
    get().updateTask(id, { status: 'completed' as TaskStatus, completedAt: new Date().toISOString() });
    get().awardXP(100);
    const stats = get().userStats;
    const lastActive = stats.lastActiveDate ? parseISO(stats.lastActiveDate) : null;
    let newStreak = stats.streak;
    if (!lastActive) {
      newStreak = 1;
    } else if (isYesterday(lastActive)) {
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
    api('/api/stats', { method: 'PATCH', body: JSON.stringify(updatedStats) });
    if (get().timer.activeTaskId === id) {
      get().stopFocus();
    }
  },
  toggleShowArchived: () => set((state) => ({ showArchived: !state.showArchived })),
  startFocus: (taskId) => set((state) => ({
    timer: { ...state.timer, activeTaskId: taskId, isRunning: true, isPaused: false, mode: 'focus', timeLeft: POMODORO_TIME }
  })),
  stopFocus: () => set((state) => ({
    timer: { ...state.timer, isRunning: false, isPaused: false, activeTaskId: null, timeLeft: POMODORO_TIME }
  })),
  tick: () => {
    const { timer, tasks, userStats } = get();
    if (!timer.isRunning || timer.timeLeft <= 0) return;
    const newTime = timer.timeLeft - 1;
    set((state) => ({ timer: { ...state.timer, timeLeft: newTime } }));
    if (newTime === 0 && timer.activeTaskId) {
      const taskId = timer.activeTaskId;
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        get().updateTask(taskId, { pomodoroSpent: task.pomodoroSpent + 1 });
        get().awardXP(50);
        const updatedStats = { ...userStats, totalFocusMinutes: userStats.totalFocusMinutes + 25 };
        set({ userStats: updatedStats });
        api('/api/stats', { method: 'PATCH', body: JSON.stringify(updatedStats) });
      }
    }
  },
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
  })),
  saveSessionNote: (taskId, note) => {
    const task = get().tasks.find(t => t.id === taskId);
    if (task) {
      const newDesc = task.description ? `${task.description}\n\n[Session Note]: ${note}` : `[Session Note]: ${note}`;
      get().updateTask(taskId, { description: newDesc });
    }
  }
}));