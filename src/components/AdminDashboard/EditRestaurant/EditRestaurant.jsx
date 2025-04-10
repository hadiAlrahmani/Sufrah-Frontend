import './EditRestaurant.css';
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import { fetchAdminRestaurants } from "../../../services/restaurantService";
import { Modal, Button } from "react-bootstrap";

const EditRestaurant = () => {
  const { id } = useParams(); // Get restaurant ID from the URL
  const [restaurant, setRestaurant] = useState(null); // State for storing restaurant
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    openingHours: "",
    image: "",
  });
  const [showModal, setShowModal] = useState(false); // Modal visibility state
  const [modalMessage, setModalMessage] = useState(""); // Modal message state
  const navigate = useNavigate(); // Navigate hook for redirection

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        // Fetch all restaurants and find the one with the matching ID
        const restaurants = await fetchAdminRestaurants();
        const restaurant = restaurants.find((r) => r._id === id); // Find restaurant by ID

        if (restaurant) {
          setRestaurant(restaurant); // Set restaurant data
          setFormData({
            name: restaurant.name,
            description: restaurant.description,
            location: restaurant.location,
            openingHours: restaurant.openingHours,
            image: restaurant.image,
          });
        } else {
          alert("Restaurant not found.");
        }
      } catch (error) {
        console.error("Error fetching restaurant:", error.message);
      }
    };

    fetchRestaurant();
  }, [id]); // Re-fetch if ID changes (e.g., if navigating to a different restaurant)

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `${import.meta.env.VITE_EXPRESS_BACKEND_URL}/restaurants/${restaurant._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to update restaurant");
      }

      const updatedRestaurant = await res.json();
      setModalMessage("Restaurant updated successfully!");
      setShowModal(true); // Show success message in modal

      // If you want to update the restaurant state with the new data:
      setRestaurant(updatedRestaurant);

    } catch (error) {
      setModalMessage("Error updating restaurant: " + error.message);
      setShowModal(true); // Show error message in modal
    }
  };

  const handleModalClose = () => {
    setShowModal(false); // Just close the modal
    navigate("/"); // Redirect to the homepage after closing the modal
  };

  if (!restaurant) return <p>Loading restaurant...</p>; // Show loading text until restaurant is fetched

  return (
    <div>
      <form onSubmit={handleSubmit} className="p-4 max-w-lg mx-auto">
        <h2 className="text-2xl font-bold mb-4">Edit Restaurant</h2>

        {["name", "description", "location", "openingHours", "image"].map((field) => (
          <div key={field} className="mb-3">
            <label className="block capitalize">{field}:</label>
            <input
              type="text"
              name={field}
              value={formData[field]}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        ))}

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Update Restaurant
        </button>
      </form>

      {/* Modal for confirmation */}
      <Modal show={showModal} onHide={handleModalClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleModalClose}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EditRestaurant;