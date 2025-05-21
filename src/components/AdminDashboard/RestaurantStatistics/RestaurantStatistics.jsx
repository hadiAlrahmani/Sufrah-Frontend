import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const RestaurantStatistics = ({ restaurantId }) => {
  const [stats, setStats] = useState({ today: 0, yesterday: 0 });
  const [error, setError] = useState(null); // To track any error

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(`http://localhost:3000/statistics/order-statistics/${restaurantId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch statistics');
        }

        const contentType = response.headers.get("Content-Type");
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          setStats(data); // Update the state with fetched data
        } else {
          throw new Error('Received non-JSON response');
        }
      } catch (error) {
        console.error('Failed to fetch statistics:', error);
        setError(error.message);
      }
    };

    fetchStatistics();
  }, [restaurantId]);

  const chartData = [
    { day: 'Yesterday', orders: stats.yesterday },
    { day: 'Today', orders: stats.today },
  ];

  return (
    <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="orders" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RestaurantStatistics;