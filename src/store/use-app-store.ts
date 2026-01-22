import { create } from 'zustand';
import { Task, TimerState, TimerMode } from '@/types/app-types';
import { MOCK_TASKS } from '@/lib/mock-tasks';
interface AppStore {
  tasks: Task[];
  timer: TimerState;
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
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
export const useAppStore = create<AppStore>((set) => ({
  tasks: MOCK_TASKS,
  timer: {
    mode: 'focus',
    timeLeft: POMODORO_TIME,
    isRunning: false,
    activeTaskId: null,
  },
  setTasks: (tasks) => set({ tasks }),
  addTask: (task) => set((state) => ({ tasks: [task, ...state.tasks] })),
  updateTask: (id, updates) => set((state) => ({
    tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
  })),
  completeTask: (id) => set((state) => ({
    tasks: state.tasks.map((t) => (t.id === id ? { ...t, status: 'completed' as const } : t)),
    timer: state.timer.activeTaskId === id ? { ...state.timer, isRunning: false, activeTaskId: null } : state.timer
  })),
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