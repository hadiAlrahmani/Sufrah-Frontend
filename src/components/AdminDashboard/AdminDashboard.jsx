import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  fetchAdminRestaurants,
  fetchAdminOrders,
} from "../../services/adminService";
import "./AdminDashboard.css"; // Import the CSS file for styles

const AdminDashboard = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const fetchedRestaurants = await fetchAdminRestaurants();
      const fetchedOrders = await fetchAdminOrders();
      setRestaurants(fetchedRestaurants);
      setOrders(fetchedOrders);
    };

    loadData();
  }, []);

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
              key={restaurant._id}
              className="admin-dashboard__list-item d-flex justify-content-between align-items-center"
            >
              <h3 className="admin-dashboard__restaurant-name mb-0">
                {restaurant.name}
              </h3>
              <Link
                className="btn btn-primary admin-dashboard__link"
                to={`/admin/restaurant/${restaurant._id}/menu`}
              >
                Manage Menu
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="admin-dashboard__no-data">No restaurants available.</p>
      )}

      <h2 className="admin-dashboard__section-title">Manage Orders</h2>
      {orders.length > 0 ? (
        <ul className="admin-dashboard__list">
          {orders.map((order) => (
            <li
              key={order._id}
              className="admin-dashboard__list-item d-flex justify-content-between align-items-center"
            >
              <p className="admin-dashboard__order-details mb-0">
                Order from {order.restaurant?.name || "Unknown"} -{" "}
                {order.status}
              </p>
              <Link
                className="btn btn-primary admin-dashboard__link"
                to={`/admin/order/${order._id}`}
              >
                View Order
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="admin-dashboard__no-data">No orders available.</p>
      )}
    </div>
  );
};

export default AdminDashboard;
