
Developer Match Platform is a specialized, production-ready social networking and matchmaking application designed exclusively for software engineers. It goes beyond standard matching algorithms by creating a holistic profile of users based on their technical stacks, GitHub activity, and inferred personality traits.

The platform features a modular engine architecture that handles complex backend tasks, including:

Chemistry & Personality Engines: Utilizes LLMs to analyze user inputs and predict relationship compatibility.
Date-Planner & Venue Engines: Integrates with Google Places to suggest optimal real-world meeting locations based on user preferences.
Real-Time Communication: Features a robust, low-latency Socket.io chat interface and secure WebRTC integrations for virtual meetups.
Built on a modern stack comprising Next.js 14, NestJS, PostgreSQL, and Redis, the project demonstrates advanced patterns in full-stack web development, containerization, and API integration.

=======
# Developer Match Platform

A production-grade developer-first social matching platform where technical compatibility, personality inference, and real-world meetup intelligence merge into one system.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     FRONTEND (Next.js 14)                        │
│  TailwindCSS • Framer Motion • Zustand • WebRTC • Socket.io      │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                     BACKEND (NestJS)                             │
│  REST API • WebSocket • JWT • RBAC • Layered Architecture        │
└─────────────────────────────────────────────────────────────────┘
                                │
        ┌──────────────────────┼──────────────────────┐
        ▼                      ▼                      ▼
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│  PostgreSQL  │      │    Redis     │      │ External APIs│
│  (Primary)   │      │ (Cache/WS)   │      │ GitHub/LLM/  │
│              │      │              │      │ Google Places│
└──────────────┘      └──────────────┘      └──────────────┘
```

## Tech Stack

- **Frontend:** Next.js 14 (App Router), TypeScript, TailwindCSS, Framer Motion, Zustand
- **Backend:** NestJS, TypeORM, PostgreSQL, Redis, Socket.io
- **Auth:** JWT + Refresh Tokens, GitHub OAuth
- **Realtime:** Socket.io, WebRTC
- **Integrations:** GitHub API, Google Places API, LLM API (OpenAI/Anthropic)

## Quick Start

### Prerequisites

- Node.js 20+
- Docker & Docker Compose
- pnpm (recommended) or npm

### Environment Setup

```bash
# Copy environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local

# Edit with your API keys:
# - GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET
# - GOOGLE_PLACES_API_KEY
# - OPENAI_API_KEY or ANTHROPIC_API_KEY
# - JWT_SECRET, JWT_REFRESH_SECRET
```

### Docker (Recommended)

```bash
docker-compose up -d
```

This starts:
- PostgreSQL on port 5432
- Redis on port 6379
- Backend on port 3001
- Frontend on port 3000

### Local Development

```bash
# Terminal 1: Start PostgreSQL & Redis
docker-compose up postgres redis -d

# Terminal 2: Backend
cd backend && pnpm install && pnpm run migration:run && pnpm run start:dev

# Terminal 3: Frontend
cd frontend && pnpm install && pnpm run dev
```

### Seed Data

```bash
cd backend && pnpm run seed
```

## Project Structure

```
├── backend/                 # NestJS API
│   ├── src/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── profiles/
│   │   ├── matching/
│   │   ├── chat/
│   │   ├── engines/         # Modular engines
│   │   │   ├── matching/
│   │   │   ├── chemistry/
│   │   │   ├── personality/
│   │   │   ├── date-planner/
│   │   │   ├── venue/
│   │   │   └── mood/
│   │   ├── github/
│   │   ├── webrtc/
│   │   └── safe-space/
│   └── ...
├── frontend/                # Next.js App
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── stores/
│   │   └── lib/
│   └── ...
├── docker-compose.yml
└── README.md
```

## Deployment (Render / Railway / Fly.io)

- **Backend:** Set build command `cd backend && pnpm install && pnpm run build`
- **Frontend:** Set build command `cd frontend && pnpm install && pnpm run build`
- **Database:** Use managed PostgreSQL (Render, Railway, Supabase)
- **Redis:** Use managed Redis (Upstash, Railway)
- Configure environment variables per service

## License

Proprietary - All rights reserved.
>>>>>>> master
