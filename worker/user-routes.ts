import { Hono } from 'hono';
import { ok, bad, notFound, Env } from './core-utils';
import { TaskEntity } from './entities';
import type { Task } from '@shared/types';
export const userRoutes = (app: Hono<{ Bindings: Env }>) => {
  // 获取所有任务
  app.get('/api/tasks', async (c) => {
    const tasks = await TaskEntity.list(c.env);
    // Sort tasks by status then priority then created date
    const sorted = tasks.items.sort((a, b) => {
      if (a.status === 'completed' && b.status !== 'completed') return 1;
      if (a.status !== 'completed' && b.status === 'completed') return -1;
      return a.priority - b.priority || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    return ok(c, sorted);
  });
  // ���建任务
  app.post('/api/tasks', async (c) => {
    const body = await c.req.json<Task>();
    if (!body.title) return bad(c, '标��是必填项');
    const now = new Date().toISOString();
    const taskData: Task = {
      ...body,
      id: body.id || crypto.randomUUID(),
      priority: body.priority || 3,
      status: body.status || 'todo',
      pomodoroEstimate: body.pomodoroEstimate || 1,
      pomodoroSpent: body.pomodoroSpent || 0,
      tags: body.tags || [],
      createdAt: body.createdAt || now,
      updatedAt: now
    };
    const task = await TaskEntity.create(c.env, taskData);
    return ok(c, task);
  });
  // 更新任务
  app.patch('/api/tasks/:id', async (c) => {
    const id = c.req.param('id');
    const updates = await c.req.json<Partial<Task>>();
    const entity = new TaskEntity(c.env, id);
    if (!(await entity.exists())) return notFound(c, '任务不存在');
    const task = await entity.mutate(s => ({
      ...s,
      ...updates,
      updatedAt: new Date().toISOString()
    }));
    return ok(c, task);
  });
  // 删除任务
  app.delete('/api/tasks/:id', async (c) => {
    const id = c.req.param('id');
    const existed = await TaskEntity.delete(c.env, id);
    if (!existed) return notFound(c, '任务未找到');
    return ok(c, { id });
  });
};