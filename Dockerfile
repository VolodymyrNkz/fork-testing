# Stage 1: Install dependencies and build the application
FROM node:22.12.0-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN npm run build

# Stage 2: Create a minimal production environment
FROM node:22.12.0-alpine AS runner

# Set the working directory
WORKDIR /app

# Install only production dependencies
COPY package.json package-lock.json ./
# Do this to omit running Husky hooks on production build
RUN npm install --production=false
RUN npm prune --production

# Copy the build output and static files from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./next.config.mjs

# Set the PORT environment variable for Next.js
ENV PORT=8080

# Expose the port for the application
EXPOSE 8080

# Start the Next.js application in production mode
CMD ["npm", "run", "start"]
