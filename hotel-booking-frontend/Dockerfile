# Frontend build and serve with Vite
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY hotel-booking-frontend/package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY hotel-booking-frontend ./

# Expose port 5174 (Vite default)
EXPOSE 5174

# Run Vite dev server with host 0.0.0.0 to allow external access
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
