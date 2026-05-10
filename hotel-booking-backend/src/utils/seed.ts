import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/user";
import Hotel from "../models/hotel";

// US and European cities with coordinates
const HOTEL_LOCATIONS = [
  // USA Cities
  { city: "New York", country: "USA", lat: 40.7128, lng: -74.006 },
  { city: "Los Angeles", country: "USA", lat: 34.0522, lng: -118.2437 },
  { city: "Chicago", country: "USA", lat: 41.8781, lng: -87.6298 },
  { city: "Houston", country: "USA", lat: 29.7604, lng: -95.3698 },
  { city: "Phoenix", country: "USA", lat: 33.4484, lng: -112.074 },
  { city: "Philadelphia", country: "USA", lat: 39.9526, lng: -75.1652 },
  { city: "San Antonio", country: "USA", lat: 29.4241, lng: -98.4936 },
  { city: "San Diego", country: "USA", lat: 32.7157, lng: -117.1611 },
  { city: "Dallas", country: "USA", lat: 32.7767, lng: -96.797 },
  { city: "San Jose", country: "USA", lat: 37.3382, lng: -121.8863 },
  { city: "Austin", country: "USA", lat: 30.2672, lng: -97.7431 },
  { city: "Denver", country: "USA", lat: 39.7392, lng: -104.9903 },
  { city: "Boston", country: "USA", lat: 42.3601, lng: -71.0589 },
  { city: "Miami", country: "USA", lat: 25.761, lng: -80.1913 },
  { city: "Las Vegas", country: "USA", lat: 36.1699, lng: -115.1398 },
  { city: "Seattle", country: "USA", lat: 47.6062, lng: -122.3321 },
  { city: "San Francisco", country: "USA", lat: 37.7749, lng: -122.4194 },
  { city: "Washington DC", country: "USA", lat: 38.9072, lng: -77.0369 },
  { city: "Orlando", country: "USA", lat: 28.5383, lng: -81.3792 },
  { city: "New Orleans", country: "USA", lat: 29.9511, lng: -90.2623 },

  // European Cities
  { city: "Paris", country: "France", lat: 48.8566, lng: 2.3522 },
  { city: "London", country: "UK", lat: 51.5074, lng: -0.1278 },
  { city: "Berlin", country: "Germany", lat: 52.52, lng: 13.405 },
  { city: "Amsterdam", country: "Netherlands", lat: 52.3676, lng: 4.9041 },
  { city: "Barcelona", country: "Spain", lat: 41.3874, lng: 2.1686 },
  { city: "Madrid", country: "Spain", lat: 40.4168, lng: -3.7038 },
  { city: "Rome", country: "Italy", lat: 41.9028, lng: 12.4964 },
  { city: "Venice", country: "Italy", lat: 45.4408, lng: 12.3155 },
  { city: "Florence", country: "Italy", lat: 43.7696, lng: 11.2558 },
  { city: "Prague", country: "Czech Republic", lat: 50.0755, lng: 14.4378 },
  { city: "Budapest", country: "Hungary", lat: 47.4979, lng: 19.0402 },
  { city: "Vienna", country: "Austria", lat: 48.2082, lng: 16.3738 },
  { city: "Zurich", country: "Switzerland", lat: 47.3769, lng: 8.5472 },
  { city: "Brussels", country: "Belgium", lat: 50.8503, lng: 4.3517 },
  { city: "Lisbon", country: "Portugal", lat: 38.7223, lng: -9.1393 },
  { city: "Dublin", country: "Ireland", lat: 53.3498, lng: -6.2603 },
  { city: "Athens", country: "Greece", lat: 37.9838, lng: 23.7275 },
  { city: "Istanbul", country: "Turkey", lat: 41.0082, lng: 28.9784 },
  { city: "Stockholm", country: "Sweden", lat: 59.3293, lng: 18.0686 },
  { city: "Copenhagen", country: "Denmark", lat: 55.6761, lng: 12.5683 },
];

const HOTEL_NAMES = [
  "Grand Palace", "Royal Mansion", "Luxury Vista", "Elegant Suites", "Premium Stay",
  "Prestige Hotel", "Elite Retreat", "Opulent Rest", "Magnificent Inn", "Splendid Lodge",
  "Majestic Plaza", "Supreme Court", "Executive Tower", "Metropolitan", "Continental",
  "International", "Ambassador", "Presidential", "Imperial", "Sovereign",
  "Meridian", "Zenith", "Pinnacle", "Summit", "Apex",
  "Paradise Bay", "Ocean Breeze", "Sunset Harbor", "Sky View", "Riverside",
  "Mountain Peak", "Valley View", "Garden Estate", "Park Plaza", "Forest Lodge",
  "Stone Manor", "Brick House", "Iron Gate", "Bronze Tower", "Silver Dome",
];

