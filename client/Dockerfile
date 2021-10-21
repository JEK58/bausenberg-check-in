# Build Stage
FROM node:14.16.0-alpine3.13 AS build-stage
WORKDIR /app
COPY package*.json ./
RUN yarn install
COPY . .
RUN yarn build

# Production build
FROM nginx:1.21.3-alpine
#RUN addgroup app && adduser -S -G app app
#USER app
ENV VUE_APP_API_RATE_LIMIT=${API_RATE_LIMIT}
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
ENTRYPOINT [ "nginx", "-g", "daemon off;" ]