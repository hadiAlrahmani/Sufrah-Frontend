import { useState, useEffect } from "react";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  // Load cart from local storage
  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(cart);
  }, []);

  // Recalculate total price whenever cartItems change
  useEffect(() => {
    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotalPrice(total.toFixed(3));  // Used help from the internet
  }, [cartItems]);

  // Increase quantity
  const increaseQuantity = (itemId) => {
    const updatedCart = cartItems.map((item) =>
      item._id === itemId ? { ...item, quantity: item.quantity + 1 } : item
    );
    updateCart(updatedCart);
  };

  // Decrease quantity
  const decreaseQuantity = (itemId) => {
    let updatedCart = cartItems.map((item) =>
      item._id === itemId ? { ...item, quantity: item.quantity - 1 } : item
    );
    updatedCart = updatedCart.filter((item) => item.quantity > 0);
    updateCart(updatedCart);
  };

  // Remove item from cart
  const removeFromCart = (itemId) => {
    const updatedCart = cartItems.filter((item) => item._id !== itemId);
    updateCart(updatedCart);
  };

  // Update cart and save to local storage
  const updateCart = (updatedCart) => {
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));  // Used help from the internet
  };

  return (
    <div>
      <h1>Your Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul>
            {cartItems.map((item) => (
              <li key={item._id}>
                <h3>{item.name}</h3>
                <p>{item.price} BD</p>
                <p>Quantity: {item.quantity}</p>
                <button onClick={() => increaseQuantity(item._id)}>+</button>
                <button onClick={() => decreaseQuantity(item._id)}>-</button>
                <button onClick={() => removeFromCart(item._id)}>Remove</button>
              </li>
            ))}
          </ul>
          <h2>Total: {totalPrice} BD</h2>
        </>
      )}
    </div>
  );
};

export default Cart;