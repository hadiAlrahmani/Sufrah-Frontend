const BACKEND_URL = import.meta.env.VITE_EXPRESS_BACKEND_URL;

const fetchUserOrders = async (setOrders, setLoading, setError) => {
  try {
    setLoading(true);
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

const fetchOrderById = async (orderId) => {
  try {
    const res = await fetch(`${BACKEND_URL}/orders/${orderId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    if (!res.ok) throw new Error("Failed to fetch order");

    return await res.json();
  } catch (err) {
    console.error("Error fetching order:", err);
    return null;
  }
};

const updateOrderStatus = async (orderId, status) => {
  try {
    const res = await fetch(`${BACKEND_URL}/orders/${orderId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ status }),
    });

    if (!res.ok) throw new Error("Failed to update order");

    return await res.json();
  } catch (err) {
    console.error("Error updating order:", err);
    return null;
  }
};

export { fetchUserOrders, fetchOrderById, updateOrderStatus };