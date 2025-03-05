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
                <button onClick={() => setCartItems(increaseQuantity(item._id))}>+</button>
                <button onClick={() => setCartItems(decreaseQuantity(item._id))}>-</button>
                <button onClick={() => setCartItems(removeFromCart(item._id))}>Remove</button>
              </li>
            ))}
          </ul>
          <h2>Total: {totalPrice} BD</h2>
          <button onClick={() => checkout(cartItems, setCartItems, setTotalPrice)}>Checkout</button>
        </>
      )}
    </div>
  );
};

export default Cart;