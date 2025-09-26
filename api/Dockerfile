FROM node:20

WORKDIR /app

RUN npm install -g pnpm

COPY pnpm-lock.yaml* package.json* ./

COPY . .


EXPOSE 4000

