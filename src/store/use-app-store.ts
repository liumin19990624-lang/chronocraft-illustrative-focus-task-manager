import { create } from 'zustand';
import { Task, TimerState, TimerMode, TaskStatus } from '@/types/app-types';
import { api } from '@/lib/api-client';
interface AppStore {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  timer: TimerState;
  fetchTasks: () => Promise<void>;
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Omit<Task, 'id' | 'status' | 'pomodoroSpent' | 'tags' | 'createdAt'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  completeTask: (id: string) => void;
  startFocus: (taskId: string) => void;
  stopFocus: () => void;
  tick: () => void;
  toggleTimer: () => void;
  setTimerMode: (mode: TimerMode) => void;
}
const POMODORO_TIME = 25 * 60;
const SHORT_BREAK = 5 * 60;
const LONG_BREAK = 15 * 60;
export const useAppStore = create<AppStore>((set, get) => ({
  tasks: [],
  isLoading: true,
  error: null,
  timer: {
    mode: 'focus',
    timeLeft: POMODORO_TIME,
    isRunning: false,
    activeTaskId: null,
  },
  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const tasks = await api<Task[]>('/api/tasks');
      set({ tasks, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      console.error("Failed to fetch tasks", error);
    }
  },
  setTasks: (tasks) => set({ tasks }),
  addTask: async (taskData) => {
    try {
      const newTask = await api<Task>('/api/tasks', {
        method: 'POST',
        body: JSON.stringify(taskData),
      });
      set((state) => ({ tasks: [newTask, ...state.tasks] }));
    } catch (error) {
      console.error("Failed to add task:", error);
    }
  },
  updateTask: async (id, updates) => {
    const originalTasks = get().tasks;
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    }));
    try {
      await api(`/api/tasks/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
      });
    } catch (error) {
      console.error("Failed to update task:", error);
      set({ tasks: originalTasks }); // Rollback on error
    }
  },
  deleteTask: async (id: string) => {
    const originalTasks = get().tasks;
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
    }));
     try {
      await api(`/api/tasks/${id}`, { method: 'DELETE' });
    } catch (error) {
      console.error("Failed to delete task:", error);
      set({ tasks: originalTasks }); // Rollback on error
    }
  },
  completeTask: (id) => {
    get().updateTask(id, { status: 'completed' as TaskStatus });
    if (get().timer.activeTaskId === id) {
      get().stopFocus();
    }
  },
  startFocus: (taskId) => set((state) => ({
    timer: { ...state.timer, activeTaskId: taskId, isRunning: true, mode: 'focus', timeLeft: POMODORO_TIME }
  })),
  stopFocus: () => set((state) => ({
    timer: { ...state.timer, isRunning: false, activeTaskId: null, timeLeft: POMODORO_TIME }
  })),
  tick: () => set((state) => {
    if (!state.timer.isRunning || state.timer.timeLeft <= 0) return state;
    return {
      timer: { ...state.timer, timeLeft: state.timer.timeLeft - 1 }
    };
  }),
  toggleTimer: () => set((state) => ({
    timer: { ...state.timer, isRunning: !state.timer.isRunning }
  })),
  setTimerMode: (mode) => set((state) => ({
    timer: {
      ...state.timer,
      mode,
      timeLeft: mode === 'focus' ? POMODORO_TIME : mode === 'short-break' ? SHORT_BREAK : LONG_BREAK,
      isRunning: false
    }
  })),
}));