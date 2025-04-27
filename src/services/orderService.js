const BACKEND_URL = import.meta.env.VITE_EXPRESS_BACKEND_URL; // Get backend URL from environment variables

// Fetch user orders
const fetchUserOrders = async (setOrders, setLoading, setError) => {
  try {
    setLoading(true); // Set loading state to true
    const token = localStorage.getItem("token"); // Retrieve token from local storage
    if (!token) {
      setError("You must be logged in to view your orders."); // Set error if no token is found
      setLoading(false); // Set loading state to false
      return; // Exit function
    }

    const res = await fetch(`${BACKEND_URL}/orders/my-orders`, {
      method: "GET", // Set request method to GET
      headers: { Authorization: `Bearer ${token}` }, // Include authorization token
    });

    const data = await res.json(); // Parse response JSON
    if (!res.ok) throw new Error(data.error || "Failed to fetch orders"); // Check for errors

    setOrders(data); // Update orders state with fetched data
  } catch (err) {
    setError(err.message); // Set error state on failure
  } finally {
    setLoading(false); // Set loading state to false regardless of outcome
  }
};

// Fetch a specific order by ID
const fetchOrderById = async (orderId) => {
  try {
    const token = localStorage.getItem("token"); // Retrieve token from local storage
    if (!token) {
      console.error("No token found");
      return null; // Exit early if no token
    }

    const res = await fetch(`${BACKEND_URL}/orders/${orderId}`, {
      headers: { Authorization: `Bearer ${token}` }, // Include authorization token
    });

    if (!res.ok) throw new Error("Failed to fetch order"); // Check for errors

    return await res.json(); // Return parsed order data
  } catch (err) {
    console.error("Error fetching order:", err); // Log any errors
    return null; // Return null on error
  }
};

// Update the status of an order
const updateOrderStatus = async (orderId, status) => {
  try {
    const token = localStorage.getItem("token"); // Retrieve token from local storage
    if (!token) {
      console.error("No token found");
      return null; // Exit early if no token
    }

    const res = await fetch(`${BACKEND_URL}/orders/${orderId}`, {
      method: "PUT", // Set request method to PUT
      headers: {
        "Content-Type": "application/json", // Set content type to JSON
        Authorization: `Bearer ${token}`, // Include authorization token
      },
      body: JSON.stringify({ status }), // Send updated status as JSON
    });

    if (!res.ok) throw new Error("Failed to update order"); // Check for errors

    return await res.json(); // Return parsed response data
  } catch (err) {
    console.error("Error updating order:", err); // Log any errors
    return null; // Return null on error
  }
};

// Fetch orders for a specific restaurant by ID
const fetchRestaurantOrders = async (restaurantId) => {
  try {
    const token = localStorage.getItem("token"); // Retrieve token from local storage
    if (!token) {
      console.error("No token found");
      return []; // Exit early if no token, return empty array
    }

    const response = await fetch(`${BACKEND_URL}/orders/restaurant/${restaurantId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch orders for this restaurant');
    }

    const data = await response.json();
    return data; // returns array
  } catch (err) {
    console.error("Error fetching restaurant orders:", err);
    return []; // fallback to empty array instead of null
  }
};

export { fetchUserOrders, fetchOrderById, updateOrderStatus, fetchRestaurantOrders };