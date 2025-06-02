# Dockerfile
FROM node:22-slim AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build


FROM node:22-slim
WORKDIR /app
COPY --from=builder /app/.output /app/.output
COPY package*.json ./
RUN npm install

EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]