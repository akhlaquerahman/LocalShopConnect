// src/components/CheckoutPage.jsx

import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { CartContext } from "../context/CartContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import qrcode from "../assets/qrcode.png";
import "../styles/CheckoutPage.css";


const CheckoutPage = () => {
  const { user } = useContext(UserContext);
  const { cartItems, getCartTotal } = useContext(CartContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedAddress, setSelectedAddress] = useState(null);

  const cartDataFromState = location.state?.cartData;
  const itemsToDisplay = cartDataFromState ? cartDataFromState.items : cartItems;

  useEffect(() => {
    if (user?.addresses && user.addresses.length > 0) {
      setSelectedAddress(user.addresses[0]);
    }
  }, [user]);

  useEffect(() => {
    sessionStorage.removeItem('orderPlaced');
  }, []);

  const handlePaymentConfirmation = () => {
    // Replaced alert() with a more user-friendly modal or message box
    const showMessage = (message) => {
      // In a real app, you would show a modal or toast notification here.
      // For this example, we'll just log to the console.
      console.log(message);
      // You could also add a state to show a div with the message.
      // E.g., <div className="alert alert-danger">{message}</div>
    };

    if (!user) {
      showMessage("Please log in to proceed with the payment.");
      navigate('/login');
      return;
    }

    if (itemsToDisplay.length === 0) {
      showMessage("Your cart is empty. Please add items to proceed.");
      return;
    }

    if (!selectedAddress) {
      showMessage("Please select a shipping address.");
      return;
    }

    const cartDataForOrder = cartDataFromState || {
      items: [...cartItems],
      total: getCartTotal(),
    };

    navigate("/profile/order-confirmation", {
      state: {
        cartData: cartDataForOrder,
        shippingAddress: selectedAddress,
        fromBuyNow: !!location.state?.fromBuyNow
      },
      replace: true
    });
  };

  return (
    <div className="checkout-container mt-2">
      <div className="checkout-card card border-0 shadow-lg">
        <div className="card-header bg-primary text-white">
          <h2 className="mb-0 text-center">
            <i className="bi bi-cart-check me-2"></i>
            Order Checkout
          </h2>
        </div>
        <div className="card-body">
          <div className="address-section mb-3 p-2 border rounded">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h3 className="section-title mb-0">
                <i className="bi bi-truck me-2"></i>
                Delivery Address
              </h3>
              <Link
                to="/profile"
                state={{ activeTab: 'addresses' }}
                className="btn btn-sm btn-outline-primary edit-address-btn"
              >
                <i className="bi bi-pencil-square me-1"></i>
                Manage
              </Link>
            </div>

            {user?.addresses?.length > 0 ? (
              <div>
                {user.addresses.map((address) => (
                  <div
                    key={address._id}
                    className={`custom-radio-card ${selectedAddress?._id === address._id ? 'selected' : ''}`}
                    onClick={() => setSelectedAddress(address)}
                  >
                    <input
                      className="form-check-input visually-hidden"
                      type="radio"
                      name="shippingAddress"
                      id={address._id}
                      value={address._id}
                      checked={selectedAddress?._id === address._id}
                      onChange={() => setSelectedAddress(address)}
                    />
                    <div className="custom-radio-indicator"></div>
                    <div className="address-content">
                      <strong>{address.name}</strong>, {address.city}, {address.district}, {address.state} - {address.pinCode}
                      <small className="text-muted">Phone: {address.phone}</small>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="alert alert-danger p-2">
                <i className="bi bi-exclamation-circle-fill me-2"></i>
                No address found.
                <Link to="/profile/add-address" className="alert-link ms-2">
                  Add Address
                </Link>
              </div>
            )}
          </div>

          <div className="payment-section p-2 border rounded">
            <h3 className="section-title">
              <i className="bi bi-qr-code-scan me-2"></i>
              Payment Method
            </h3>
            <div className="text-center mb-2">
              <img
                src={qrcode}
                alt="UPI QR Code"
                className="qr-code img-fluid border p-1"
              />
              <p className="payment-instructions mt-2">
                Scan this QR code using any UPI payment app
                <br />
                <small className="text-muted">
                  (PhonePe, Google Pay, Paytm, BHIM, etc.)
                </small>
              </p>
            </div>
          </div>

          <div className="d-grid mt-3">
            <button
              className="btn btn-success btn-lg payment-confirm"
              onClick={handlePaymentConfirmation}
            >
              <i className="bi bi-check-circle-fill me-2"></i>
              I've Made the Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;