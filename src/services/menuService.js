const BACKEND_URL = import.meta.env.VITE_EXPRESS_BACKEND_URL;

// Fetch all restaurants 
const fetchRestaurants = async () => {
  try {
    const res = await fetch(`${BACKEND_URL}/restaurants`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to fetch restaurants");
    return data;
  } catch (err) {
    throw new Error(err.message);
  }
};

// Fetch all menu items for a restaurant
const fetchMenuItems = async (restaurantId) => {
  try {
    const res = await fetch(`${BACKEND_URL}/menuItems/restaurant/${restaurantId}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to fetch menu items");
    return data;
  } catch (err) {
    throw new Error(err.message);
  }
};

// Add a new menu item to a restaurant
const addMenuItem = async (newItem, restaurantId) => {
  try {
    const res = await fetch(`${BACKEND_URL}/menuItems`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ ...newItem, restaurant: restaurantId }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to add menu item");
    return data;
  } catch (err) {
    throw new Error(err.message);
  }
};

// Update an existing menu item
const updateMenuItem = async (editingItem) => {
  try {
    const res = await fetch(`${BACKEND_URL}/menuItems/${editingItem._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(editingItem),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to update menu item");
    return data;
  } catch (err) {
    throw new Error(err.message);
  }
};

// Delete a menu item
const deleteMenuItem = async (itemId) => {
  try {
    const res = await fetch(`${BACKEND_URL}/menuItems/${itemId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!res.ok) throw new Error("Failed to delete menu item");
  } catch (err) {
    throw new Error(err.message);
  }
};

export { fetchRestaurants, fetchMenuItems, addMenuItem, updateMenuItem, deleteMenuItem };