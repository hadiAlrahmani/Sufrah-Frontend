import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Restaurants.css"; // ✅ Import the CSS file in the same folder

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

  if (loading) return <p className="loading-text">Loading restaurants...</p>;
  if (error) return <p className="error-text">Error: {error}</p>;

  return (
    <div className="container">
      <h1 className="title">Available Restaurants</h1>
      <div className="row">
        {restaurants.map((restaurant) => (
          <div key={restaurant._id} className="col-lg-4 col-md-6 col-sm-12 d-flex">
            <div className="restaurant-card">
              {/* ✅ Display restaurant image */}
              <img src={restaurant.image} alt={restaurant.name} className="restaurant-image" />

              <div className="restaurant-info">
                <Link to={`/restaurant/${restaurant._id}`} className="restaurant-link">
                  <h3>{restaurant.name}</h3>
                </Link>
                <p>{restaurant.description}</p>
                <p><strong>Location:</strong> {restaurant.location}</p>
                <p><strong>Opening Hours:</strong> {restaurant.openingHours}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Restaurants;