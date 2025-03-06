const BACKEND_URL = import.meta.env.VITE_EXPRESS_BACKEND_URL;

const getCart = () => JSON.parse(localStorage.getItem("cart")) || [];

const saveCart = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
  return cart;
};

// Updated addToCart function to accept handleModal
const addToCart = (item, handleModal) => {
  let cart = getCart();

  if (cart.length > 0 && cart[0].restaurant !== item.restaurant) {
    // Trigger modal to inform the user
    handleModal(`Your cart contains items from a different restaurant. Adding ${item.name} is not possible. Please clear your current cart first.`);
    return; // Don't add item immediately
  }

  const existingItem = cart.find((cartItem) => cartItem._id === item._id);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...item, quantity: 1 });
  }

  saveCart(cart);
  // Show confirmation message for successful addition
  handleModal(`${item.name} has been added to your cart!`);
};

const increaseQuantity = (itemId) => {
  let cart = getCart();
  cart = cart.map((item) =>
    item._id === itemId ? { ...item, quantity: item.quantity + 1 } : item
  );
  return saveCart(cart);
};

const decreaseQuantity = (itemId) => {
  let cart = getCart();
  cart = cart.map((item) =>
    item._id === itemId ? { ...item, quantity: item.quantity - 1 } : item
  );
  cart = cart.filter((item) => item.quantity > 0);
  return saveCart(cart);
};

const removeFromCart = (itemId) => {
  let cart = getCart();
  cart = cart.filter((item) => item._id !== itemId);
  return saveCart(cart);
};

const checkout = async (cartItems, setCartItems, setTotalPrice) => {
  if (cartItems.length === 0) {
    return;
  }

  const token = localStorage.getItem("token");
  if (!token) {
    return;
  }

  const restaurantId = cartItems[0].restaurant;
  const orderData = {
    restaurant: restaurantId,
    items: cartItems.map((item) => ({
      menuItem: item._id,
      quantity: item.quantity,
    })),
  };

  try {
    const res = await fetch(`${BACKEND_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to place order");

    localStorage.removeItem("cart");
    setCartItems([]);
    setTotalPrice(0);

    window.location.href = "/orders";
  } catch (error) {
    console.error(error.message);
  }
};

export { getCart, addToCart, increaseQuantity, decreaseQuantity, removeFromCart, checkout };