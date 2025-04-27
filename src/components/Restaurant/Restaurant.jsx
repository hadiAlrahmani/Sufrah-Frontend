import { useState, useEffect, useContext } from "react"; 
import { useParams } from "react-router-dom"; 
import { fetchRestaurantDetails } from "../../services/restaurantService"; 
import { fetchMenuItems } from "../../services/menuService"; 
import { addToCart } from "../../services/cartService"; 
import { AuthedUserContext } from "../../App"; 
import "./Restaurant.css"; 
import "bootstrap/dist/css/bootstrap.min.css"; 
import { Modal, Button } from "react-bootstrap"; 

const Restaurant = () => {
  const { id } = useParams(); 
  const user = useContext(AuthedUserContext); 
  const [restaurant, setRestaurant] = useState(null); 
  const [menuItems, setMenuItems] = useState([]); 
  const [filteredMenuItems, setFilteredMenuItems] = useState([]); 
  const [categories] = useState(['Appetizers', 'Main Course', 'Desserts', 'Drinks']); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 

  // Bootstrap Modal State
  const [showModal, setShowModal] = useState(false); 
  const [modalMessage, setModalMessage] = useState(""); 

  const handleModal = (message) => {
    setModalMessage(message); 
    setShowModal(true); 
  };

  const closeModal = () => setShowModal(false); 

  useEffect(() => {
    const loadRestaurantDetails = async () => {
      try {
        const data = await fetchRestaurantDetails(id); 
        setRestaurant(data); 
      } catch (err) {
        setError(err.message); 
      } finally {
        setLoading(false); 
      }
    };

    const loadMenuItems = async () => {
      try {
        const data = await fetchMenuItems(id); 
        setMenuItems(data); 
        setFilteredMenuItems(data); 
      } catch (err) {
        setError(err.message); 
      }
    };

    loadRestaurantDetails(); 
    loadMenuItems(); 
  }, [id]); 

  const handleCategoryClick = (category) => {
    if (category === "All") {
      setFilteredMenuItems(menuItems); 
    } else {
      const filtered = menuItems.filter((item) => item.category === category); 
      setFilteredMenuItems(filtered); 
    }
  };

  const handleSort = (option) => {
    let sortedMenuItems = [...filteredMenuItems];
    
    if (option === "priceLowToHigh") {
      sortedMenuItems.sort((a, b) => a.price - b.price);
    } else if (option === "priceHighToLow") {
      sortedMenuItems.sort((a, b) => b.price - a.price);
    } else if (option === "nameAtoZ") {
      sortedMenuItems.sort((a, b) => a.name.localeCompare(b.name));
    } else if (option === "nameZtoA") {
      sortedMenuItems.sort((a, b) => b.name.localeCompare(a.name));
    }

    setFilteredMenuItems(sortedMenuItems);
  };

  const handleAddToCart = (item) => {
    addToCart(item, handleModal); 
  };

  if (loading) return <p className="loading-text">Loading restaurant details...</p>; 
  if (error) return <p className="error-text">Error: {error}</p>; 
  if (!restaurant) return <p className="not-found-text">Restaurant not found.</p>; 

  return (
    <div className="restaurant-container">
      <div className="restaurant-details">
        <h1>{restaurant.name}</h1>
        <p>{restaurant.description}</p>
        <p><strong>Location:</strong> {restaurant.location}</p>
        <p><strong>Opening Hours:</strong> {restaurant.openingHours}</p>
      </div>

      <div className="category-filters">
        <button
          className="category-btn"
          onClick={() => handleCategoryClick("All")}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category}
            className="category-btn"
            onClick={() => handleCategoryClick(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Sorting Buttons */}
      <div className="sorting-options">
        <button onClick={() => handleSort('priceLowToHigh')}>Price: Low to High</button>
        <button onClick={() => handleSort('priceHighToLow')}>Price: High to Low</button>
        <button onClick={() => handleSort('nameAtoZ')}>Name: A-Z</button>
        <button onClick={() => handleSort('nameZtoA')}>Name: Z-A</button>
      </div>

      <h2 className="menu-heading">Menu</h2>
      {filteredMenuItems.length === 0 ? (
        <p className="no-menu">No menu items available.</p>
      ) : (
        <div className="menu-list">
          {filteredMenuItems.map((item) => (
            <div key={item._id} className="menu-card">
              <h3>{item.name}</h3>
              <p className="menu-description">{item.description}</p>
              <p className="menu-price"><strong>Price:</strong> {item.price} BD</p>

              {user && user.role !== "admin" && (
                <button className="add-to-cart-btn btn btn-primary" onClick={() => handleAddToCart(item)}>
                  Add to Cart
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <Modal show={showModal} onHide={closeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Notification</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Restaurant;