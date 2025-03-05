const BACKEND_URL = import.meta.env.VITE_EXPRESS_BACKEND_URL;

// Fetch admin-owned restaurants
const fetchAdminRestaurants = async () => {
  try {
    const res = await fetch(`${BACKEND_URL}/restaurants/admin`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!res.ok) throw new Error("Failed to fetch restaurants");

    return await res.json();
  } catch (err) {
    console.error("Error fetching restaurants:", err);
    return [];
  }
};

// Fetch all orders for admin
const fetchAdminOrders = async () => {
  try {
    const res = await fetch(`${BACKEND_URL}/orders`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!res.ok) throw new Error("Failed to fetch orders");

    return await res.json();
  } catch (err) {
    console.error("Error fetching orders:", err);
    return [];
  }
};

export { fetchAdminRestaurants, fetchAdminOrders };

//! CODE GRAVEYARD

// // Fetch all restaurants
// const fetchRestaurants = async () => {
//   try {
//     const res = await fetch(`${BACKEND_URL}/restaurants`);
//     const data = await res.json();
//     setRestaurants(data);
//   } catch (err) {
//     console.error("Error fetching restaurants:", err);
//   }
// };
