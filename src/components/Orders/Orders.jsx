import { useState, useEffect } from "react";
import { fetchUserOrders } from "../../services/orderService";

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
    <div>
      <h1>Your Orders</h1>
      <ul>
        {orders.map((order) => (
          <li key={order._id}>
            <h3>Order from {order.restaurant.name}</h3>
            <p><strong>Status:</strong> {order.status}</p>
            <ul>
              {order.items.map((item) => (
                <li key={item.menuItem._id}>
                  {item.menuItem?.name} x{item.quantity} ={" "}
                  {(item.menuItem?.price * item.quantity).toFixed(3)} BD
                </li>
              ))}
            </ul>
            <p><strong>Total Price:</strong> {order.totalPrice.toFixed(3)} BD</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Orders;