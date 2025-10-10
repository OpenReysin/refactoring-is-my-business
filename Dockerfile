FROM node:lts AS runtime
WORKDIR /app

RUN npm install -g pnpm

COPY . .

RUN pnpm install
RUN pnpm run build

ENV HOST=0.0.0.0
ENV PORT=80
EXPOSE 80
CMD node ./dist/server/entry.mjs