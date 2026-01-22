import { Hono } from 'hono';
import { ok, bad, notFound, Env } from './core-utils';
import { TaskEntity } from './entities';
import type { Task } from '@shared/types';
export const userRoutes = (app: Hono<{ Bindings: Env }>) => {
  app.get('/api/tasks', async (c) => {
    const tasks = await TaskEntity.list(c.env);
    return ok(c, tasks.items);
  });
  app.post('/api/tasks', async (c) => {
    const body = await c.req.json<Task>();
    if (!body.title) return bad(c, '标题是必填项');
    const now = new Date().toISOString();
    const taskData: Task = {
      ...body,
      id: body.id || crypto.randomUUID(),
      priority: body.priority || 3,
      status: body.status || 'todo',
      type: body.type || 'other',
      dueTime: body.dueTime || "09:00",
      pomodoroEstimate: body.pomodoroEstimate || 1,
      pomodoroSpent: 0,
      tags: body.tags || [],
      isArchived: false,
      createdAt: now,
      updatedAt: now
    };
    const task = await TaskEntity.create(c.env, taskData);
    return ok(c, task);
  });
  app.patch('/api/tasks/:id', async (c) => {
    const id = c.req.param('id');
    const updates = await c.req.json<Partial<Task>>();
    const entity = new TaskEntity(c.env, id);
    if (!(await entity.exists())) return notFound(c, '任务不存在');
    const task = await entity.mutate(s => ({
      ...s,
      ...updates,
      updatedAt: new Date().toISOString(),
      completedAt: updates.status === 'completed' ? new Date().toISOString() : s.completedAt
    }));
    return ok(c, task);
  });
  app.delete('/api/tasks/:id', async (c) => {
    const id = c.req.param('id');
    const existed = await TaskEntity.delete(c.env, id);
    if (!existed) return notFound(c, '任务未找到');
    return ok(c, { id });
  });
};