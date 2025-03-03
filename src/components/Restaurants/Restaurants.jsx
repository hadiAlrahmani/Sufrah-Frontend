import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_EXPRESS_BACKEND_URL;

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/restaurants`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch restaurants");
        }

        setRestaurants(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  if (loading) return <p>Loading restaurants...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Available Restaurants</h1>
      <ul>
        {restaurants.map((restaurant) => (
          <li key={restaurant._id}>
            
            <Link to={`/restaurant/${restaurant._id}`}>
              <h3>{restaurant.name}</h3>
            </Link>
            <p>{restaurant.description}</p>
            <p><strong>Location:</strong> {restaurant.location}</p>
            <p><strong>Opening Hours:</strong> {restaurant.openingHours}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Restaurants;