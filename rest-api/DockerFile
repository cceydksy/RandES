FROM node:latest

WORKDIR /randes_api

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000
