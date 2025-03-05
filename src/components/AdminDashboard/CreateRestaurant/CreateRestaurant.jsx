import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createRestaurant } from "../../../services/restaurantService";

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
    <div>
      <h1>Create a New Restaurant</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Restaurant Name" onChange={handleChange} required />
        <input type="text" name="description" placeholder="Description" onChange={handleChange} required />
        <input type="text" name="location" placeholder="Location" onChange={handleChange} required />
        <input type="text" name="openingHours" placeholder="Opening Hours" onChange={handleChange} required />
        <button type="submit">Create Restaurant</button>
      </form>
    </div>
  );
};

export default CreateRestaurant;