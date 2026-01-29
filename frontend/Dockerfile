# Step 1: Use a Node.js image to build the app (Node 20+ required)
FROM node:20-alpine AS builder

# Set working directory inside the container
WORKDIR /app

# Copy only package files first (better caching)
COPY package*.json ./

# Install dependencies (use npm ci if package-lock.json exists)
RUN npm ci || npm install

# Copy the rest of the app’s source code
COPY . .

# Build the app
RUN npm run build


# Step 2: Use an Nginx image to serve the static files
FROM nginx:alpine

# Copy the build files from the builder stage to the Nginx web directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
