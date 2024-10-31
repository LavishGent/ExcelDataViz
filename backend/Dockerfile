# Use Node.js LTS version
FROM node:lts

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json if available, then install dependencies
COPY package*.json ./
RUN npm install

# Copy the source code
COPY . .

# Expose the port the backend will run on
EXPOSE 3000

# Start the backend server
CMD ["npm", "start"]
