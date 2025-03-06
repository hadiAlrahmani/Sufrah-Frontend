import "./Cart.css";
import { useState, useEffect } from "react";
import {
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  getCart,
  checkout,
} from "../../services/cartService";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button } from "react-bootstrap";

const Cart = ({ handleModal }) => { // Accept handleModal as a prop
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  // ✅ Modal State
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const cart = getCart();
    setCartItems(cart);
  }, []);

  useEffect(() => {
    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotalPrice(total.toFixed(3));
  }, [cartItems]);

  const handleCheckout = () => {
    setShowModal(true); // ✅ Open Modal on Checkout Click
  };

  const confirmCheckout = () => {
    checkout(cartItems, setCartItems, setTotalPrice);
    setShowModal(false); // ✅ Close modal after confirming checkout
  };

  const handleIncreaseQuantity = (itemId) => {
    const updatedCart = increaseQuantity(itemId);
    if (updatedCart) {
      setCartItems(updatedCart);
    }
  };

  const handleDecreaseQuantity = (itemId) => {
    const updatedCart = decreaseQuantity(itemId);
    if (updatedCart) {
      setCartItems(updatedCart);
    }
  };

  const handleRemoveFromCart = (itemId) => {
    const updatedCart = removeFromCart(itemId);
    if (updatedCart) {
      setCartItems(updatedCart);
    } else {
      handleModal("This item could not be removed from the cart.");
    }
  };

  return (
    <div className="cart-container">
      <h1 className="cart-header">Your Cart</h1>
      {cartItems.length === 0 ? (
        <p className="empty-cart-message">Your cart is empty.</p>
      ) : (
        <>
          <ul className="cart-items-list">
            {cartItems.map((item) => (
              <li key={item._id} className="cart-item">
                <div className="item-info">
                  <h3>{item.name}</h3>
                  <p>{item.price} BD</p>
                  <p>Quantity: {item.quantity}</p>
                </div>
                <div className="item-actions">
                  <button className="btn-action" onClick={() => handleIncreaseQuantity(item._id)}>+</button>
                  <button className="btn-action" onClick={() => handleDecreaseQuantity(item._id)}>-</button>
                  <button className="btn-remove" onClick={() => handleRemoveFromCart(item._id)}>Remove</button>
                </div>
              </li>
            ))}
          </ul>
          <div className="total-section">
            <h2>Total: {totalPrice} BD</h2>
            <button className="btn-checkout" onClick={handleCheckout}>Checkout</button>
          </div>
        </>
      )}

      {/* ✅ Bootstrap Modal for Checkout Confirmation */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header>
          <Modal.Title>Confirm Checkout</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to checkout? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={confirmCheckout}>Confirm</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Cart;