# Base image with Node.js
FROM node:23-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Install additional dependencies
RUN apk add --no-cache libc6-compat curl bash
ENV PATH="/root/.bun/bin:$PATH"
WORKDIR /app

# Install dependencies based on the preferred package manager (Bun)
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./
RUN curl -fsSL https://bun.sh/install | bash \
  && /root/.bun/bin/bun install --no-save

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /root/.bun /root/.bun

ENV PATH="/root/.bun/bin:$PATH"

COPY . .

# Copy the wait-for.sh script (you should have this file in your project)
COPY wait-for.sh /usr/local/bin/wait-for.sh
RUN chmod +x /usr/local/bin/wait-for.sh

# Wait for Redis to be available before starting the build
ARG NEXT_PUBLIC_CONNECTOR_URL
ENV NEXT_PUBLIC_CONNECTOR_URL=$NEXT_PUBLIC_CONNECTOR_URL
ARG REDIS_URI
ENV REDIS_URI=$REDIS_URI

RUN /usr/local/bin/wait-for.sh redis:6379 -- bun run build

# Production image, copy all the files and run Next.js
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy build artifacts from builder stage
COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000

# server.js is created by next build from the standalone output
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
