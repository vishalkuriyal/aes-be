# Use official Node.js image (Choose a LTS version for stability, here 18.x is used)
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install
RUN npm install bcrypt

# Copy the rest of the application code
COPY . .

# Build the app (if you have a build step, for example with TypeScript or bundlers)
RUN npm run build

# Expose the port the app runs on
EXPOSE 3030

# Start the application
CMD ["npm", "start"]

