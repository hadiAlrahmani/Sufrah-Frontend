import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchOrderById,
  updateOrderStatus,
} from "../../../services/orderService";
import "./ManageOrders.css";

const ManageOrders = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const fetchedOrder = await fetchOrderById(id);
        setOrder(fetchedOrder);
      } catch (err) {
        console.error("Error loading order:", err);
      }
    };
    loadOrder();
  }, [id]);

  const handleStatusUpdate = async (status) => {
    try {
      await updateOrderStatus(id, status);
      navigate("/admin"); // Redirect after update
    } catch (err) {
      console.error("Error updating order status:", err);
    }
  };

  if (!order) {
    return (
      <div className="text-center mt-5">
        <p className="text-muted">Loading order details...</p>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Manage Order</h1>
      <div className="card p-4 shadow">
        <div className="mb-3">
          <p className="mb-1">
            <strong>Restaurant:</strong> {order.restaurant?.name}
          </p>
          <p className="mb-0">
            <strong>Status:</strong> {order.status}
          </p>
        </div>

        <div className="d-flex justify-content-center gap-3 mt-4">
          <button
            onClick={() => handleStatusUpdate("Being Made")}
            className="btn btn-warning btn-lg"
          >
            Start Cooking
          </button>
          <button
            onClick={() => handleStatusUpdate("Ready")}
            className="btn btn-success btn-lg"
          >
            Order Ready
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageOrders;
