# Stage 1: Build the Next.js app
FROM node:18 as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build 

# Stage 2: Production environment (using Node.js to serve the app)
FROM node:18 as production-stage
WORKDIR /app
COPY --from=build-stage /app ./
RUN npm install --production 

EXPOSE 3000  
CMD ["npm", "start"]  
