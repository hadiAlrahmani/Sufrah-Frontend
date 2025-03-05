import { useState, useEffect } from "react";
import { fetchRestaurants, createMenuItem } from "../../services/menuService";
import './CreateMenuItem.css';  // Import the CSS file

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

  useEffect(() => {
    const getRestaurants = async () => {
      try {
        const data = await fetchRestaurants();
        setRestaurants(data);
      } catch (err) {
        setMessage(err.message);
      }
    };

    getRestaurants();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.category) {
      setMessage("Please select a category.");
      return;
    }

    try {
      await createMenuItem(formData);
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
    <div className="create-menu-item-container">
      <h1 className="create-menu-header">Create Menu Item</h1>
      {message && <p className="message">{message}</p>}
      <form onSubmit={handleSubmit} className="menu-form">
        <label>Restaurant:</label>
        <select
          name="restaurant"
          value={formData.restaurant}
          onChange={handleChange}
          required
          className="input-field"
        >
          <option value="">Select a restaurant</option>
          {restaurants.map((rest) => (
            <option key={rest._id} value={rest._id}>
              {rest.name}
            </option>
          ))}
        </select>

        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="input-field"
        />

        <label>Description:</label>
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="input-field"
        />

        <label>Price (BD):</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          required
          className="input-field"
        />

        <label>Category:</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          className="input-field"
        >
          <option value="">Select a category</option>
          <option value="Appetizers">Appetizers</option>
          <option value="Main Course">Main Course</option>
          <option value="Desserts">Desserts</option>
          <option value="Drinks">Drinks</option>
        </select>

        <button type="submit" className="submit-btn">Add Menu Item</button>
      </form>
    </div>
  );
};

export default CreateMenuItem;