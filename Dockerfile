# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci

# Copy source files
COPY . .

# Build the app  
RUN npm run build

# Production stage
FROM node:20-alpine

# Install nginx
RUN apk add --no-cache nginx

# Create directories
RUN mkdir -p /var/log/nginx /var/lib/nginx/tmp /usr/share/nginx/html /mnt/photo

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/http.d/default.conf

# Copy backend server files
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
COPY server.js ./

# Create startup script that runs nginx in background and node in foreground
RUN echo '#!/bin/sh' > /start.sh && \
    echo 'set -e' >> /start.sh && \
    echo 'echo "Starting nginx..."' >> /start.sh && \
    echo 'nginx -g "daemon off;" &' >> /start.sh && \
    echo 'echo "Starting node server..."' >> /start.sh && \
    echo 'exec node /app/server.js' >> /start.sh && \
    chmod +x /start.sh

# Expose ports
EXPOSE 80 5001

# Environment variables
ENV PORT=5001
ENV PHOTO_SHARE_PATH=/mnt/photo

# Start both nginx and node server
CMD ["sh", "/start.sh"]
