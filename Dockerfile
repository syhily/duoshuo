FROM node:22-alpine AS base

FROM base AS builder

RUN apk add --no-cache libc6-compat
WORKDIR /app

ADD . .
ADD .env.example .env

RUN npm ci && \
    SKIP_ENV_VALIDATION='development' npm run build && \
    npm prune --omit=dev

FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 hono

COPY --from=builder --chown=hono:nodejs /app/node_modules /app/node_modules
COPY --from=builder --chown=hono:nodejs /app/dist /app/dist
COPY --from=builder --chown=hono:nodejs /app/build /app/build
COPY --from=builder --chown=hono:nodejs /app/package.json /app/package.json

USER hono
EXPOSE 4321

CMD ["npm", "start"]
