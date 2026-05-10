# Quick Start Guide

## Everything is Fixed! ✅

All port and environment variable issues are resolved. You can now run the entire app with Docker.

## 🚀 Start Everything (Recommended)

```bash
cd /Users/tanmaynautiyal/Desktop/hotel-booking-2000
docker-compose up --build
```

**Wait for all services to be healthy** (should take ~30-45 seconds). You'll see:
```
✅ hotel-booking-mongodb is healthy
✅ hotel-booking-backend is healthy  
✅ hotel-booking-frontend is healthy
```

## 🌐 Access the App

| Service | URL |
|---------|-----|
| **Frontend** | http://localhost:5174 |
| **Backend API** | http://localhost:5001 |
| **API Documentation** | http://localhost:5001/api-docs |
| **Database** | localhost:27017 (MongoDB) |

## 🛑 Stop Services

```bash
# Stop containers
docker-compose down

# Stop and remove everything (including DB data)
docker-compose down -v
```

## 📋 What Was Fixed

### Problems Fixed:
1. ✅ **Port chaos** - Backend now consistently uses port 5001
2. ✅ **Missing frontend Dockerfile** - Created complete Docker setup for frontend
3. ✅ **Incomplete docker-compose** - Added frontend service and proper networking
4. ✅ **Environment variables** - Added dummy values for all external services
5. ✅ **API communication** - Frontend correctly connects to backend on correct port

### Files Modified:
- `docker-compose.yml` - Added frontend service, fixed environment variables
- `hotel-booking-backend/Dockerfile` - Changed EXPOSE port to 5001
- `hotel-booking-frontend/src/lib/api-client.ts` - Updated default API port to 5001

### Files Created:
- `hotel-booking-frontend/Dockerfile` - Frontend containerization
- `hotel-booking-frontend/.env.local` - Frontend environment config
- `DOCKER_SETUP.md` - Complete Docker documentation
- `FIXES_SUMMARY.md` - Detailed explanation of all fixes

## 🔧 Local Development (Without Docker)

### Run Backend
```bash
cd hotel-booking-backend
npm install
npm run dev
```

### Run Frontend
```bash
cd hotel-booking-frontend
npm install
npm run dev
```

### Run MongoDB (Docker only)
```bash
docker run -d \
  --name mongodb \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=root \
  -e MONGO_INITDB_ROOT_PASSWORD=mongodb_password \
  -e MONGO_INITDB_DATABASE=hotel_booking \
  mongo:latest
```

## 🔑 Environment Variables

All dummy values are pre-configured and safe for local development:

```env
# Backend
PORT=5001
MONGODB_CONNECTION_STRING=mongodb://root:mongodb_password@mongodb:27017/hotel_booking

# Frontend  
VITE_API_BASE_URL=http://localhost:5001
```

Replace dummy values in `.env` for production:
- `GOOGLE_ID` / `GOOGLE_SECRET`
- `CLOUDINARY_*` credentials
- `STRIPE_API_KEY`

## 🐛 Troubleshooting

### Frontend can't connect to backend?
- Make sure backend is healthy: `docker-compose ps`
- Check the healthcheck: `docker-compose logs backend`
- Verify VITE_API_BASE_URL is correct in docker-compose.yml

### Port already in use?
```bash
# Find what's using the port
lsof -i :5001  # For backend
lsof -i :5174  # For frontend

# Kill the process
kill -9 <PID>
```

### MongoDB won't connect?
```bash
# Check if MongoDB service is healthy
docker-compose ps

# View MongoDB logs
docker-compose logs mongodb

# Rebuild everything
docker-compose down -v
docker-compose up --build
```

## 📚 More Information

- **DOCKER_SETUP.md** - Comprehensive Docker guide with detailed architecture
- **FIXES_SUMMARY.md** - Complete list of all issues and fixes

## ✨ You're All Set!

The app is fully configured and ready to run. Just execute:

```bash
docker-compose up --build
```

Then open http://localhost:5174 in your browser! 🎉
