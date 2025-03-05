import { useState, useEffect } from "react";
import { fetchUserOrders } from "../../services/orderService";
import "./Orders.css";  // Import the CSS file for Orders component

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserOrders(setOrders, setLoading, setError);
  }, []);

  if (loading) return <p>Loading your orders...</p>;
  if (error) return <p>Error: {error}</p>;
  if (orders.length === 0) return <p>You have no orders yet.</p>;

  return (
    <div className="orders-container">
      <h1 className="orders-title">Your Orders</h1>
      <ul className="orders-list">
        {orders.map((order) => (
          <li key={order._id} className="order-item">
            <h3 className="order-restaurant">Order from {order.restaurant.name}</h3>
            <p className="order-status"><strong>Status:</strong> {order.status}</p>
            <ul className="order-items">
              {order.items.map((item) => (
                <li key={item.menuItem._id} className="order-item-details">
                  {item.menuItem?.name} x{item.quantity} ={" "}
                  {(item.menuItem?.price * item.quantity).toFixed(3)} BD
                </li>
              ))}
            </ul>
            <p className="order-total"><strong>Total Price:</strong> {order.totalPrice.toFixed(3)} BD</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Orders;