import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchMenuItems, addMenuItem, updateMenuItem, deleteMenuItem } from "../../../services/menuService";
import "./ManageMenu.css"; // Make sure to import the CSS file

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
    <div className="manage-menu-container">
      <h1 className="manage-menu-title">Manage Menu</h1>

      <h2 className="manage-menu-subtitle">
        {editingItem ? "Edit Menu Item" : "Add Menu Item"}
      </h2>
      {error && <p className="error-message">{error}</p>}

      <form onSubmit={editingItem ? handleSaveEdit : handleSubmit} className="menu-form">
        <input
          type="text"
          name="name"
          placeholder="Item Name"
          value={editingItem ? editingItem.name : newItem.name}
          onChange={handleChange}
          className="input-field"
          required
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={editingItem ? editingItem.description : newItem.description}
          onChange={handleChange}
          className="input-field"
        />
        <input
          type="number"
          name="price"
          placeholder="Price (BD)"
          value={editingItem ? editingItem.price : newItem.price}
          onChange={handleChange}
          className="input-field"
          required
        />
        <select
          name="category"
          value={editingItem ? editingItem.category : newItem.category}
          onChange={handleChange}
          className="select-field"
        >
          <option value="">Select Category</option>
          <option value="Appetizers">Appetizers</option>
          <option value="Main Course">Main Course</option>
          <option value="Desserts">Desserts</option>
          <option value="Drinks">Drinks</option>
        </select>
        <div className="button-group">
          <button type="submit" className="submit-button">
            {editingItem ? "Save Changes" : "Add Item"}
          </button>
          {editingItem && (
            <button
              type="button"
              className="cancel-button"
              onClick={() => setEditingItem(null)}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <h2 className="manage-menu-subtitle">Current Menu</h2>
      {menuItems.length === 0 ? (
        <p>No menu items available.</p>
      ) : (
        <ul className="menu-items-list">
          {menuItems.map((item) => (
            <li key={item._id} className="menu-item">
              <strong>{item.name}</strong> - {item.price} BD
              <div className="item-actions">
                <button className="edit-button" onClick={() => handleEditClick(item)}>
                  Edit
                </button>
                <button className="delete-button" onClick={() => handleDelete(item._id)}>
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