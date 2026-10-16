FROM node:22.13.0-slim AS build
WORKDIR /app
RUN npm install --global pnpm@11.25.0
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM node:22.13.0-slim AS runner
WORKDIR /app
ENV NODE_ENV=production PORT=3000
RUN npm install --global pnpm@11.25.0
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --prod --frozen-lockfile
COPY server.mjs ./server.mjs
COPY server ./server
COPY --from=build /app/dist ./dist
EXPOSE 3000
CMD ["pnpm", "start"]
