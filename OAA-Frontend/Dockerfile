# Stage 1: Build the Next.js app
FROM node:18 as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Set up PM2 and Nginx
FROM node:18 as production-stage

# Install PM2 globally
RUN npm install -g pm2

# Install Nginx
RUN apt-get update && apt-get install -y nginx

# Copy Nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy Next.js build
COPY --from=build-stage /app/.next /usr/share/nginx/html
COPY --from=build-stage /app/public /usr/share/nginx/html

# Set workdir and copy app
WORKDIR /app
COPY --from=build-stage /app /app

# Install production dependencies
RUN npm install --production

# Expose necessary ports
EXPOSE 80 3000

# Start Next.js app with PM2 and Nginx
CMD pm2 start npm --name "next-app" -- start & nginx -g 'daemon off;'
