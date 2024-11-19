FROM node:alpine

ENV NODE_ENV production


RUN mkdir /home/node/app
WORKDIR /home/node/app

COPY . /home/node/app

# install nest globally
RUN npm install -g @nestjs/cli

RUN npm install
RUN npm run build

# CMD [ "npm", "start" ]
CMD ["node", "dist/src/main.js"]
EXPOSE 3000