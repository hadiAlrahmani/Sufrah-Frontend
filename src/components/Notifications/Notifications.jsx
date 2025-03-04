import { useState, useEffect } from "react";

const BACKEND_URL = import.meta.env.VITE_EXPRESS_BACKEND_URL;

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
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

    fetchNotifications();
  }, []);

  // Mark notification as read when clicked
  const markAsRead = async (id) => {
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

      // Update state to reflect the change
      setNotifications((prev) =>
        prev.map((notif) =>
          notif._id === id ? { ...notif, read: true } : notif
        )
      );
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  if (loading) return <p>Loading notifications...</p>;
  if (error) return <p>Error: {error}</p>;
  if (notifications.length === 0) return <p>No new notifications.</p>;

  return (
    <div>
      <h1>Your Notifications</h1>
      <ul>
        {notifications.map((notif) => (
          <li key={notif._id} onClick={() => markAsRead(notif._id)}>
            {notif.message} {!notif.read && <strong> (New)</strong>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;
