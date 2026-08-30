FROM node:20-alpine AS client-build

WORKDIR /build/client
COPY client/package.json client/package-lock.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

FROM node:20-alpine AS server-build

WORKDIR /build/server
COPY server/package.json server/package-lock.json ./
RUN npm ci
COPY server/ ./
RUN npx tsc

FROM node:20-alpine

ENV NODE_ENV=production
ENV DATA_DIR=/data
WORKDIR /app

COPY server/package.json server/package-lock.json ./
RUN npm ci --omit=dev
COPY --from=server-build /build/server/dist ./dist
COPY --from=client-build /build/client/build ./client

EXPOSE 3000 8085
VOLUME ["/data"]
CMD ["node", "dist/app.js"]