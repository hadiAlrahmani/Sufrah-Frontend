const BACKEND_URL = import.meta.env.VITE_EXPRESS_BACKEND_URL;

// Fetch notifications
const fetchNotifications = async (setNotifications, setLoading, setError) => {
  try {
    const res = await fetch(`${BACKEND_URL}/notifications`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch notifications");
    }

    const data = await res.json();
    setNotifications(data);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

// Mark notification as read
const markAsRead = async (id, setNotifications) => {
  try {
    const res = await fetch(`${BACKEND_URL}/notifications/${id}/read`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!res.ok) {
      throw new Error("Failed to update notification status");
    }

    // Update state to mark as read
    setNotifications((prev) =>
      prev.map((notif) =>
        notif._id === id ? { ...notif, read: true } : notif
      )
    );
  } catch (err) {
    console.error("Error marking notification as read:", err);
  }
};

export { fetchNotifications, markAsRead };