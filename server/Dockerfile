FROM node:22-alpine

ENV NODE_ENV production


RUN mkdir /home/node/app
WORKDIR /home/node/app

COPY . /home/node/app

# install nest globally
RUN npm install -g @nestjs/cli

RUN npm install
RUN npm run build \
  && rm -rf dist/src/i18n dist/src/notifications/email/templates \
  && mkdir -p dist/src/notifications/email \
  && cp -r src/i18n dist/src/i18n \
  && cp -r src/notifications/email/templates dist/src/notifications/email/templates

# CMD [ "npm", "start" ]
CMD ["node", "dist/src/main.js"]
EXPOSE 3000