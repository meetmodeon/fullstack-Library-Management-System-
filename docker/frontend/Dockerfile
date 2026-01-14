# ===== Build stage =====
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies in container (Linux)
RUN npm install --legacy-peer-deps

# Copy all source code
COPY . .

# Build Angular production bundle
RUN npm run build

# ===== Runtime stage =====
FROM nginx:alpine

# Remove default Nginx HTML
RUN rm -rf /usr/share/nginx/html/*

# Copy Angular build output
COPY --from=builder /app/dist/lib_ui/browser /usr/share/nginx/html

# Copy custom nginx config (if you have one)
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
