FROM node:14.16.0-alpine3.13
WORKDIR /app
COPY package*.json ./
RUN yarn install
COPY . .
RUN yarn start
EXPOSE 3030
