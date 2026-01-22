export type Priority = 1 | 2 | 3 | 4; // 1: 紧急 (Red), 2: 高 (Blue), 3: 普通 (Gray), 4: 随意 (Green)
export type TaskStatus = 'todo' | 'in-progress' | 'completed' | 'archived';
export type TaskType = 'reading' | 'listening' | 'writing' | 'other';
export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  status: TaskStatus;
  type: TaskType;
  dueDate: string; // ISO string
  dueTime: string; // HH:mm format
  pomodoroEstimate: number; // 预计番茄数
  pomodoroSpent: number; // 已完成番茄数
  tags: string[];
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}
export interface UserStats {
  id: string;
  level: number;
  xp: number;
  streak: number;
  totalFocusMinutes: number;
  totalTasksCompleted: number;
  lastActiveDate?: string;
  unlockedAchievements: string[];
}
export type TimerMode = 'focus' | 'short-break' | 'long-break';
export interface TimerState {
  mode: TimerMode;
  timeLeft: number;
  isRunning: boolean;
  activeTaskId: string | null;
  isPaused: boolean;
}
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}