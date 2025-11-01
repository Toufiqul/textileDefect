# ---------- Build Stage ----------
FROM node:lts-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# ---------- Serve Stage ----------
FROM nginx:stable-alpine
# Copy our static files from the build stage
COPY --from=builder /app/dist /usr/share/nginx/html

# ADD THIS LINE: Copy our custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]