# 1. Base stage with node and pnpm
FROM node:22-alpine AS base
RUN npm install -g pnpm@11.4.0
RUN apk add --no-cache tzdata
ENV TZ=Europe/Berlin

# 2. Dependencies stage
FROM base AS deps
WORKDIR /app

COPY package.json pnpm-lock.yaml tsconfig*.json pnpm-workspace.yaml ./
COPY web/package.json web/tsconfig.json web/next.config.ts ./web/

RUN pnpm install --ignore-scripts

# 3. Builder stage
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/web/node_modules ./web/node_modules
COPY package.json pnpm-lock.yaml tsconfig*.json pnpm-workspace.yaml ./
COPY web/package.json web/tsconfig.json web/next.config.ts ./web/
COPY src ./src
COPY wasm ./wasm
COPY keys.json ./keys.json
COPY web/app ./web/app
COPY web/public ./web/public
COPY certs ./certs

# Build the parent library first
RUN pnpm run build
# Add certificates from certs folder to keys.json if any exist
RUN if [ -d certs ] && ls certs/*.pem 1>/dev/null 2>&1; then node build/cli.js certificate add certs || true; fi
# Build the Next.js web application
RUN cd web && pnpm run build

# 4. Production Runner stage
FROM node:22-alpine AS runner
WORKDIR /app

RUN apk add --no-cache tzdata
ENV TZ=Europe/Berlin
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy static assets and standalone bundle
COPY --from=builder /app/web/public ./web/public
COPY --from=builder --chown=nextjs:nodejs /app/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/web/.next/static ./web/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/keys.json ./keys.json
COPY --from=builder --chown=nextjs:nodejs /app/keys.json ./node_modules/uic-918-3/keys.json
COPY --from=builder --chown=nextjs:nodejs /app/certs ./certs

USER nextjs
EXPOSE 3000

CMD ["node", "web/server.js"]
