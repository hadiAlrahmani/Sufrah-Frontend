import { useEffect, useState } from "react"; // Import hooks for state and side effects
import { Link } from "react-router-dom"; // Import Link for navigation
import {
  fetchAdminRestaurants,
} from "../../services/adminService"; // Import admin service functions
import "./AdminDashboard.css"; // Import the CSS file for styles

const AdminDashboard = () => {
  const [restaurants, setRestaurants] = useState([]); // State for storing restaurants

  useEffect(() => {
    const loadData = async () => {
      const fetchedRestaurants = await fetchAdminRestaurants(); // Fetch restaurants for admin
      setRestaurants(fetchedRestaurants); // Update restaurants state
    };

    loadData(); // Call loadData function to fetch data on mount
  }, []); // Run only on component mount

  return (
    <div className="admin-dashboard">
      <h1 className="admin-dashboard__title">Admin Dashboard</h1>

      <h2 className="admin-dashboard__section-title">Manage Restaurants</h2>
      <Link to="/admin/create-restaurant">
        <button className="admin-dashboard__btn">Create New Restaurant</button> {/* Button to create a new restaurant */}
      </Link>

      {restaurants.length > 0 ? ( // Check if there are restaurants to display
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
                  className="btn btn-primary admin-dashboard__link mr-2"
                  to={`/admin/restaurant/${restaurant._id}/menu`}
                >
                  Manage Menu {/* Link to manage restaurant menu */}
                </Link>

                {/* Add an "Edit" button for each restaurant */}
                <Link
                  className="btn btn-secondary admin-dashboard__link mr-2"
                  to={`/admin/restaurant/${restaurant._id}/edit`}
                >
                  Edit Restaurant {/* Link to edit restaurant */}
                </Link>

                {/* Add a "View Orders" button for each restaurant */}
                <Link
                  className="btn btn-success admin-dashboard__link"
                  to={`/admin/orders/${restaurant._id}`}
                >
                  View Orders {/* Link to view orders for that specific restaurant */}
                </Link>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="admin-dashboard__no-data">No restaurants available.</p> // Message if no restaurants
      )}
    </div>
  );
};

export default AdminDashboard; // Export the AdminDashboard component