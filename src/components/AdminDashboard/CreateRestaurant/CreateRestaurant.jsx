import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createRestaurant } from "../../../services/restaurantService";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import "./CreateRestaurant.css"; // Optional: For additional custom styles

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
    <div className="container mt-5">
      <h1 className="text-center mb-4">Create a New Restaurant</h1>
      <form onSubmit={handleSubmit} className="card p-4 shadow">
        <div className="mb-3">
          <input
            type="text"
            name="name"
            placeholder="Restaurant Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <input
            type="text"
            name="openingHours"
            placeholder="Opening Hours"
            value={formData.openingHours}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Create Restaurant
        </button>
      </form>
    </div>
  );
};

export default CreateRestaurant;
