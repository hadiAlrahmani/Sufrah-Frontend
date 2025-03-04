import { useState, useEffect } from "react";

const BACKEND_URL = import.meta.env.VITE_EXPRESS_BACKEND_URL;

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
    setTotalPrice(total.toFixed(3));
  }, [cartItems]);

  // Increase quantity
  const increaseQuantity = (itemId) => {
    const updatedCart = cartItems.map((item) =>
      item._id === itemId ? { ...item, quantity: item.quantity + 1 } : item // If item ID matches, increase its quantity by 1
    );
    updateCart(updatedCart);
  };

  // Decrease quantity
  const decreaseQuantity = (itemId) => {
    let updatedCart = cartItems.map((item) =>
      item._id === itemId ? { ...item, quantity: item.quantity - 1 } : item
    );
    // Remove item if its quantity is 0
    updatedCart = updatedCart.filter((item) => item.quantity > 0);
    updateCart(updatedCart);
  };

  // Remove an item from the cart
  const removeFromCart = (itemId) => {
    const updatedCart = cartItems.filter((item) => item._id !== itemId);
    updateCart(updatedCart);
  };

  // Update cart in both state and local storage
  const updateCart = (updatedCart) => {
    setCartItems(updatedCart);
    //Saves the updated cart permanently in the browser's local storage so that the data is not lost when the page refreshes. (Used internet help).
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // Checkout Function
  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    // Get user token
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to place an order.");
      return;
    }

    // Takes restaurant ID's to check that all items in cart are from the same restaurant.
    const restaurantId = cartItems[0].restaurant;

    const orderData = {
      restaurant: restaurantId,
      items: cartItems.map((item) => ({
        menuItem: item._id,
        quantity: item.quantity
      }))
    };

    // Used the internet help
    try {
      const res = await fetch(`${BACKEND_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Send token for authentication
        },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to place order");

      // Clear cart after successful order
      localStorage.removeItem("cart");
      setCartItems([]);
      setTotalPrice(0);

      alert("Order placed successfully!");
      window.location.href = "/orders";
    } catch (error) {
      alert(error.message);
    }
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
          <button onClick={handleCheckout}>Checkout</button>
        </>
      )}
    </div>
  );
};

export default Cart;