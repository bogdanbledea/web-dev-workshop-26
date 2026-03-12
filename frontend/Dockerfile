# Build stage
FROM node:24-alpine AS build

WORKDIR /app

ARG VITE_SOCKET_URL
ARG VITE_API_KEY
ARG VITE_BACKEND_URL

ENV VITE_SOCKET_URL=$VITE_SOCKET_URL
ENV VITE_API_KEY=$VITE_API_KEY
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
