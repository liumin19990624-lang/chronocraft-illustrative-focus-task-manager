import { IndexedEntity } from "./core-utils";
import type { Task } from "@shared/types";
export class TaskEntity extends IndexedEntity<Task> {
  static readonly entityName = "task";
  static readonly indexName = "tasks";
  static readonly initialState: Task = {
    id: "",
    title: "",
    priority: 3,
    status: 'todo',
    dueDate: new Date().toISOString(),
    pomodoroEstimate: 1,
    pomodoroSpent: 0,
    tags: [],
    createdAt: new Date().toISOString(),
  };
}