# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy package.json and install dependencies
COPY client/package.json client/package-lock.json ./

RUN npm install

# Copy the project files
COPY client/ .

# Expose the Vite development server port
EXPOSE 5173

# Start the Vite development server
CMD ["npm", "run", "dev", "--", "--host"]
