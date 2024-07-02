# Dockerfile
FROM node:lts-alpine3.19 AS builder

# create destination directory
RUN mkdir -p /usr/src/nuxt-app
WORKDIR /usr/src/nuxt-app

# update and install dependency
RUN apk update && apk upgrade
RUN apk add git

# copy the app, note .dockerignore
COPY . /usr/src/nuxt-app/
COPY .env.example /usr/src/nuxt-app/.env
RUN npm install --No
RUN npm run build

EXPOSE 3000

ENV DOMAIN_NAME=xmrchat.com
ENV NUXT_PUBLIC_API_BASE_URL=https://api.xmrchat.com/api
ENV NUXT_PUBLIC_API_SERVER_SIDE_BASE_URL=http://backend:3000/api
ENV PORT=3000
ENV HOST=0.0.0.0
CMD [ "node", "/usr/src/nuxt-app/.output/server/index.mjs" ]

