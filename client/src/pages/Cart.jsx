import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL;

const DELIVERY_FEE = 10;

function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const navigate = useNavigate();

    const fetchCartItems = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("No auth token, user is not logged in.");
                return;
            }

            const res = await axios.get(`${API_URL}/api/cart`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setCartItems(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error("Failed to load cart:", err);
            setCartItems([]);
        }
    };

    useEffect(() => {
        fetchCartItems();
    }, []);

    const handleRemove = async (itemId) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("User not authenticated.");

            await axios.delete(`${API_URL}/api/cart/${itemId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            fetchCartItems(); // Cart को re-fetch करें
        } catch (err) {
            console.error("Failed to remove item:", err);
        }
    };
    
    // ✅ सिंगल आइटम के लिए 'Buy Now' लॉजिक
    const handleBuyNow = (item) => {
        const singleProductData = {
            items: [item], // सिर्फ एक आइटम भेजें
            total: item.price * item.quantity,
            deliveryFee: DELIVERY_FEE
        };
        navigate("/checkout", {
            state: { cartData: singleProductData, fromBuyNow: true }
        });
    };

    // ✅ सभी कार्ट आइटम्स के लिए 'Checkout' लॉजिक
    const handleCheckout = () => {
        const cartData = {
            items: cartItems,
            total: subtotal,
            deliveryFee: DELIVERY_FEE
        };
        navigate("/checkout", {
            state: { cartData: cartData, fromBuyNow: false }
        });
    };
    
    // ✅ Subtotal की गणना
    const subtotal = cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );

    // ✅ Total amount की गणना
    const totalAmount = subtotal > 0 ? subtotal + DELIVERY_FEE : 0;

    return (
        <div className="container my-5">
            <h2 className="mb-4 text-center">🛒 Your Cart</h2>
            {cartItems.length === 0 ? (
                <p className="text-center text-muted">Your cart is empty.</p>
            ) : (
                <div className="row">
                    {cartItems.map((item) => (
                        <div className="col-md-4" key={item._id}>
                            <div className="card mb-4">
                                <img src={item.image} className="card-img-top" alt={item.title || item.name} />
                                <div className="card-body">
                                    <h5 className="card-title">{item.title || item.name}</h5>
                                    <p className="card-text">Price: ₹{item.price}</p>
                                    <p className="card-text">Qty: {item.quantity}</p>
                                    <p className="card-text">
                                        <small className="text-muted">
                                            Added on: {item.timestamp ? new Date(item.timestamp).toLocaleString() : 'N/A'}
                                        </small>
                                    </p>
                                    <div className="d-flex justify-content-between">
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleRemove(item._id)}
                                        >
                                            Remove
                                        </button>
                                        <button
                                            className="btn btn-success btn-sm"
                                            onClick={() => handleBuyNow(item)}
                                        >
                                            Buy Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="col-12 mt-4">
                        <div className="card shadow-sm p-4">
                            <h4 className="card-title">Order Summary</h4>
                            <div className="d-flex justify-content-between mb-2">
                                <span>Subtotal:</span>
                                <span>₹{subtotal.toFixed(2)}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                                <span>Delivery Fee:</span>
                                <span>₹{DELIVERY_FEE.toFixed(2)}</span>
                            </div>
                            <hr />
                            <div className="d-flex justify-content-between font-weight-bold">
                                <span>Total Amount:</span>
                                <span>₹{totalAmount.toFixed(2)}</span>
                            </div>
                            <button className="btn btn-primary mt-3" onClick={handleCheckout}>
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Cart;