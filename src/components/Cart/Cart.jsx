import "./Cart.css";
import { useState, useEffect } from "react";
import { increaseQuantity, decreaseQuantity, removeFromCart, getCart, checkout } from "../../services/cartService";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const cart = getCart();
    setCartItems(cart);
  }, []);

  useEffect(() => {
    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotalPrice(total.toFixed(3));
  }, [cartItems]);

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
                  <button className="btn-action" onClick={() => setCartItems(increaseQuantity(item._id))}>+</button>
                  <button className="btn-action" onClick={() => setCartItems(decreaseQuantity(item._id))}>-</button>
                  <button className="btn-remove" onClick={() => setCartItems(removeFromCart(item._id))}>Remove</button>
                </div>
              </li>
            ))}
          </ul>
          <div className="total-section">
            <h2>Total: {totalPrice} BD</h2>
            <button className="btn-checkout" onClick={() => checkout(cartItems, setCartItems, setTotalPrice)}>Checkout</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;