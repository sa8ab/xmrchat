FROM oven/bun AS builder
WORKDIR /usr/src/app



# Copy the lock and package file
COPY bun.lockb . 
# COPY package-lock.json .
COPY package.json . 

# Install dependencies
RUN bun i

COPY . .

RUN apt-get update && apt-get install -y git
RUN git apply ./patches/elysia-autoload+0.1.9.patch


ENV NODE_ENV development



FROM builder AS backend
# RUN bun db:migrations:run
# RUN bun ru build
EXPOSE 3000/tcp 3000 300/udp
CMD ["bun", "app"]



FROM nginx:stable-alpine AS nginx
COPY --from=builder /usr/src/app/frontend/dist /usr/share/nginx/html
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
