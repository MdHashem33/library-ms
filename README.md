# Library Management System

A full-stack, production-grade Library Management System built as a monorepo.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), Tailwind CSS, shadcn/ui, TanStack Query, Zustand
- **Backend**: NestJS 10, Passport JWT, class-validator, class-transformer
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: Email/Password → JWT access + refresh tokens (httpOnly cookies)
- **AI**: OpenAI GPT-4o-mini for book summary generation

## Getting Started

### Prerequisites

- Node.js 20+
- Docker + Docker Compose
- npm 10+

### Setup

1. Clone and install dependencies:
```bash
git clone <repo>
cd library-ms
npm install
```

2. Copy environment variables:
```bash
cp .env.example apps/api/.env
cp .env.example apps/web/.env.local
```
Edit both files with your actual values.

3. Start PostgreSQL:
```bash
docker-compose up -d
```

4. Run migrations and seed:
```bash
npm run db:migrate
npm run db:seed
```

5. Start development servers:
```bash
npm run dev
```

- API: http://localhost:3001
- Web: http://localhost:3000
- API Docs: http://localhost:3001/api/docs
- pgAdmin: http://localhost:5050

## Default Seed Accounts

| Role | Email | Password |
|------|-------|----------|
| ADMIN | admin@library.com | Admin123! |
| LIBRARIAN | librarian@library.com | Librarian123! |
| MEMBER | member@library.com | Member123! |

## Project Structure

```
library-ms/
├── apps/
│   ├── api/     # NestJS backend (port 3001)
│   └── web/     # Next.js frontend (port 3000)
├── docker-compose.yml
└── package.json
```
