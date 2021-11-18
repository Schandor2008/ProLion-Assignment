FROM node:alpine

COPY ./package*.json .

RUN npm install

COPY ./dist/src ./dist/src
COPY .env .env
COPY ./RootFolder ./RootFolder

CMD node ./dist/src/app.js