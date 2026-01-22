# Chronocraft

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/liumin19990624-lang/chronocraft-illustrative-focus-task-manager)

[![Stars](https://img.shields.io/github/stars/YOUR_USERNAME/chronocraft-ngrg89szrsnaoirplqwim?style=social)](https://github.com/YOUR_USERNAME/chronocraft-ngrg89szrsnaoirplqwim/stargazers)
[![Forks](https://img.shields.io/github/forks/YOUR_USERNAME/chronocraft-ngrg89szrsnaoirplqwim?style=social)](https://github.com/YOUR_USERNAME/chronocraft-ngrg89szrsnaoirplqwim/network/members)
[![Issues](https://img.shields.io/github/issues/YOUR_USERNAME/chronocraft-ngrg89szrsnaoirplqwim)](https://github.com/YOUR_USERNAME/chronocraft-ngrg89szrsnaoirplqwim/issues)
[![License](https://img.shields.io/github/license/YOUR_USERNAME/chronocraft-ngrg89szrsnaoirplqwim)](https://github.com/YOUR_USERNAME/chronocraft-ngrg89szrsnaoirplqwim/blob/main/LICENSE)

## Overview

Chronocraft is a production-ready, full-stack chat application built on Cloudflare Workers. It demonstrates a scalable architecture using Durable Objects for multi-tenant entity storage (users, chat boards, messages), Hono for API routing, React with Vite and shadcn/ui for the frontend, and TanStack Query for data management. 

This template provides a foundation for real-time chat apps with features like user management, paginated lists, message persistence, and seed data for quick demos. It's optimized for edge deployment with zero cold starts and global state consistency.

## Key Features

- **Multi-Tenant Durable Objects**: Shared GlobalDurableObject for efficient storage of multiple entity types (Users, ChatBoards).
- **Indexed Entities**: Automatic pagination and listing with prefix-based indexes.
- **Real-Time Chat**: Messages stored per chat board with optimistic mutations.
- **Type-Safe API**: Shared types between frontend and worker, Hono-powered routes.
- **Modern UI**: shadcn/ui components, Tailwind CSS, dark mode, responsive design.
- **Data Fetching**: TanStack Query with infinite queries for lists.
- **Seed Data**: Mock users, chats, and messages for instant demo.
- **Error Handling**: Client-side error reporting to worker API.
- **Production-Ready**: CORS, logging, health checks, SPA asset handling.

## Tech Stack

| Category | Technologies |
|----------|--------------|
| **Backend** | Cloudflare Workers, Hono, Durable Objects |
| **Frontend** | React 18, Vite, TypeScript, shadcn/ui, Tailwind CSS |
| **State/Data** | TanStack Query, Zustand (ready), Immer |
| **UI Components** | Radix UI, Lucide Icons, Framer Motion, Sonner (Toasts) |
| **Tools** | Bun (package manager), Wrangler, ESLint, TypeScript |
| **Other** | Cloudflare Vite Plugin, React Router, React Hook Form |

## Prerequisites

- [Bun](https://bun.sh/) (recommended package manager)
- [Cloudflare Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/)
- Node.js (for some dev tools, optional with Bun)

## Quick Start

1. **Clone & Install**:
   ```bash
   git clone <your-repo-url>
   cd chronocraft-ngrg89szrsnaoirplqwim
   bun install
   ```

2. **Development**:
   ```bash
   bun run dev
   ```
   Opens at `http://localhost:3000` (or `$PORT`).

3. **Type Generation** (for Worker bindings):
   ```bash
   bun run cf-typegen
   ```

## Development Workflow

- **Frontend**: Edit `src/` files. Hot reload via Vite.
- **Backend Routes**: Add routes in `worker/user-routes.ts`. Auto-reload in dev.
- **Entities**: Extend `IndexedEntity` in `worker/entities.ts`.
- **Shared Types**: Update `shared/types.ts` and `shared/mock-data.ts`.
- **Lint**:
  ```bash
  bun run lint
  ```
- **Build**:
  ```bash
  bun run build
  ```
- **Preview**:
  ```bash
  bun run preview
  ```

API endpoints available at `/api/*` (e.g., `/api/users`, `/api/chats/:id/messages`).

Test with curl:
```bash
curl http://localhost:3000/api/health
curl http://localhost:3000/api/users
```

## Deployment

Deploy to Cloudflare Workers in one command:

```bash
bun run deploy
```

Or manually:
```bash
bun run build
npx wrangler deploy
```

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/liumin19990624-lang/chronocraft-illustrative-focus-task-manager)

**Configuration**: Edit `wrangler.jsonc` for custom bindings/migrations. Assets are served as SPA.

**Custom Domain**: Use `wrangler deploy --name your-worker-name`.

## API Documentation

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check |
| `/api/users` | GET/POST | List/create users (supports `?cursor` `?limit`) |
| `/api/users/:id` | DELETE | Delete user |
| `/api/users/deleteMany` | POST | Bulk delete |
| `/api/chats` | GET/POST | List/create chats |
| `/api/chats/:chatId/messages` | GET/POST | List/send messages |
| `/api/chats/:id` | DELETE | Delete chat |
| `/api/chats/deleteMany` | POST | Bulk delete |
| `/api/client-errors` | POST | Report frontend errors |

Responses follow `{ success: boolean, data?: T, error?: string }`.

## Customization

- **Add Entities**: Extend `IndexedEntity` in `worker/entities.ts`, add routes in `user-routes.ts`.
- **UI Pages**: Update `src/pages/`, use `AppLayout` for sidebar.
- **Seeds**: Modify `shared/mock-data.ts`.
- **Theme**: Toggle via `ThemeToggle` component.

Do **not** edit `worker/index.ts` or `worker/core-utils.ts` to avoid breaking core functionality.

## Troubleshooting

- **Worker Routes Fail**: Check console for import errors. Dev mode retries automatically.
- **Types Missing**: Run `bun run cf-typegen`.
- **Build Issues**: Ensure Bun is up-to-date; clear `.tmp/` cache.
- **CORS**: Pre-configured for `*` in dev.

## Contributing

1. Fork & clone.
2. `bun install`.
3. Create feature branch.
4. `bun run lint`.
5. Submit PR.

## License

MIT License. See [LICENSE](LICENSE) for details.

---

Built with ❤️ for Cloudflare Workers. Questions? [Open an issue](https://github.com/YOUR_USERNAME/chronocraft-ngrg89szrsnaoirplqwim/issues).