const HOTEL_TYPES = ["Hotel", "Motel", "Resort", "Hostel", "Guesthouse", "Inn", "Boutique", "Luxury"];

const FACILITIES = [
  "Free WiFi",
  "Swimming Pool",
  "Gym",
  "Spa",
  "Restaurant",
  "Bar",
  "Room Service",
  "Parking",
  "Air Conditioning",
  "Heating",
  "TV",
  "Mini Bar",
  "Coffee Maker",
  "Balcony",
  "Sea View",
  "City View",
  "Pet Friendly",
];

const TEST_USERS = [
  { email: "user1@test.com", firstName: "John", lastName: "Doe", password: "TestPass123!" },
  { email: "user2@test.com", firstName: "Jane", lastName: "Smith", password: "TestPass123!" },
  { email: "user3@test.com", firstName: "Bob", lastName: "Johnson", password: "TestPass123!" },
  { email: "user4@test.com", firstName: "Alice", lastName: "Williams", password: "TestPass123!" },
  { email: "user5@test.com", firstName: "Charlie", lastName: "Brown", password: "TestPass123!" },
];

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomFacilities(): string[] {
  const count = Math.floor(Math.random() * 8) + 4; // 4-12 facilities
  const shuffled = [...FACILITIES].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function getRandomStarRating(): number {
  const ratings = [3, 3.5, 4, 4.5, 5];
  return getRandomElement(ratings);
}

function getRandomPrice(): number {
  return Math.floor(Math.random() * 250) + 50; // $50 - $300 per night
}

export async function seedDatabase() {
  try {
    const isDatabaseEmpty = await User.countDocuments() === 0;

    if (!isDatabaseEmpty) {
      console.log("✅ Database already populated. Skipping seed.");
      return;
    }

    console.log("🌱 Starting database seed...");

    // Create test users
    console.log("👥 Creating test users...");
    const hashedUsers = await Promise.all(
      TEST_USERS.map(async (userData) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userData.password, salt);
        return {
          ...userData,
          password: hashedPassword,
        };
      })
    );

    const createdUsers = await User.insertMany(hashedUsers);
    console.log(`✅ Created ${createdUsers.length} test users`);

    // Create hotels
    console.log("🏨 Creating 100 hotels...");
    const hotels = [];

    for (let i = 0; i < 100; i++) {
      const location = getRandomElement(HOTEL_LOCATIONS);
      const facilities = getRandomFacilities();
      const hotelType = getRandomElement(HOTEL_TYPES);

      const hotel = {
        userId: createdUsers[i % createdUsers.length]._id,
        name: `${getRandomElement(HOTEL_NAMES)} - ${location.city}`,
        description: `A wonderful ${hotelType.toLowerCase()} located in ${location.city}, ${location.country}. Experience luxury and comfort with our premium facilities and outstanding service.`,
        country: location.country,
        city: location.city,
        type: [hotelType],
        adultCount: Math.floor(Math.random() * 4) + 1,
        childCount: Math.floor(Math.random() * 4),
        facilities,
        pricePerNight: getRandomPrice(),
        starRating: getRandomStarRating(),
        imageUrls: [
          `https://via.placeholder.com/800x600?text=${location.city}+Hotel+1`,
          `https://via.placeholder.com/800x600?text=${location.city}+Hotel+2`,
          `https://via.placeholder.com/800x600?text=${location.city}+Hotel+3`,
        ],
        lastUpdated: new Date(),
        location: {
          latitude: location.lat,
          longitude: location.lng,
          address: {
            street: `${Math.floor(Math.random() * 999) + 1} ${getRandomElement(["Main", "Park", "River", "Mountain", "Ocean", "Central"])} Street`,
            city: location.city,
            country: location.country,
            zipCode: String(Math.floor(Math.random() * 90000) + 10000),
          },
        },
      };

      hotels.push(hotel);
    }

    const createdHotels = await Hotel.insertMany(hotels);
    console.log(`✅ Created ${createdHotels.length} hotels`);

    console.log("🌱 Database seed completed successfully!");
    console.log("\n📝 Test User Credentials:");
    TEST_USERS.forEach((user) => {
      console.log(`   Email: ${user.email} | Password: ${user.password}`);
    });

  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}
