import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import axios from 'axios';

describe('Hotel API Client', () => {
  const API_BASE_URL = 'http://localhost:5001';

  beforeAll(() => {
    console.log('Starting API tests against:', API_BASE_URL);
  });

  afterAll(() => {
    console.log('API tests completed');
  });

  it('should fetch all hotels from /api/hotels', async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/hotels`);
      console.log('Hotels Response:', response.status, response.data.length);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.data.length).toBeGreaterThan(0);
      console.log('✅ Fetch hotels test passed. Count:', response.data.length);
    } catch (error: any) {
      console.error('❌ Fetch hotels failed:', error.message);
      throw error;
    }
  });

  it('should search hotels with no filters', async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/hotels/search`);
      console.log('Search Response:', response.status, response.data.data?.length);
      expect(response.status).toBe(200);
      expect(response.data.data).toBeDefined();
      expect(Array.isArray(response.data.data)).toBe(true);
      console.log('✅ Search hotels test passed. Count:', response.data.data.length);
    } catch (error: any) {
      console.error('❌ Search hotels failed:', error.message);
      throw error;
    }
  });

  it('should search hotels by destination (city)', async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/hotels/search?destination=Paris`);
      console.log('Search Paris Response:', response.status, response.data.data?.length);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data.data)).toBe(true);
      expect(response.data.data.length).toBeGreaterThan(0);
      expect(response.data.data[0].city).toContain('Paris');
      console.log('✅ Search by city test passed. Found:', response.data.data.length, 'hotels');
    } catch (error: any) {
      console.error('❌ Search by city failed:', error.message);
      throw error;
    }
  });

  it('should search hotels by price filter', async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/hotels/search?maxPrice=150`);
      console.log('Search Price Response:', response.status, response.data.data?.length);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data.data)).toBe(true);
      expect(response.data.data.every((h: any) => h.pricePerNight <= 150)).toBe(true);
      console.log('✅ Search by price test passed. Found:', response.data.data.length, 'hotels under $150');
    } catch (error: any) {
      console.error('❌ Search by price failed:', error.message);
      throw error;
    }
  });

  it('should fetch specific hotel by ID', async () => {
    try {
      // First get a hotel ID
      const hotelsResponse = await axios.get(`${API_BASE_URL}/api/hotels`);
      const firstHotelId = hotelsResponse.data[0]._id;

      const response = await axios.get(`${API_BASE_URL}/api/hotels/${firstHotelId}`);
      console.log('Single Hotel Response:', response.status, response.data.name);
      expect(response.status).toBe(200);
      expect(response.data._id).toBe(firstHotelId);
      console.log('✅ Fetch by ID test passed. Hotel:', response.data.name);
    } catch (error: any) {
      console.error('❌ Fetch by ID failed:', error.message);
      throw error;
    }
  });

  it('should return paginated search results', async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/hotels/search`);
      console.log('Pagination Response:', response.data.pagination);
      expect(response.data.pagination).toBeDefined();
      expect(response.data.pagination.total).toBeGreaterThan(0);
      expect(response.data.pagination.pages).toBeGreaterThan(0);
      console.log('✅ Pagination test passed. Total:', response.data.pagination.total, 'Pages:', response.data.pagination.pages);
    } catch (error: any) {
      console.error('❌ Pagination test failed:', error.message);
      throw error;
    }
  });
});
