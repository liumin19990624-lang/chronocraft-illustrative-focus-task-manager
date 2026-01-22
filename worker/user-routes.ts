import { Hono } from 'hono';
import { ok, bad, notFound, Env } from './core-utils';
import { TaskEntity, StatsEntity } from './entities';
import type { Task, UserStats, SocialPost } from '@shared/types';
import { MOCK_SEARCH_RESULTS } from '../src/lib/mock-academic';
export const userRoutes = (app: Hono<{ Bindings: Env }>) => {
  app.get('/api/tasks', async (c) => {
    await TaskEntity.ensureSeed(c.env);
    const tasks = await TaskEntity.list(c.env);
    return ok(c, tasks.items);
  });
  app.post('/api/tasks', async (c) => {
    const body = await c.req.json<Task>();
    if (!body.title) return bad(c, '标题是必填项');
    const task = await TaskEntity.create(c.env, { ...body, id: body.id || crypto.randomUUID(), createdAt: new Date().toISOString() });
    return ok(c, task);
  });
  app.patch('/api/tasks/:id', async (c) => {
    const id = c.req.param('id');
    const updates = await c.req.json<Partial<Task>>();
    const entity = new TaskEntity(c.env, id);
    if (!(await entity.exists())) return notFound(c, '任务不存在');
    const task = await entity.mutate(s => ({ ...s, ...updates, updatedAt: new Date().toISOString() }));
    return ok(c, task);
  });
  app.delete('/api/tasks/:id', async (c) => {
    const id = c.req.param('id');
    const existed = await TaskEntity.delete(c.env, id);
    return ok(c, { id, existed });
  });
  app.get('/api/stats', async (c) => {
    const entity = new StatsEntity(c.env, 'me');
    const stats = await entity.getState();
    return ok(c, stats);
  });
  app.patch('/api/stats', async (c) => {
    const updates = await c.req.json<Partial<UserStats>>();
    const entity = new StatsEntity(c.env, 'me');
    const stats = await entity.mutate(s => ({ ...s, ...updates }));
    return ok(c, stats);
  });
  // Academic Search
  app.get('/api/papers/search', async (c) => {
    const query = c.req.query('q')?.toLowerCase() || '';
    if (!query) return ok(c, MOCK_SEARCH_RESULTS);
    const filtered = MOCK_SEARCH_RESULTS.filter(p => 
      p.title.toLowerCase().includes(query) || 
      p.authors.toLowerCase().includes(query) ||
      p.tags.some(t => t.toLowerCase().includes(query))
    );
    return ok(c, filtered);
  });
  // Mock Community Data
  const MOCK_POSTS: SocialPost[] = [
    { id: 'p1', userId: 'u1', userName: '学术大圣', userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=monk', content: '今日参悟了 Transformer 架构，多头注意力机制妙不���言！', likes: 24, comments: 5, createdAt: new Date().toISOString(), category: 'dynamics', tags: ['学术'] },
    { id: 'p2', userId: 'u2', userName: '炼语书生', userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=scholar', content: '坚持��听 30 天，终于在不看字���的情况下听懂了 Nature 的学术报告。', likes: 42, comments: 12, createdAt: new Date().toISOString(), category: 'dynamics', tags: ['坚持'] }
  ];
  app.get('/api/community', async (c) => {
    return ok(c, MOCK_POSTS);
  });
  app.post('/api/community', async (c) => {
    const body = await c.req.json<SocialPost>();
    const newPost = { ...body, id: crypto.randomUUID(), createdAt: new Date().toISOString(), likes: 0, comments: 0 };
    return ok(c, newPost);
  });
  app.post('/api/community/:id/like', async (c) => {
    return ok(c, { success: true });
  });
};