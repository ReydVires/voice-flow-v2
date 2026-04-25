# Stage 1: Prune
FROM node:18-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm turbo
COPY . .
RUN turbo prune client --docker

# Stage 2: Install and Build
FROM node:18-alpine AS installer
WORKDIR /app
RUN npm install -g pnpm

COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install

COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json

# Build the frontend bundle
RUN pnpm turbo run build --filter=client...

# Stage 3: Runner (Nginx)
FROM nginx:alpine AS runner

# Copy the built artifacts from Vite's default output directory
COPY --from=installer /app/apps/client/dist /usr/share/nginx/html

# Replace default config with SPA routing configuration
RUN rm /etc/nginx/conf.d/default.conf
RUN echo "server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files \$uri \$uri/ /index.html; \
    } \
}" > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
