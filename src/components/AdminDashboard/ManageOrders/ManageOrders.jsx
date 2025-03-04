import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_EXPRESS_BACKEND_URL;

const ManageOrders = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/orders/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        if (!res.ok) throw new Error("Failed to fetch order");

        const data = await res.json();
        setOrder(data);
      } catch (err) {
        console.error("Error fetching order:", err);
      }
    };

    fetchOrder();
  }, [id]);

  const updateStatus = async (status) => {
    try {
      await fetch(`${BACKEND_URL}/orders/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status }),
      });

      navigate("/admin");
    } catch (err) {
      console.error("Error updating order:", err);
    }
  };

  if (!order) return <p>Loading order details...</p>;

  return (
    <div>
      <h1>Manage Order</h1>
      <p>Restaurant: {order.restaurant?.name}</p>
      <p>Status: {order.status}</p>
      <button onClick={() => updateStatus("Being Made")}>Start Cooking</button>
      <button onClick={() => updateStatus("Ready")}>Order Ready</button>
    </div>
  );
};

export default ManageOrders;