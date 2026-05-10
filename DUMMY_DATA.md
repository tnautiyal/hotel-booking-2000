# Dummy Data Seeding Guide

The hotel booking system includes automatic database seeding with 100 hotels and 5 test users. This is perfect for development, testing, and demoing the filtering system.

## What Gets Seeded

### 5 Test Users
All with password: **`TestPass123!`**

```
user1@test.com
user2@test.com
user3@test.com
user4@test.com
user5@test.com
```

### 100 Hotels
Spread across 20 USA cities and 20 European cities:

**USA Cities (20):**
- New York, Los Angeles, Chicago, Houston, Phoenix
- Philadelphia, San Antonio, San Diego, Dallas, San Jose
- Austin, Denver, Boston, Miami, Las Vegas
- Seattle, San Francisco, Washington DC, Orlando, New Orleans

**European Cities (20):**
- Paris, London, Berlin, Amsterdam, Barcelona
- Madrid, Rome, Venice, Florence, Prague
- Budapest, Vienna, Zurich, Brussels, Lisbon
- Dublin, Athens, Istanbul, Stockholm, Copenhagen

### Hotel Details
Each hotel includes:
- **Name**: Randomly generated from 40+ hotel name patterns
- **Location**: Specific city and country
- **Type**: Hotel, Motel, Resort, Hostel, Guesthouse, Inn, Boutique, or Luxury
- **Price**: $50-$300 per night (randomly distributed)
- **Rating**: 3-5 stars (3, 3.5, 4, 4.5, or 5)
- **Facilities**: 4-12 randomly selected amenities (WiFi, Pool, Gym, Spa, etc.)
- **Capacity**: Adult and child counts for testing filtering
- **Images**: Placeholder images via placeholder.com

## Controlling Seeding

### Environment Variable: `SEED_DATABASE`

**Default:** `true` (seeding is enabled)

#### Enable Seeding (Default)
```bash
# In .env or docker-compose
SEED_DATABASE=true
```

The database will be seeded automatically when the backend starts:
- ✅ On first startup (database is empty)
- ✅ Automatically skipped if data already exists (prevents duplicates)

#### Disable Seeding
```bash
# In .env or docker-compose
SEED_DATABASE=false
```

Use this when:
- You want to start with an empty database
- You're in production
- You're using your own database setup
- You've already manually configured data

## How to Use

### Docker (Recommended)

1. **First Run - Automatic Seeding**
   ```bash
   cd /path/to/hotel-booking-2000
   docker-compose up --build
   ```
   
   The backend will automatically:
   - Connect to MongoDB
   - Detect empty database
   - Create 5 test users
   - Create 100 hotels
   - Skip seeding on subsequent runs (data already exists)

2. **Reset Everything and Re-seed**
   ```bash
   # Remove volumes to clear database
   docker-compose down -v
   
   # Restart (will re-seed)
   docker-compose up
   ```

3. **Disable Seeding**
   ```bash
   # Modify .env
   echo "SEED_DATABASE=false" >> .env
   
   # Restart
   docker-compose down
   docker-compose up
   ```

### Local Development (Without Docker)

1. **Start MongoDB**
   ```bash
   # Using Docker for just MongoDB
   docker run -d \
     --name mongodb \
     -p 27017:27017 \
     -e MONGO_INITDB_ROOT_USERNAME=root \
     -e MONGO_INITDB_ROOT_PASSWORD=mongodb_password \
     -e MONGO_INITDB_DATABASE=hotel_booking \
     mongo:latest
   ```

2. **Set Environment**
   ```bash
   cd hotel-booking-backend
   
   # Create/edit .env
   SEED_DATABASE=true
   MONGODB_CONNECTION_STRING=mongodb://root:mongodb_password@localhost:27017/hotel_booking?authSource=admin
   # ... other env vars
   ```

3. **Start Backend**
   ```bash
   npm run dev
   ```
   
   The backend will automatically seed the database on startup.

## Seeding Behavior

### Idempotent (Safe to Re-run)
- ✅ Seeding only runs if the database is **completely empty**
- ✅ If any users or hotels exist, seeding is skipped
- ✅ Safe to run multiple times without data duplication
- ✅ Safe to restart containers without re-seeding

### Example Scenarios

**Scenario 1: Fresh Start**
```
1. docker-compose up --build
2. Database is empty → Seeding runs
3. 5 users + 100 hotels created
4. Backend ready at http://localhost:5001
```

**Scenario 2: Restart Container**
```
1. docker-compose down (keeps database)
2. docker-compose up
3. Database still has data → Seeding skipped
4. All previous data intact
```

**Scenario 3: Clear and Re-seed**
```
1. docker-compose down -v (removes volumes)
2. docker-compose up
3. Database is empty → Seeding runs
4. Fresh 5 users + 100 hotels created
```

## Login and Test

### Using Test Credentials

1. Open frontend: http://localhost:5174
2. Click "Sign In"
3. Use any test user:
   ```
   Email: user1@test.com
   Password: TestPass123!
   ```

### Test Features

Once logged in, you can test:
- **Hotel Search**: Try filtering by location (search for "New York", "Paris", etc.)
- **Price Filtering**: Filter by price range ($50-$100, $100-$150, etc.)
- **Star Rating**: Filter by hotel rating (3 star, 4 star, 5 star)
- **Facility Filtering**: Filter by amenities (WiFi, Pool, Gym, etc.)
- **Location Range**: All hotels are across real USA and European cities

## Development Notes

### Seed File Location
- File: `hotel-booking-backend/src/utils/seed.ts`
- Triggered by: `hotel-booking-backend/src/index.ts` (connectDB function)
- Condition: `SEED_DATABASE !== "false"` AND database is empty

### Modifying Seed Data

To change what gets seeded, edit `src/utils/seed.ts`:

```typescript
// Add more cities
HOTEL_LOCATIONS.push({ city: "Vienna", country: "Austria", lat: 48.2, lng: 16.4 });

// Add more hotel names
HOTEL_NAMES.push("My Awesome Hotel");

// Add more test users
TEST_USERS.push({ email: "user6@test.com", firstName: "David", lastName: "Lee", password: "TestPass123!" });

// Change price range
function getRandomPrice(): number {
  return Math.floor(Math.random() * 500) + 100; // Now $100-$600
}
```

Then rebuild and restart:
```bash
docker-compose down -v
docker-compose up --build
```

## Troubleshooting

### Hotels not created but users are?
- Check `SEED_DATABASE` is not set to `false`
- Check backend logs: `docker-compose logs backend`
- Verify MongoDB is healthy: `docker-compose ps`

### Database already populated error?
- This is normal! It means seeding was skipped (data already exists)
- To reset: `docker-compose down -v` then `docker-compose up`

### Want to start fresh?
```bash
# Option 1: Remove volumes (safest)
docker-compose down -v
docker-compose up

# Option 2: Manual MongoDB clear
docker-compose exec mongodb mongosh -u root -p mongodb_password hotel_booking
# Then in mongosh:
# db.users.deleteMany({})
# db.hotels.deleteMany({})
```

## Production Considerations

⚠️ **Important**: Disable seeding in production!

```env
# production .env
SEED_DATABASE=false
NODE_ENV=production
```

The seeding feature is designed for development and testing. Production environments should:
- Keep `SEED_DATABASE=false`
- Manage data through admin panels or manual operations
- Never auto-populate production databases
