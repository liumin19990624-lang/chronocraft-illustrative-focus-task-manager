import { Hono } from 'hono';
import { ok, bad, notFound, Env } from './core-utils';
import { TaskEntity } from './entities';
import type { Task } from '@shared/types';

export const userRoutes = (app: Hono<{ Bindings: Env }>) => {
  // 获取所有任务
  app.get('/api/tasks', async (c) => {
    const tasks = await TaskEntity.list(c.env);
    return ok(c, tasks.items);
  });

  // 创建任务
  app.post('/api/tasks', async (c) => {
    const body = await c.req.json<Task>();
    if (!body.title) return bad(c, '标题是必填项');

    const taskData: Task = {
      ...body,
      id: body.id || crypto.randomUUID(),
      priority: body.priority || 3,
      status: body.status || 'todo',
      pomodoroEstimate: body.pomodoroEstimate || 1,
      pomodoroSpent: body.pomodoroSpent || 0,
      tags: body.tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const task = await TaskEntity.create(c.env, taskData);
    return ok(c, task);
  });
};
//