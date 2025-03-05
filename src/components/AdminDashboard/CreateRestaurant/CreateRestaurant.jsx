import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createRestaurant } from "../../../services/restaurantService";
import "./CreateRestaurant.css";  // Import the CSS file for styling

const CreateRestaurant = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    openingHours: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createRestaurant(formData);
      navigate("/admin");
    } catch (err) {
      console.error("Error creating restaurant:", err);
    }
  };

  return (
    <div className="create-restaurant-container">
      <h1>Create a New Restaurant</h1>
      <form className="create-restaurant-form" onSubmit={handleSubmit}>
        <input
          className="input-field"
          type="text"
          name="name"
          placeholder="Restaurant Name"
          onChange={handleChange}
          required
        />
        <input
          className="input-field"
          type="text"
          name="description"
          placeholder="Description"
          onChange={handleChange}
          required
        />
        <input
          className="input-field"
          type="text"
          name="location"
          placeholder="Location"
          onChange={handleChange}
          required
        />
        <input
          className="input-field"
          type="text"
          name="openingHours"
          placeholder="Opening Hours"
          onChange={handleChange}
          required
        />
        <button className="submit-btn" type="submit">Create Restaurant</button>
      </form>
    </div>
  );
};

export default CreateRestaurant;