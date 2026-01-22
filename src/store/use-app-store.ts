import { create } from 'zustand';
import { Task, TimerState, TimerMode, TaskStatus } from '@shared/types';
import { api } from '@/lib/api-client';
interface AppStore {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  timer: TimerState;
  showArchived: boolean;
  fetchTasks: () => Promise<void>;
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
}
const POMODORO_TIME = 25 * 60;
const SHORT_BREAK = 5 * 60;
const LONG_BREAK = 15 * 60;
export const useAppStore = create<AppStore>((set, get) => ({
  tasks: [],
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
    get().updateTask(id, { status: 'completed' as TaskStatus, completedAt: new Date().toISOString() });
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
    const { timer, tasks } = get();
    if (!timer.isRunning || timer.timeLeft <= 0) return;
    const newTime = timer.timeLeft - 1;
    set((state) => ({ timer: { ...state.timer, timeLeft: newTime } }));
    if (newTime === 0 && timer.activeTaskId) {
      const taskId = timer.activeTaskId;
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        get().updateTask(taskId, { pomodoroSpent: task.pomodoroSpent + 1 });
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