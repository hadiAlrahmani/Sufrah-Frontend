import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_EXPRESS_BACKEND_URL;

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
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/menuItems/restaurant/${id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch menu items");
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
      const res = await fetch(`${BACKEND_URL}/menuItems`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ ...newItem, restaurant: id }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add menu item");

      setMenuItems([...menuItems, data]);
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
      const res = await fetch(`${BACKEND_URL}/menuItems/${editingItem._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(editingItem),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update menu item");

      setMenuItems(menuItems.map((item) => (item._id === editingItem._id ? data : item)));
      setEditingItem(null); // Exit edit mode
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (itemId) => {
    try {
      const res = await fetch(`${BACKEND_URL}/menuItems/${itemId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete menu item");

      // Update UI
      setMenuItems(menuItems.filter((item) => item._id !== itemId));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h1>Manage Menu</h1>

      {/* Add New Item Form */}
      <h2>{editingItem ? "Edit Menu Item" : "Add Menu Item"}</h2>
      {error && <p style={{ color: "red" }}>{error}</p>} 
      <form onSubmit={editingItem ? handleSaveEdit : handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Item Name"
          value={editingItem ? editingItem.name : newItem.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={editingItem ? editingItem.description : newItem.description}
          onChange={handleChange}
        />
        <input
          type="number"
          name="price"
          placeholder="Price (BD)"
          value={editingItem ? editingItem.price : newItem.price}
          onChange={handleChange}
          required
        />
        <select
          name="category"
          value={editingItem ? editingItem.category : newItem.category}
          onChange={handleChange}
        >
          <option value="">Select Category</option> 
          <option value="Appetizers">Appetizers</option>
          <option value="Main Course">Main Course</option>
          <option value="Desserts">Desserts</option>
          <option value="Drinks">Drinks</option>
        </select>
        <button type="submit">{editingItem ? "Save Changes" : "Add Item"}</button>
        {editingItem && <button onClick={() => setEditingItem(null)}>Cancel</button>}
      </form>

      {/* Display Menu Items */}
      <h2>Current Menu</h2>
      {menuItems.length === 0 ? (
        <p>No menu items available.</p>
      ) : (
        <ul>
          {menuItems.map((item) => (
            <li key={item._id}>
              <strong>{item.name}</strong> - {item.price} BD
              <button onClick={() => handleEditClick(item)}>Edit</button>
              <button onClick={() => handleDelete(item._id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ManageMenu;