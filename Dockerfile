FROM node:latest

WORKDIR /home/bot
COPY ./bin ./bin
COPY package*.json ./

RUN npm i && npm audit fix

VOLUME [ "/home/bot/src", "/home/bot/logs", "/home/bot/db" ]

CMD [ "npm", "start" ]