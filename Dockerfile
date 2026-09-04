FROM node:20-alpine AS build

WORKDIR /app
COPY package.json package-lock.json ./
COPY client/package.json ./client/package.json
COPY server/package.json ./server/package.json
RUN npm ci
COPY client/ ./client/
COPY server/ ./server/
RUN npm run build

FROM node:20-alpine

ENV NODE_ENV=production
ENV DATA_DIR=/data
WORKDIR /app

COPY package.json package-lock.json ./
COPY client/package.json ./client/package.json
COPY server/package.json ./server/package.json
RUN npm ci --workspace=server --omit=dev
COPY --from=build /app/server/dist ./server/dist
COPY --from=build /app/client/build ./client/build

EXPOSE 3000 8085
VOLUME ["/data"]
CMD ["node", "server/dist/app.js"]