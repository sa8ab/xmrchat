FROM node:22-slim

ENV NODE_ENV production
ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright

RUN mkdir /home/node/app
WORKDIR /home/node/app

COPY . /home/node/app

# install nest globally
RUN npm install -g @nestjs/cli

RUN npm install
RUN npm run build
RUN npx playwright install --with-deps chromium

# CMD [ "npm", "start" ]
CMD ["node", "dist/src/main.js"]
EXPOSE 3000
