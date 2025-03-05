const BACKEND_URL = import.meta.env.VITE_EXPRESS_BACKEND_URL;

const fetchRestaurantDetails = async (id) => {
  try {
    const res = await fetch(`${BACKEND_URL}/restaurants/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to fetch restaurant details");
    return data;
  } catch (err) {
    throw new Error(err.message);
  }
};

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
    throw new Error(err.message);
  }
};

const createRestaurant = async (formData) => {
  try {
    const res = await fetch(`${BACKEND_URL}/restaurants`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(formData),
    });

    if (!res.ok) throw new Error("Failed to create restaurant");
    return await res.json();
  } catch (err) {
    throw new Error(err.message);
  }
};

export { fetchRestaurantDetails, fetchAdminRestaurants, createRestaurant };