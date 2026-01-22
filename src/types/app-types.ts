export type Priority = 1 | 2 | 3 | 4; // 1: Critical, 2: High, 3: Normal, 4: Low
export type TaskStatus = 'todo' | 'in-progress' | 'completed' | 'archived';
export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  status: TaskStatus;
  dueDate: string; // ISO string
  pomodoroEstimate: number; // number of 25m sessions
  pomodoroSpent: number; // sessions completed
  tags: string[];
  createdAt: string;
}
export type TimerMode = 'focus' | 'short-break' | 'long-break';
export interface TimerState {
  mode: TimerMode;
  timeLeft: number; // in seconds
  isRunning: boolean;
  activeTaskId: string | null;
}