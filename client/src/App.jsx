// client/src/App.jsx
// This is the main entry point of the React application.
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Cart from "./pages/Cart";
import SearchResults from './components/SearchResults';
import ProductDetails from "./components/ProductDetails";
import Home from "./pages/Home";
import { CartProvider } from "./context/CartContext";
import EditProduct from "./pages/EditProduct";  // Importing EditProduct component for editing products
import CategorySection from "./components/CategorySection";
import CategoryProducts from "./components/CategoryProducts";

// Importing pages for user authentication and profile management
import Register from "./pages/RegisterPage";
import Login from "./pages/LoginPage";
import CheckoutPage from "./pages/CheckOutPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { UserProvider } from "./context/UserContext";
import OrderHistoryPage from "./pages/OrderHistoryPage";
import OrderDetailPage from "./pages/OrderDetailPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import ProfilePage from "./pages/ProfilePage";
import AddAddress from './pages/AddAddress';
import EditAddress from './pages/EditAddress';

// Importing Admin related components and contexts
import { AdminAuthProvider } from './context/AdminAuthContext';
import AdminRoute from "./AdminPage/AdminRoute";
import AdminProductManagement from './AdminPage/AdminProductManagement';
import AdminOrders from './AdminPage/AdminOrders';
import AdminLoginForm from './AdminPage/AdminLoginForm';
import AdminProfilePage from './AdminPage/AdminProfilePage';

// Importing Delivery related components and contexts
import { DeliveryAuthProvider } from './context/DeliveryAuthContext';
import DeliveryPersonLoginForm from './AdminPage/DeliveryLoginForm';
import DeliveryPersonRoute from "./AdminPage/DeliveryRoute";
import DeliveryOrders from './AdminPage/DeliveryOrders';
import DeliveryProfilePage from './AdminPage/DeliveryProfilePage';

// Importing AuthRedirect component to handle redirection for login and registration
import AuthRedirect from './components/AuthRedirect'; 

// Importing AppOwner related components and contexts
import { AppOwnerAuthContextProvider } from './context/AppOwnerContext';
import AppOwnerRoute from './AdminPage/AppOwnerRoute'; // ✅ App Owner के लिए नया ProtectedRoute component
import AppOwnerLoginPage from './AdminPage/AppOwnerLoginPage'; // ✅ App Owner का Login Page
import AppOwnerProfilePage from './AdminPage/AppOwnerProfilePage'; // ✅ App Owner का Profile Page

import AboutUs from "./pages/quickLinksPage/AboutUs";
import ContactUs from "./pages/quickLinksPage/ContactUs";
import FAQ from "./pages/quickLinksPage/FAQ";
import PrivacyPolicy from "./pages/quickLinksPage/PrivacyPolicy";
import TermsAndConditions from "./pages/quickLinksPage/TermsAndConditions";

function App() {
  return (
    <AppOwnerAuthContextProvider>
      <UserProvider>
        <AdminAuthProvider>
          <DeliveryAuthProvider>
            <CartProvider>
              <Router>
                <div className="d-flex flex-column min-vh-100">
                  <Navbar />
                  <main className="flex-grow-1">
                    <Routes>
                      {/* Public Routes */}
                      <Route path="/" element={<Home />} />
                      <Route path="/product/:id" element={<ProductDetails />} />
                      <Route path="/category" element={<CategorySection />} />
                      <Route path="/category/:categoryName" element={<CategoryProducts />} />
                      <Route path="/products/search" element={<SearchResults />} />
                      {/* Quick links */}
                      <Route path="/about-us" element={<AboutUs/>}/>
                      <Route path="/contact-us" element={<ContactUs/>}/>
                      <Route path="/privacy-policy" element={<PrivacyPolicy/>}/>
                      <Route path="/terms" element={<TermsAndConditions/>}/>
                      <Route path="/faq" element={<FAQ/>}/>

                      {/* ✅ AuthRedirect's use for Login and Register */}
                      <Route
                        path="/login"
                        element={
                          <AuthRedirect>
                            <Login />
                          </AuthRedirect>
                        }
                      />
                      <Route
                        path="/register"
                        element={
                          <AuthRedirect>
                            <Register />
                          </AuthRedirect>
                        }
                      />
                      <Route
                        path="/admin/login"
                        element={
                          <AuthRedirect>
                            <AdminLoginForm />
                          </AuthRedirect>
                        }
                      />
                      <Route
                        path="/delivery/login"
                        element={
                          <AuthRedirect>
                            <DeliveryPersonLoginForm />
                          </AuthRedirect>
                        }
                      />
                      {/* ✅ App Owner के लिए Public Login Route */}
                      <Route
                        path="/app-owner/login"
                        element={
                          <AuthRedirect>
                            <AppOwnerLoginPage />
                          </AuthRedirect>
                        }
                      />

                      {/* Protected User Routes */}
                      <Route element={<ProtectedRoute />}>
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/checkout" element={<CheckoutPage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/profile/orderhistory" element={<OrderHistoryPage />} />
                        <Route path="/profile/order-confirmation" element={<OrderConfirmationPage />} />
                        <Route path="/profile/add-address" element={<AddAddress />} />
                        <Route path="/profile/edit-address/:addressId" element={<EditAddress />} />
                        <Route path="/order/:orderId" element={<OrderDetailPage />} />
                      </Route>
                      
                      {/* Protected Admin Routes */}
                      <Route element={<AdminRoute />}>
                        <Route path="/admin/products" element={<AdminProductManagement />} />
                        <Route path="/admin/orders" element={<AdminOrders />} />
                        <Route path="/admin/edit/:id" element={<EditProduct />} />
                        <Route path="/admin/profile" element={<AdminProfilePage />} />
                      </Route>
                      
                      {/* Protected Delivery Person Routes */}
                      <Route element={<DeliveryPersonRoute />}>
                        <Route path="/deliveryperson/profile" element={<DeliveryProfilePage />} />
                        <Route path="/deliveryperson/orders" element={<DeliveryOrders />} />
                      </Route>

                      {/* ✅ Protected App Owner Routes */}
                      <Route element={<AppOwnerRoute />}>
                        <Route path="/app-owner/profile" element={<AppOwnerProfilePage />} />
                      </Route>
                      
                    </Routes>
                  </main>
                  <Footer />
                </div>
              </Router>
            </CartProvider>
          </DeliveryAuthProvider>
        </AdminAuthProvider>
      </UserProvider>
    </AppOwnerAuthContextProvider>
  );
}

export default App;
