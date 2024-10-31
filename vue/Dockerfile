# Step 1: Use Node.js LTS version to build the app
FROM node:lts AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json, then install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app source code
COPY . .

# Build the Vue app
RUN npm run build

# Step 2: Use Nginx to serve the built files
FROM nginx:alpine

# Copy built files from previous stage to Nginx's default public directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose the port Nginx will run on
EXPOSE 80
