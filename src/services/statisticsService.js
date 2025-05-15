export const fetchRestaurantStatistics = async (restaurantId) => {
    try {
      const response = await fetch(`/api/statistics/${restaurantId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch statistics");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching restaurant statistics:", error);
      return null;
    }
  };