import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_EXPRESS_BACKEND_URL;

const Restaurant = () => {
    const { id } = useParams();
    const [restaurant, setRestaurant] = useState(null);
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRestaurantDetails = async () => {
            try {
                const res = await fetch(`${BACKEND_URL}/restaurants/${id}`);
                if (!res.ok) throw new Error("Failed to fetch restaurant details");
                const data = await res.json();
                setRestaurant(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        const fetchMenuItems = async () => {
            try {
                const res = await fetch(`${BACKEND_URL}/menuItems/restaurant/${id}`);
                if (!res.ok) throw new Error("Failed to fetch menu items");
                const data = await res.json();
                setMenuItems(data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchRestaurantDetails();
        fetchMenuItems();
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
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Restaurant;