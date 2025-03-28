# Use official Node.js image for React
FROM node:22.2.0

# Set working directory
WORKDIR /app

# Copy the frontend files into the container
COPY . .

# Install dependencies
RUN npm install

# Expose port for React app
EXPOSE 3000

# Start React app
CMD ["npm", "start"]
