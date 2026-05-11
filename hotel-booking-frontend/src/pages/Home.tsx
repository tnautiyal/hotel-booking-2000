import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import LatestDestinationCard from "../components/LastestDestinationCard";
import Hero from "../components/Hero";

const Home = () => {
  const { data: hotels, isLoading, error } = useQuery("fetchQuery", () =>
    apiClient.fetchHotels(),
    {
      retry: 3,
      retryDelay: 1000,
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 10, // 10 minutes
    }
  );

  // Debug logging
  console.log("Home page state:", {
    hotelsCount: hotels?.length,
    isLoading,
    hasError: !!error,
    error: error?.message,
    hotels: hotels?.slice(0, 2),
  });

  const handleSearch = (searchData: any) => {
    console.log("Search initiated with:", searchData);
  };

  return (
    <>
      <Hero onSearch={handleSearch} />
      <div className="space-y-8">
        {/* Latest Destinations Section */}
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Latest Destinations
            </h2>
            <p className="text-gray-600">
              Most recent destinations added by our hosts
            </p>
          </div>

          {isLoading && (
            <div className="text-center py-12">
              <div className="inline-block">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              </div>
              <p className="mt-4 text-gray-600">Loading destinations...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-800 font-semibold">Error Loading Hotels</p>
              <p className="text-red-600 text-sm">{error instanceof Error ? error.message : 'Failed to load hotels'}</p>
              <p className="text-red-600 text-xs mt-2">
                Check that the backend API is running at {apiClient.getApiBaseUrl()}
              </p>
            </div>
          )}

          {!isLoading && !error && hotels && hotels.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No hotels found. Please check back later!</p>
            </div>
          )}

          {!isLoading && hotels && hotels.length > 0 && (
            <>
              <p className="text-center text-gray-600 mb-6">
                Showing {hotels.length} amazing destinations
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {hotels.map((hotel) => (
                  <LatestDestinationCard key={hotel._id} hotel={hotel} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
