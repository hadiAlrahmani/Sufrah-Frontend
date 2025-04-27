import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchRestaurantOrders, updateOrderStatus } from "../../../services/orderService";
import { fetchMenuItemById } from "../../../services/menuService";
import "./RestaurantOrders.css";

const RestaurantOrders = () => {
  const { id } = useParams(); // Extract restaurant ID from URL
  const [orders, setOrders] = useState([]); // State to store orders
  const [selectedOrder, setSelectedOrder] = useState(null); // State for the selected order
  const [menuItems, setMenuItems] = useState({}); // Store menu items by their IDs

  useEffect(() => {
    // Fetch orders for the restaurant and menu items' details
    const fetchData = async () => {
      const data = await fetchRestaurantOrders(id); // Fetch orders for this restaurant
      setOrders(data); // Update state with fetched orders
      fetchMenuItemsDetails(data); // Fetch menu items details for each order
    };
    fetchData();
  }, [id]); // Re-run when restaurant ID changes

  // Function to fetch menu items details from the orders
  const fetchMenuItemsDetails = async (orders) => {
    const itemIds = orders.flatMap(order =>
      order.items.map(item => item.menuItem) // Get all unique menu item IDs from orders
    );

    // Remove duplicate menuItem IDs
    const uniqueItemIds = [...new Set(itemIds)];

    const fetchedMenuItems = {};
    for (let itemId of uniqueItemIds) {
      try {
        const menuItem = await fetchMenuItemById(itemId); // Fetch menu item details by ID
        if (menuItem) {
          fetchedMenuItems[itemId] = menuItem; // Store the menu item in state
        }
      } catch (error) {
        console.error(`Failed to fetch menu item with ID ${itemId}: ${error.message}`); // Log error if fetch fails
      }
    }

    setMenuItems(fetchedMenuItems); // Update state with fetched menu items
  };

  // Function to calculate total price of the order
  const calculateTotalPrice = (items) => {
    return items?.reduce((total, item) => {
      const menuItem = menuItems[item.menuItem];
      if (menuItem) {
        const price = parseFloat(menuItem.price);
        const quantity = parseInt(item.quantity);
        if (!isNaN(price) && !isNaN(quantity)) {
          return total + price * quantity; // Add price * quantity to total
        }
      }
      return total; // Return total if no menu item found
    }, 0).toFixed(3); // Return total price with 3 decimal places
  };

  // Function to handle order status change
  const handleStatusChange = async (newStatus) => {
    if (selectedOrder) {
      try {
        // Update the status in the backend
        const updatedOrder = await updateOrderStatus(selectedOrder._id, newStatus);

        if (updatedOrder) {
          // Update the local state to reflect the new status
          setOrders((prevOrders) =>
            prevOrders.map((order) =>
              order._id === selectedOrder._id ? { ...order, status: newStatus } : order
            )
          );
          setSelectedOrder({ ...selectedOrder, status: newStatus }); // Update selected order status
        }
      } catch (error) {
        console.error("Error updating order status:", error);
      }
    }
  };

  return (
    <div className="orders-container">
      <h2>Orders for Restaurant</h2>

      <div className="orders-list">
        {/* Map through orders and display each order in a card */}
        {orders.map((order) => (
          <div
            key={order._id}
            className="order-card"
            onClick={() => setSelectedOrder(order)} // Set selected order when clicked
          >
            Order ID: {order._id} {/* Display the order ID */}
          </div>
        ))}
      </div>

      {/* Modal to show order details when an order is clicked */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Order Details</h3>

            {/* Display the order status */}
            <div className="order-detail-section">
              <strong>Status:</strong> {selectedOrder.status}
            </div>

            {/* Display items in the order */}
            <div className="order-detail-section">
              <strong>Items:</strong>
              {selectedOrder.items?.map((item, index) => {
                const menuItem = menuItems[item.menuItem]; // Get menu item details by ID
                if (menuItem) {
                  const price = parseFloat(menuItem.price);
                  const quantity = parseInt(item.quantity);
                  const itemTotal = (price * quantity).toFixed(3); // Calculate item total
                  return (
                    <p key={index}>
                      {menuItem.name} x{quantity} = {itemTotal} BD {/* Display item name and total */}
                    </p>
                  );
                }
                return <p key={index}>Menu item not found for this order</p>; // Handle missing menu items
              })}
            </div>

            {/* Display total price of all items in the order */}
            <div className="order-detail-section">
              <strong>Total Price:</strong> {calculateTotalPrice(selectedOrder.items)} BD
            </div>

            {/* Status change buttons */}
            <div className="modal-buttons">
              <button className="start-btn" onClick={() => handleStatusChange("Being Made")}>
                Start Cooking
              </button>
              <button className="ready-btn" onClick={() => handleStatusChange("Ready")}>
                Ready
              </button>
              <button className="reject-btn" onClick={() => handleStatusChange("Rejected")}>
                Reject Order
              </button>
            </div>

            {/* Close button */}
            <button className="close-btn" onClick={() => setSelectedOrder(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantOrders;