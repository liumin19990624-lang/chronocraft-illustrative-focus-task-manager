import { IndexedEntity, Entity } from "./core-utils";
import type { Task, UserStats } from "@shared/types";
export class TaskEntity extends IndexedEntity<Task> {
  static readonly entityName = "task";
  static readonly indexName = "tasks";
  static readonly initialState: Task = {
    id: "",
    title: "",
    priority: 3,
    status: 'todo',
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
}

export class StatsEntity extends Entity<UserStats> {
  static readonly entityName = "stats";
  static readonly initialState: UserStats = {
    id: 'me',
    level: 1,
    xp: 0,
    streak: 0,
    totalFocusMinutes: 0,
    totalTasksCompleted: 0,
    unlockedAchievements: []
  };
}