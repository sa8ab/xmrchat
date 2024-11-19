# Dockerfile
FROM node:lts-alpine3.19 AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build


FROM node:lts-alpine3.19
WORKDIR /app
COPY --from=builder /app/.output /app/.output
COPY package*.json ./
RUN npm install

EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]