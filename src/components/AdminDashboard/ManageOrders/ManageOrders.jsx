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

  if (!order) return <p className="text-center text-lg text-gray-500">Loading order details...</p>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-semibold mb-4 text-center">Manage Order</h1>
      <div className="space-y-4">
        <p><strong>Restaurant:</strong> {order.restaurant?.name}</p>
        <p><strong>Status:</strong> {order.status}</p>

        <div className="flex space-x-4 justify-center mt-4">
          <button
            onClick={() => handleStatusUpdate("Being Made")}
            className="px-6 py-2 text-white bg-yellow-500 hover:bg-yellow-600 rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
          >
            Start Cooking
          </button>
          <button
            onClick={() => handleStatusUpdate("Ready")}
            className="px-6 py-2 text-white bg-green-500 hover:bg-green-600 rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          >
            Order Ready
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageOrders;