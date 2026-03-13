FROM node:20-alpine AS builder

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

COPY backend/package.json backend/pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile || pnpm install

COPY backend/ ./
RUN pnpm run build

FROM node:20-alpine

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
RUN pnpm install --prod

EXPOSE 3001

CMD ["node", "dist/main.js"]
