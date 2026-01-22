import { IndexedEntity, Entity } from "./core-utils";
import type { Task, UserStats } from "@shared/types";
import { MOCK_TASKS } from '../src/lib/mock-tasks';
export class TaskEntity extends IndexedEntity<Task> {
  static readonly entityName = "task";
  static readonly indexName = "tasks";
  static readonly initialState: Task = {
    id: "",
    userId: "",
    title: "",
    priority: 3,
    status: 0,
    type: 'other',
    dueDate: new Date().toISOString(),
    dueTime: "09:00",
    pomodoroEstimate: 1,
    pomodoroSpent: 0,
    tags: [],
    isArchived: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  static readonly seedData = MOCK_TASKS;
}
export class StatsEntity extends Entity<UserStats> {
  static readonly entityName = "stats";
  static readonly initialState: UserStats = {
    id: 'me',
    nickname: '',
    avatar: '',
    level: 1,
    xp: 0,
    coins: 0,
    streak: 0,
    totalFocusMinutes: 0,
    totalTasksCompleted: 0,
    unlockedAchievements: [],
    checkinHistory: [],
    focusHistory: {},
    lastActiveDate: "",
    lastCheckinDate: undefined,
    settings: {
      fontScale: 1.0,
      themePreference: 'system',
      privacyMode: false,
      notificationsEnabled: true,
      accentColor: '#88C0D0'
    }
  };
}