export type Priority = 1 | 2 | 3 | 4; // 1: 烈火 (Fire), 2: 流水 (Water), 3: 巨石 (Rock), 4: 清风 (Wind)
export type TaskStatus = 0 | 1 | 2 | 3; // 0: 未开始, 1: 进行中, 2: 已完成, 3: 已过期
export type TaskType = 'reading' | 'listening' | 'writing' | 'other';
export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  priority: Priority;
  status: TaskStatus;
  type: TaskType;
  startDate?: string;
  dueDate: string; // ISO string
  dueTime: string; // HH:mm format
  pomodoroEstimate: number;
  pomodoroSpent: number;
  tags: string[];
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}
export interface UserStats {
  id: string;
  nickname: string;
  avatar: string;
  level: number;
  xp: number;
  coins: number;
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
  isDistracted: boolean;
}
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}