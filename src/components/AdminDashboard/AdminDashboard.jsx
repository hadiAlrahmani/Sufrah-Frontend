import { useEffect, useState } from "react"; // Import hooks for state and side effects
import { Link } from "react-router-dom"; // Import Link for navigation
import { fetchAdminRestaurants } from "../../services/adminService"; // Import admin service functions
import RestaurantStatistics from "./RestaurantStatistics/RestaurantStatistics"; // Import RestaurantStatistics component
import "./AdminDashboard.css"; // Import the CSS file for styles

//! fetch resturants and store in state
const AdminDashboard = () => {
  const [restaurants, setRestaurants] = useState([]); // State for storing restaurants
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(null); // State for storing selected restaurant's ID

  // here the fetchAdminRestaurants function gets called inside a useEffect It fetches restaurant data from the backend. Then setRestaurants(...) stores that data in state And that’s how the restaurant cards/buttons are displayed in the UI.
  useEffect(() => {
    const loadData = async () => {
      const fetchedRestaurants = await fetchAdminRestaurants(); // Fetch restaurants for admin
      setRestaurants(fetchedRestaurants); // Update restaurants state
    };

    loadData(); // Call loadData function to fetch data on mount
  }, []); // Run only on component mount

  const handleStatisticsClick = (restaurantId) => {
    setSelectedRestaurantId(restaurantId); // Set the restaurant ID to show stats
  };

  return (
    <div className="admin-dashboard">
      <h1 className="admin-dashboard__title">Admin Dashboard</h1>

      <h2 className="admin-dashboard__section-title">Manage Restaurants</h2>
      <Link to="/admin/create-restaurant">
        <button className="admin-dashboard__btn">Create New Restaurant</button>
      </Link>

      {restaurants.length > 0 ? (
        <ul className="admin-dashboard__list">
          {restaurants.map((restaurant) => (
            <li
              key={restaurant._id} // Unique key for each restaurant
              className="admin-dashboard__list-item d-flex justify-content-between align-items-center"
            >
              <h3 className="admin-dashboard__restaurant-name mb-0">
                {restaurant.name} {/* Display restaurant name */}
              </h3>
              <div className="d-flex">
                <Link
                  className="admin-dashboard__btn-indigo mr-2"
                  to={`/admin/restaurant/${restaurant._id}/menu`}
                >
                  Manage Menu
                </Link>

                <Link
                  className="admin-dashboard__btn-amber mr-2"
                  to={`/admin/restaurant/${restaurant._id}/edit`}
                >
                  Edit Restaurant
                </Link>

                <Link
                  className="admin-dashboard__btn-emerald mr-2"
                  to={`/admin/orders/${restaurant._id}`}
                >
                  View Orders
                </Link>

                {/* Add a "View Statistics" button for each restaurant */}
                <button
                  className="btn btn-info admin-dashboard__link"
                  onClick={() => handleStatisticsClick(restaurant._id)}
                >
                  View Statistics
                </button>
              </div>

              {/* Show the RestaurantStatistics component if a restaurant is selected */}
              {selectedRestaurantId === restaurant._id && (
                <RestaurantStatistics restaurantId={restaurant._id} />
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="admin-dashboard__no-data">No restaurants available.</p>
      )}
    </div>
  );
};

export default AdminDashboard;