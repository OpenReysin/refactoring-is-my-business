# Stage 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

# Install pnpm and D2
RUN npm install -g pnpm && \
    apk add --no-cache curl make git g++ python3 && \
    curl -fsSL https://d2lang.com/install.sh | sh -s --

# Install project dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install

# Copy all files and build
COPY . .
RUN pnpm run build

# Stage 2: Serve
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
