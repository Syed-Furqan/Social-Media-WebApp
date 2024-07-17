FROM node:21.7.3-alpine

WORKDIR /Sharespace-frontend

COPY package*.json .
COPY public ./public
COPY src ./src

RUN npm install

CMD ["npm", "start"]