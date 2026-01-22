export type Priority = 1 | 2 | 3 | 4; // 1: 烈火, 2: 流���, 3: 巨石, 4: 清风
export type TaskStatus = 0 | 1 | 2 | 3; // 0: 未开始, 1: 进行��, 2: 已完成, 3: 已过期
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
  dueDate: string;
  dueTime: string;
  pomodoroEstimate: number;
  pomodoroSpent: number;
  tags: string[];
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}
export type PaperSource = 'arXiv' | 'CNKI' | 'PubMed' | 'Wanfang' | 'IEEE' | 'Nature';
export interface AcademicPaper {
  id: string;
  title: string;
  authors: string;
  year: number;
  abstract: string;
  pdfUrl: string;
  citations: number;
  tags: string[];
  journal?: string;
  source: PaperSource;
  doi?: string;
  isOA: boolean;
}
export type AiTaskType = 'interpret' | 'modify' | 'translate' | 'evaluate';
export interface AiAssistantResult {
  taskId: string;
  type: AiTaskType;
  content: string;
  originalText?: string;
  metadata?: {
    score?: {
      grammar: number;
      logic: number;
      originality: number;
    };
    suggestions?: string[];
  };
}
export type PostCategory = 'dynamics' | 'collaborative' | 'qna';
export interface SocialPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  category: PostCategory;
  content: string;
  likes: number;
  comments: number;
  createdAt: string;
  tags: string[];
}
export interface UserSettings {
  fontScale: number; // 0.8 to 1.2
  themePreference: 'light' | 'dark' | 'system';
  privacyMode: boolean;
  notificationsEnabled: boolean;
  accentColor: string;
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
  settings: UserSettings;
}
export type TimerMode = 'focus' | 'short-break' | 'long-break';
export interface TimerState {
  mode: TimerMode;
  timeLeft: number;
  isRunning: boolean;
  activeTaskId: string | null;
  isPaused: boolean;
  isDistracted: boolean;
  spiritHealth: number;
}
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}