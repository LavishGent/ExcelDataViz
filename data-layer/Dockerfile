# Use Node.js LTS version
FROM node:lts

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json if available, then install dependencies
COPY package*.json ./
RUN npm install

# Copy the source code
COPY . .

# Expose the data layer's port
EXPOSE 4000

# Start the data layer server
CMD ["npm", "start"]
