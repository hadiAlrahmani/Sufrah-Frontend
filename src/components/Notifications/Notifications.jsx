import { useState, useEffect } from "react";
import { fetchNotifications, markAsRead } from "../../services/notificationService";
import './Notifications.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNotifications(setNotifications, setLoading, setError);
  }, []);

  const handleMarkAsRead = async (id) => {
    await markAsRead(id, setNotifications);
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  if (loading) return <p className="loading">Loading notifications...</p>;
  if (error) return <p className="error">Error: {error}</p>;
  if (notifications.length === 0) return <p className="no-notifications">No new notifications.</p>;

  return (
    <div className="notifications-container">
      <h1>Your Notifications</h1>
      <button className="clear-btn" onClick={clearNotifications}>Clear Notifications</button>
      <ul>
        {notifications.map((notif) => (
          <li
            key={notif._id}
            className={`notification-item ${notif.read ? "read" : "unread"}`}
            onClick={() => handleMarkAsRead(notif._id)}
          >
            {notif.message} {!notif.read && <strong> (New)</strong>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;