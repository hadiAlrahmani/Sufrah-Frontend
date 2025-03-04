import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_EXPRESS_BACKEND_URL;

const AdminDashboard = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchRestaurants();
    fetchOrders();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/restaurants/admin`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch restaurants");
      }

      const data = await res.json();
      setRestaurants(data);
    } catch (err) {
      console.error("Error fetching restaurants:", err);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/orders`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

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
              <Link to={`/admin/restaurant/${restaurant._id}/menu`}>
                Manage Menu
              </Link>
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

//! CODE GRAVEYARD

// // Fetch all restaurants
// const fetchRestaurants = async () => {
//   try {
//     const res = await fetch(`${BACKEND_URL}/restaurants`);
//     const data = await res.json();
//     setRestaurants(data);
//   } catch (err) {
//     console.error("Error fetching restaurants:", err);
//   }
// };
