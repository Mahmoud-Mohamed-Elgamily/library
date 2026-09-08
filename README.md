# School (mock project)

Full-stack mock project: **NestJS** (backend) + **PostgreSQL** + **Next.js** (frontend), managed as an npm workspaces monorepo.

```
school/
├── backend/    # NestJS API (TypeORM + PostgreSQL)
├── frontend/   # Next.js app
└── package.json
```

## Prerequisites

- Node.js 20+
- npm 10+
- PostgreSQL running locally (or accessible remotely)

## 1. Install dependencies

From the repo root (installs both `backend` and `frontend` via npm workspaces):

```bash
npm install
```

## 2. Set up environment variables

Each app has its own `.env`. Copy the example files and adjust as needed:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

- `backend/.env` — database connection (`DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`), `PORT`, `FRONTEND_URL`.
- `frontend/.env.local` — `NEXT_PUBLIC_API_URL` pointing at the backend.

## 3. Create the database

Make sure Postgres is running, then create the database referenced by `DB_NAME` in `backend/.env`:

```bash
createdb school
```

## 4. Run both apps

From the repo root:

```bash
npm run dev
```

This starts:
- backend on http://localhost:3001
- frontend on http://localhost:3000

Or run them individually:

```bash
npm run dev:backend
npm run dev:frontend
```

## Notes

- The backend uses TypeORM with `synchronize: true` in development, so entities are auto-created as tables — no manual migrations needed while prototyping.
- Never commit `.env` files — only the `.env.example` templates are tracked.
