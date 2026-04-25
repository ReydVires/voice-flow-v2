# Stage 1: Prune
FROM node:18-alpine AS builder
WORKDIR /app
# Install global pnpm and turbo
RUN npm install -g pnpm turbo
COPY . .
# Extract only the dependencies and source code needed for the server
RUN turbo prune server --docker

# Stage 2: Install and Build
FROM node:18-alpine AS installer
WORKDIR /app
RUN npm install -g pnpm

# Install dependencies based on pruned lockfiles
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
# We optionally allow package.json scripts to fail in this step if dev dependencies are missing hook targets
RUN pnpm install

# Copy source code of pruned workspace
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json

# Build the project (will execute `tsc` inside apps/server)
RUN pnpm turbo run build --filter=server...

# Stage 3: Runner
FROM node:18-alpine AS runner
WORKDIR /app

# Non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 expressjs
USER expressjs

# Copy pruned node_modules and built resources
COPY --from=installer /app/node_modules ./node_modules
COPY --from=installer /app/packages ./packages
COPY --from=installer /app/apps/server/package.json ./apps/server/package.json
COPY --from=installer /app/apps/server/node_modules ./apps/server/node_modules
COPY --from=installer /app/apps/server/dist ./apps/server/dist

ENV PORT=5173
EXPOSE 5173

# Execute the compiled js
CMD ["node", "apps/server/dist/index.js"]
