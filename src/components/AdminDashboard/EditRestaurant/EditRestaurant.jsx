import './EditRestaurant.css';
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchAdminRestaurants } from "../../../services/restaurantService";
import { Modal, Button } from "react-bootstrap";

const EditRestaurant = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    openingHours: "",
    image: "",
  });

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const restaurants = await fetchAdminRestaurants();
        const restaurant = restaurants.find((r) => r._id === id);

        if (restaurant) {
          setRestaurant(restaurant);
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
  }, [id]);

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
      setShowModal(true);
      setRestaurant(updatedRestaurant);
    } catch (error) {
      setModalMessage("Error updating restaurant: " + error.message);
      setShowModal(true);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_EXPRESS_BACKEND_URL}/restaurants/${restaurant._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to delete restaurant");
      }

      setShowDeleteConfirm(false);
      navigate("/"); // Redirect to homepage
    } catch (error) {
      alert("Error deleting restaurant: " + error.message);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    navigate("/");
  };

  if (!restaurant) return <p>Loading restaurant...</p>;

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Edit Restaurant</h2>

      <form onSubmit={handleSubmit}>
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

        <div className="flex gap-3 mt-4">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            Update Restaurant
          </button>

          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Delete Restaurant
          </button>
        </div>
      </form>

      {/* Update Confirmation Modal */}
      <Modal show={showModal} onHide={handleModalClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleModalClose}>Close</Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this restaurant? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Confirm Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EditRestaurant;