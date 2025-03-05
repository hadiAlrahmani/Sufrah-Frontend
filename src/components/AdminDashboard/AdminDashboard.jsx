import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchAdminRestaurants, fetchAdminOrders } from "../../services/adminService";

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
    <div>
      <h1>Admin Dashboard</h1>

      <h2>Manage Restaurants</h2>
      <Link to="/admin/create-restaurant">
        <button>Create New Restaurant</button>
      </Link>

      {restaurants.length > 0 ? (
        <ul>
          {restaurants.map((restaurant) => (
            <li key={restaurant._id}>
              <h3>{restaurant.name}</h3>
              <Link to={`/admin/restaurant/${restaurant._id}/menu`}>Manage Menu</Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No restaurants available.</p>
      )}

      <h2>Manage Orders</h2>
      {orders.length > 0 ? (
        <ul>
          {orders.map((order) => (
            <li key={order._id}>
              Order from {order.restaurant?.name || "Unknown"} - {order.status}
              <Link to={`/admin/order/${order._id}`}>View Order</Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No orders available.</p>
      )}
    </div>
  );
};

export default AdminDashboard;

