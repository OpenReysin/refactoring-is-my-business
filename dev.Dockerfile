# Use Node.js LTS
FROM node:22-alpine AS dev

WORKDIR /app

# Install pnpm and D2
RUN npm install -g pnpm && \
    apk add --no-cache curl make git g++ python3 && \
    curl -fsSL https://d2lang.com/install.sh | sh -s --

# Install project dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install

# Copy all files
COPY . .

# Start Astro dev server
CMD ["pnpm", "run", "dev", "--", "--host"]
