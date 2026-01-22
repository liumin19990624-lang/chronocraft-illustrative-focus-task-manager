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
    await TaskEntity.delete(c.env, id);
    return ok(c, { success: true });
  });
  app.get('/api/stats', async (c) => {
    const entity = new StatsEntity(c.env, 'me');
    const stats = await entity.getState();
    return ok(c, stats);
  });
  app.patch('/api/stats', async (c) => {
    const updates = await c.req.json<Partial<UserStats>>();
    const entity = new StatsEntity(c.env, 'me');
    // Atomic incremental updates
    const stats = await entity.mutate(s => ({
      ...s,
      ...updates,
      xp: updates.xp !== undefined ? updates.xp : s.xp,
      level: updates.level !== undefined ? updates.level : s.level,
      coins: updates.coins !== undefined ? updates.coins : s.coins,
      settings: updates.settings ? { ...s.settings, ...updates.settings } : s.settings
    }));
    return ok(c, stats);
  });
  app.get('/api/leaderboard', async (c) => {
    // In a real app, this would use a global XP index.
    // For now, we simulate with mock data.
    return ok(c, [
      { id: 's1', name: "太池居士", level: 42, xp: 45000 },
      { id: 's2', name: "云端学圣", level: 38, xp: 39500 },
      { id: 's3', name: "笔灵墨客", level: 35, xp: 36000 },
      { id: 's4', name: "清风道友", level: 29, xp: 30000 },
      { id: 's5', name: "烈火奇才", level: 25, xp: 26000 }
    ]);
  });
  app.get('/api/papers/search', async (c) => {
    const query = c.req.query('q')?.toLowerCase() || '';
    const source = c.req.query('source') || 'All';
    const oa = c.req.query('oa') === 'true';
    let filtered = MOCK_SEARCH_RESULTS;
    if (query) {
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(query) ||
        p.authors.toLowerCase().includes(query) ||
        p.tags.some(t => t.toLowerCase().includes(query)) ||
        p.doi?.toLowerCase().includes(query)
      );
    }
    if (source !== 'All') {
      filtered = filtered.filter(p => p.source === source);
    }
    if (oa) {
      filtered = filtered.filter(p => p.isOA);
    }
    return ok(c, filtered);
  });
  app.get('/api/community', async (c) => {
    return ok(c, [
      { id: 'p1', userName: '学术大��', content: '研习了 Transformer！', likes: 24, comments: 5, createdAt: new Date().toISOString(), category: 'dynamics', tags: ['学术'] }
    ]);
  });
  app.post('/api/community', async (c) => {
    const body = await c.req.json<SocialPost>();
    return ok(c, { ...body, id: crypto.randomUUID(), createdAt: new Date().toISOString(), likes: 0, comments: 0 });
  });
  app.post('/api/community/:id/like', async (c) => ok(c, { success: true }));
};