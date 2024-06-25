FROM node:20.11.1-alpine AS build-stage

WORKDIR /app

#COPY package*.json ./
COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build --prod


FROM nginx:alpine

COPY nginx.conf /etc/nginx/nginx.conf

COPY --from=build-stage /app/dist/book-network-ui/browser /usr/share/nginx/html

EXPOSE 80


CMD ["nginx", "-g", "daemon off;"]

