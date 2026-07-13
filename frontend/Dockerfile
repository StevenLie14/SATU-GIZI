FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

ARG VITE_OFFLINE_MODE
ENV VITE_OFFLINE_MODE=$VITE_OFFLINE_MODE

ARG VITE_CHAIN_NAME
ENV VITE_CHAIN_NAME=$VITE_CHAIN_NAME

ARG VITE_CHAIN_ID
ENV VITE_CHAIN_ID=$VITE_CHAIN_ID

RUN npm run build

FROM nginx:stable-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
