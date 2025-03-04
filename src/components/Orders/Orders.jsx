import { useState, useEffect } from "react";

const BACKEND_URL = import.meta.env.VITE_EXPRESS_BACKEND_URL;

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("You must be logged in to view your orders.");
          setLoading(false);
          return;
        }

        const res = await fetch(`${BACKEND_URL}/orders/my-orders`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch orders");

        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
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