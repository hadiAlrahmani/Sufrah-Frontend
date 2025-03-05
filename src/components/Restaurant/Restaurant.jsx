import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { fetchRestaurantDetails } from "../../services/restaurantService";
import { fetchMenuItems } from "../../services/menuService";
import { addToCart } from "../../services/cartService";
import { AuthedUserContext } from "../../App";
import "./Restaurant.css"; // ✅ Import the CSS file

const Restaurant = () => {
  const { id } = useParams();
  const user = useContext(AuthedUserContext);
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadRestaurantDetails = async () => {
      try {
        const data = await fetchRestaurantDetails(id);
        setRestaurant(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const loadMenuItems = async () => {
      try {
        const data = await fetchMenuItems(id);
        setMenuItems(data);
      } catch (err) {
        setError(err.message);
      }
    };

    loadRestaurantDetails();
    loadMenuItems();
  }, [id]);

  if (loading) return <p className="loading-text">Loading restaurant details...</p>;
  if (error) return <p className="error-text">Error: {error}</p>;
  if (!restaurant) return <p className="not-found-text">Restaurant not found.</p>;

  return (
    <div className="restaurant-container">
      <div className="restaurant-details">
        <h1>{restaurant.name}</h1>
        <p>{restaurant.description}</p>
        <p><strong>Location:</strong> {restaurant.location}</p>
        <p><strong>Opening Hours:</strong> {restaurant.openingHours}</p>
      </div>

      <h2 className="menu-heading">Menu</h2>
      {menuItems.length === 0 ? (
        <p className="no-menu">No menu items available.</p>
      ) : (
        <div className="menu-list">
          {menuItems.map((item) => (
            <div key={item._id} className="menu-card">
              <h3>{item.name}</h3>
              <p className="menu-description">{item.description}</p>
              <p className="menu-price"><strong>Price:</strong> {item.price} BD</p>

              {user && (
                <button className="add-to-cart-btn" onClick={() => addToCart(item)}>
                  Add to Cart
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Restaurant;