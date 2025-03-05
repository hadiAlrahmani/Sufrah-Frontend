import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { fetchRestaurantDetails } from "../../services/restaurantService";
import { fetchMenuItems } from "../../services/menuService";
import { addToCart } from "../../services/cartService";
import { AuthedUserContext } from "../../App";

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

  if (loading) return <p>Loading restaurant details...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!restaurant) return <p>Restaurant not found.</p>;

  return (
    <div>
      <h1>{restaurant.name}</h1>
      <p>{restaurant.description}</p>
      <p><strong>Location:</strong> {restaurant.location}</p>
      <p><strong>Opening Hours:</strong> {restaurant.openingHours}</p>

      <h2>Menu</h2>
      {menuItems.length === 0 ? (
        <p>No menu items available.</p>
      ) : (
        <ul>
          {menuItems.map((item) => (
            <li key={item._id}>
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <p><strong>Price:</strong> {item.price} BD</p>

              {user && <button onClick={() => addToCart(item)}>Add to Cart</button>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Restaurant;