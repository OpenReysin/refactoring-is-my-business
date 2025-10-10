FROM node:lts AS build
WORKDIR /app
COPY package*.json ./
RUN npm install -g pnpm
RUN pnpm install
COPY . .

# Add build argument for base URL
ARG PUBLIC_SITE_URL=https://refactoring-is-my-business.com
ENV PUBLIC_SITE_URL=$PUBLIC_SITE_URL

RUN pnpm run build

FROM nginx:alpine AS runtime
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 8080