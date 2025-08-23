// src/context/CartContext.js
import React, { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Token fetch helper
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return { Authorization: `Bearer ${token}` };
  };

  // Calculate total amount
  const getCartTotal = () => {
    return cartItems.reduce(
      (total, item) => total + (item.price * (item.quantity || 1)),
      0
    );
  };

  // Fetch cart items from backend (memoized)
  const fetchCart = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/api/cart`, {
        headers: getAuthHeaders(),
      });
      setCartItems(res.data);
    } catch (err) {
      console.error("Error fetching cart items", err);
    }
  }, []); // empty deps because getAuthHeaders is stable

  // Add item to cart
  const addToCart = async (product) => {
    try {
      setCartItems((prev) => {
        const existingItem = prev.find((item) => item.productId === product._id);
        if (existingItem) {
          return prev.map((item) =>
            item.productId === product._id
              ? { ...item, quantity: (item.quantity || 1) + 1 }
              : item
          );
        }
        return [...prev, { ...product, productId: product._id, quantity: 1 }];
      });

      await axios.post(
        `${API_URL}/api/cart`,
        {
          productId: product._id,
          productType: product.productType,
          name: product.name || product.title,
          price: product.price,
          image: product.image || product.imgUrl,
          quantity: 1,
          timestamp: new Date().toISOString(),
        },
        { headers: getAuthHeaders() }
      );
    } catch (err) {
      console.error("Error adding to cart", err);
      fetchCart(); // fallback fetch
    }
  };

  // Remove item from cart
  const removeFromCart = async (cartItemId) => {
    try {
      setCartItems((prev) => prev.filter((item) => item._id !== cartItemId));
      await axios.delete(`${API_URL}/api/cart/${cartItemId}`, {
        headers: getAuthHeaders(),
      });
    } catch (err) {
      console.error("Error removing from cart", err);
      fetchCart();
    }
  };

  // Update item quantity
  const updateQuantity = async (cartItemId, newQuantity) => {
    try {
      if (newQuantity < 1) {
        removeFromCart(cartItemId);
        return;
      }

      setCartItems((prev) =>
        prev.map((item) =>
          item._id === cartItemId ? { ...item, quantity: newQuantity } : item
        )
      );

      await axios.patch(
        `${API_URL}/api/cart/${cartItemId}`,
        { quantity: newQuantity },
        { headers: getAuthHeaders() }
      );
    } catch (err) {
      console.error("Error updating quantity", err);
      fetchCart();
    }
  };

  // Clear the cart
  const clearCart = async () => {
    try {
      setCartItems([]);
      await axios.delete(`${API_URL}/api/cart/clear`, {
        headers: getAuthHeaders(),
      });
    } catch (err) {
      console.error("Error clearing cart", err);
      fetchCart();
    }
  };

  // Load cart on mount
  useEffect(() => {
    fetchCart();
  }, [fetchCart]); // dependency added

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        updateQuantity,
        getCartTotal,
        cartCount: cartItems.reduce(
          (count, item) => count + (item.quantity || 1),
          0
        ),
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
