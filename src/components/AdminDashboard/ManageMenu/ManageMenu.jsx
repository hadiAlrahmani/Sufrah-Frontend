import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  fetchMenuItems,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from "../../../services/menuService";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import "./ManageMenu.css"; // Optional: For additional custom styles

const ManageMenu = () => {
  const { id } = useParams();
  const [menuItems, setMenuItems] = useState([]);
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
  });
  const [editingItem, setEditingItem] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadMenuItems();
  }, []);

  const loadMenuItems = async () => {
    try {
      const data = await fetchMenuItems(id);
      setMenuItems(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChange = (e) => {
    if (editingItem) {
      setEditingItem({ ...editingItem, [e.target.name]: e.target.value });
    } else {
      setNewItem({ ...newItem, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newItem.category) {
      setError("Please select a category.");
      return;
    }

    try {
      const addedItem = await addMenuItem(newItem, id);
      setMenuItems([...menuItems, addedItem]);
      setNewItem({ name: "", description: "", price: "", category: "" });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditClick = (item) => {
    setEditingItem(item);
  };

  const handleSaveEdit = async () => {
    if (!editingItem.category) {
      setError("Please select a category.");
      return;
    }

    try {
      const updatedItem = await updateMenuItem(editingItem);
      setMenuItems(menuItems.map((item) => (item._id === updatedItem._id ? updatedItem : item)));
      setEditingItem(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (itemId) => {
    try {
      await deleteMenuItem(itemId);
      setMenuItems(menuItems.filter((item) => item._id !== itemId));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Manage Menu</h1>

      {error && (
        <div className="alert alert-danger text-center">{error}</div>
      )}

      <div className="card p-4 shadow mb-5">
        <h2 className="text-center mb-3">
          {editingItem ? "Edit Menu Item" : "Add Menu Item"}
        </h2>
        <form
          onSubmit={editingItem ? handleSaveEdit : handleSubmit}
        >
          <div className="mb-3">
            <input
              type="text"
              name="name"
              placeholder="Item Name"
              value={editingItem ? editingItem.name : newItem.name}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="text"
              name="description"
              placeholder="Description"
              value={editingItem ? editingItem.description : newItem.description}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="mb-3">
            <input
              type="number"
              name="price"
              placeholder="Price (BD)"
              value={editingItem ? editingItem.price : newItem.price}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="mb-3">
            <select
              name="category"
              value={editingItem ? editingItem.category : newItem.category}
              onChange={handleChange}
              className="form-select"
            >
              <option value="">Select Category</option>
              <option value="Appetizers">Appetizers</option>
              <option value="Main Course">Main Course</option>
              <option value="Desserts">Desserts</option>
              <option value="Drinks">Drinks</option>
            </select>
          </div>

          <div className="d-grid gap-2">
            <button type="submit" className="btn btn-primary">
              {editingItem ? "Save Changes" : "Add Item"}
            </button>
            {editingItem && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setEditingItem(null)}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <h2 className="text-center mb-3">Current Menu</h2>
      {menuItems.length === 0 ? (
        <p className="text-center">No menu items available.</p>
      ) : (
        <ul className="list-group">
          {menuItems.map((item) => (
            <li key={item._id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <strong>{item.name}</strong> - {item.price} BD
              </div>
              <div>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => handleEditClick(item)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(item._id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ManageMenu;