FROM node:20.11.1

WORKDIR /backend

COPY package*.json ./
COPY src /backend/src

RUN yarn

COPY . .

CMD ["yarn","start"]
