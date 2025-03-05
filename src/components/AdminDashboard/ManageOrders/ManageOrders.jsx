import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchOrderById, updateOrderStatus } from "../../../services/orderService";

const ManageOrders = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const loadOrder = async () => {
      const fetchedOrder = await fetchOrderById(id);
      setOrder(fetchedOrder);
    };
    loadOrder();
  }, [id]);

  const handleStatusUpdate = async (status) => {
    await updateOrderStatus(id, status);
    navigate("/admin"); // Redirect after update
  };

  if (!order) return <p>Loading order details...</p>;

  return (
    <div>
      <h1>Manage Order</h1>
      <p>Restaurant: {order.restaurant?.name}</p>
      <p>Status: {order.status}</p>
      <button onClick={() => handleStatusUpdate("Being Made")}>Start Cooking</button>
      <button onClick={() => handleStatusUpdate("Ready")}>Order Ready</button>
    </div>
  );
};

export default ManageOrders;