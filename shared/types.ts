export type Priority = 1 | 2 | 3 | 4; // 1: 紧急, 2: 高, 3: 普通, 4: 低
export type TaskStatus = 'todo' | 'in-progress' | 'completed' | 'archived';
export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  status: TaskStatus;
  dueDate: string; // ISO string
  pomodoroEstimate: number; // 预计番茄数
  pomodoroSpent: number; // 已完成番茄数
  tags: string[];
  createdAt: string;
}
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}