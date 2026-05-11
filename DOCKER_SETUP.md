# Docker Setup Guide

This guide explains how to run the entire Hotel Booking application (frontend, backend, and database) using Docker.

## Fixed Issues

### 1. **Port Configuration**
- ✅ Backend now correctly runs on **port 5001** (consistent across Dockerfile, docker-compose, and code)
- ✅ Frontend now correctly runs on **port 5174**
- ✅ MongoDB runs on **port 27017**
- ✅ Frontend API client updated to use `http://localhost:5001` for local dev and respects `VITE_API_BASE_URL` env var for Docker

### 2. **Created Missing Frontend Dockerfile**
- ✅ Frontend now has a complete Dockerfile that runs Vite dev server in Docker
- ✅ Frontend properly exposes port 5174 with correct hostname configuration

### 3. **Docker Compose Service Integration**
- ✅ Added frontend service to docker-compose.yml
- ✅ Frontend properly depends on backend service
- ✅ Frontend service uses `VITE_API_BASE_URL=http://backend:5001` for inter-container communication
- ✅ Backend environment variables now have proper dummy values for external services

### 4. **Environment Variables**
- ✅ All external service variables (Google, Cloudinary, Stripe) now have dummy defaults
- ✅ Backend validation passes with dummy values
- ✅ Created `.env.local` for frontend with proper API base URL
- ✅ Root `.env` file documented with clear sections

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Docker Network                       │
├──────────────┬─────────────────────┬──────────────────┤
│  Frontend    │     Backend         │    MongoDB       │
│  :5174       │      :5001          │     :27017       │
│              │                     │                  │
│ (Vite Dev)   │ (Express.js)        │ (Database)       │
│              │                     │                  │
│ Port 5174    │ Port 5001           │ Port 27017       │
│ (Host)       │ (Host & Container)  │ (Host & Container)
└──────────────┴─────────────────────┴──────────────────┘

Communication:
- Frontend → Backend: http://localhost:5001 (from host browser)
- Frontend → Backend: http://backend:5001 (from within Docker)
- Backend → MongoDB: mongodb://root:mongodb_password@mongodb:27017/
```

## Running with Docker

### Prerequisites
- Docker and Docker Compose installed
- `.env` file in root directory (already configured)

### Start All Services

```bash
# From repo root directory
docker-compose up --build

# Or in detached mode (background)
docker-compose up --build -d
```

### Access the Application

Once all services are healthy:
- **Frontend**: http://localhost:5174
- **Backend API**: http://localhost:5001
- **Backend API Docs**: http://localhost:5001/api-docs
- **Health Check**: http://localhost:5001/api/health

### Stop Services

```bash
# Stop and remove containers
docker-compose down

# Stop but keep containers (useful for quick restart)
docker-compose stop

# Restart stopped containers
docker-compose start
```

### View Logs

```bash
# View all logs
docker-compose logs

# Follow logs in real-time
docker-compose logs -f

# View logs for specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb
```

## Environment Variables

### Backend (.env)
All variables are already configured with dummy values suitable for local development:

```env
# Core
NODE_ENV=development
PORT=5001

# Database
MONGODB_CONNECTION_STRING=mongodb://root:mongodb_password@mongodb:27017/hotel_booking?authSource=admin

# Auth
JWT_SECRET_KEY=development-secret-key-change-in-production

# Frontend
FRONTEND_URL=http://localhost:5174

# External Services (Dummy values - safe for local dev)
GOOGLE_ID=dummy-google-id
GOOGLE_SECRET=dummy-google-secret
CLOUDINARY_CLOUD_NAME=dummy-cloudinary
CLOUDINARY_API_KEY=dummy-api-key
CLOUDINARY_API_SECRET=dummy-api-secret
STRIPE_API_KEY=sk_test_dummy_stripe_key
```

### Frontend (.env.local)
```env
VITE_API_BASE_URL=http://localhost:5001
```

> Note: In Docker, this is overridden to `http://backend:5001` via docker-compose.yml

## Local Development (Without Docker)

If you prefer to run services locally without Docker:

### Backend
```bash
cd hotel-booking-backend
npm install
npm run dev
# Runs on http://localhost:5001
```

### Frontend
```bash
cd hotel-booking-frontend
npm install
npm run dev
# Runs on http://localhost:5174
```

### MongoDB
```bash
# Install MongoDB locally or use Docker for just MongoDB:
docker run -d \
  --name mongodb \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=root \
  -e MONGO_INITDB_ROOT_PASSWORD=mongodb_password \
  -e MONGO_INITDB_DATABASE=hotel_booking \
  mongo:latest
```

> Make sure to set `VITE_API_BASE_URL=http://localhost:5001` in `.env.local` for frontend to communicate with backend.

## Troubleshooting

### Frontend can't connect to backend
- Check that backend container is healthy: `docker-compose ps`
- Check backend logs: `docker-compose logs backend`
- Verify VITE_API_BASE_URL is correctly set in docker-compose.yml or .env.local
- In Docker: use `http://backend:5001`
- Local dev: use `http://localhost:5001`

### Port already in use
```bash
# Find what's using the port (macOS/Linux)
lsof -i :5001
lsof -i :5174
lsof -i :27017

# Kill the process
kill -9 <PID>

# Or change ports in docker-compose.yml
```

### MongoDB connection issues
- Verify MongoDB service is healthy: `docker-compose ps`
- Check MongoDB logs: `docker-compose logs mongodb`
- Verify connection string in .env matches service configuration
- Wait for MongoDB healthcheck to pass before backend starts

### Container build fails
```bash
# Clean rebuild everything
docker-compose down -v
docker-compose up --build --no-cache
```

## Production Notes

For production deployment:
1. Replace dummy external service credentials with real ones
2. Use strong `JWT_SECRET_KEY` (not development key)
3. Update `FRONTEND_URL` to your domain
4. Use production MongoDB connection string
5. Update CORS allowed origins in backend/src/index.ts
6. Consider using environment-specific .env files

## File Structure

```
hotel-booking-2000/
├── .env                              # Backend env vars (shared with docker-compose)
├── docker-compose.yml                # Docker orchestration (FIXED)
├── hotel-booking-backend/
│   ├── Dockerfile                    # Backend Docker image (FIXED)
│   ├── package.json
│   └── src/
│       └── index.ts                  # Listens on PORT env var
├── hotel-booking-frontend/
│   ├── Dockerfile                    # Frontend Docker image (CREATED)
│   ├── .env.local                    # Frontend API URL (CREATED)
│   ├── package.json
│   ├── vite.config.ts
│   └── src/
│       └── lib/api-client.ts         # Uses VITE_API_BASE_URL (FIXED)
└── DOCKER_SETUP.md                   # This file
```
