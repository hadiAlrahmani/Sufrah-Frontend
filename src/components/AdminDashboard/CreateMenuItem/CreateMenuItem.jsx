import { useState, useEffect } from "react";

const BACKEND_URL = import.meta.env.VITE_EXPRESS_BACKEND_URL;

const CreateMenuItem = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [formData, setFormData] = useState({
    restaurant: "",
    name: "",
    description: "",
    price: "",
    category: "",
  });
  const [message, setMessage] = useState("");

  // Fetch restaurants
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/restaurants`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Failed to fetch restaurants");
        setRestaurants(data);
      } catch (err) {
        setMessage(err.message);
      }
    };

    fetchRestaurants();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.category) {
      setMessage("Please select a category.");
      return;
    }

    try {
      const res = await fetch(`${BACKEND_URL}/menuItems`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create menu item");

      setMessage("Menu item added successfully!");
      setFormData({
        restaurant: "",
        name: "",
        description: "",
        price: "",
        category: "",
      });
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div>
      <h1>Create Menu Item</h1>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        {/* Restaurant Selection */}
        <label>Restaurant:</label>
        <select name="restaurant" value={formData.restaurant} onChange={handleChange} required>
          <option value="">Select a restaurant</option>
          {restaurants.map((rest) => (
            <option key={rest._id} value={rest._id}>
              {rest.name}
            </option>
          ))}
        </select>

        <label>Name:</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />

        <label>Description:</label>
        <input type="text" name="description" value={formData.description} onChange={handleChange} />

        <label>Price (BD):</label>
        <input type="number" name="price" value={formData.price} onChange={handleChange} required />

        <label>Category:</label>
        <select name="category" value={formData.category} onChange={handleChange} required>
          <option value="">Select a category</option> 
          <option value="Appetizers">Appetizers</option>
          <option value="Main Course">Main Course</option>
          <option value="Desserts">Desserts</option>
          <option value="Drinks">Drinks</option>
        </select>

        <button type="submit">Add Menu Item</button>
      </form>
    </div>
  );
};

export default CreateMenuItem;