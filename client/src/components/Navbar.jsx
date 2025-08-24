// src/components/Navbar.jsx
import { useContext, useState, useRef, useEffect } from "react";  
import { Link, NavLink, useNavigate } from 'react-router-dom';  
import 'bootstrap/dist/css/bootstrap.min.css'; 
import { CartContext } from '../context/CartContext'; 
import { UserContext } from '../context/UserContext'; 
import { AdminAuthContext } from '../context/AdminAuthContext'; 
import { DeliveryAuthContext } from '../context/DeliveryAuthContext'; 
import { AppOwnerAuthContext } from '../context/AppOwnerContext';
import '../styles/Navbar.css';  

function Navbar() { 
  const { cartCount } = useContext(CartContext); 
  const { user, logout } = useContext(UserContext); 
  const { admin, adminLogout } = useContext(AdminAuthContext); 
  const { deliveryPerson, deliveryLogout } = useContext(DeliveryAuthContext); 
  const { appOwner, appOwnerLogout } = useContext(AppOwnerAuthContext);

  const [searchQuery, setSearchQuery] = useState('');  
  const navigate = useNavigate();  
  const navbarRef = useRef(null);
  const togglerRef = useRef(null);

  // Close navbar when clicking outside or on a link
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarRef.current && 
          !navbarRef.current.contains(event.target) &&
          !togglerRef.current.contains(event.target)) {
        closeNavbar();
      }
    };

    // Add event listener when component mounts
    document.addEventListener('mousedown', handleClickOutside);
    
    // Clean up event listener when component unmounts
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const closeNavbar = () => {
    // Use Bootstrap's JavaScript to close the navbar
    if (window.$ && window.$.fn.collapse) {
      window.$('#navbarContent').collapse('hide');
    } else {
      // Fallback: manually remove the 'show' class
      const navbarContent = document.getElementById('navbarContent');
      if (navbarContent && navbarContent.classList.contains('show')) {
        navbarContent.classList.remove('show');
      }
    }
  };

  const handleLogout = () => { 
    closeNavbar();
    if (appOwner) {
        appOwnerLogout();
    } else if (admin) { 
        adminLogout();
    } else if (deliveryPerson) { 
        deliveryLogout(); 
    } else { 
        logout(); 
    } 
  }; 

  const handleSearch = (e) => { 
    e.preventDefault();  
    closeNavbar();
    if (searchQuery.trim()) { 
      navigate(`/products/search?type=${searchQuery.trim()}`); 
    } 
  }; 

  // Function to handle navigation clicks
  const handleNavClick = () => {
    closeNavbar();
  };

  return ( 
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4 fixed-top" style={{ height: '80px' }} ref={navbarRef}> 
      <NavLink to="/" className="navbar-brand" onClick={handleNavClick}>🛍️ LocalShopConnect</NavLink> 
      <button 
        className="navbar-toggler" 
        type="button" 
        data-bs-toggle="collapse" 
        data-bs-target="#navbarContent"
        ref={togglerRef}
      > 
        <span className="navbar-toggler-icon"></span> 
      </button> 
      <div className="collapse navbar-collapse" id="navbarContent"> 
        <ul className="navbar-nav me-auto mb-2 mb-lg-0"> 
          <li className="nav-item"> 
            <NavLink to="/category" className="nav-link" onClick={handleNavClick}>Category</NavLink> 
          </li> 
          {admin && ( 
            <> 
              <li className="nav-item"> 
                <NavLink to="/admin/products" className="nav-link" onClick={handleNavClick}>Add Products</NavLink> 
              </li> 
            </> 
          )} 
          
        </ul> 
        <div className="d-flex justify-content-center flex-grow-1 mx-4"> 
          <form className="d-flex w-100" role="search" style={{ maxWidth: '100%' }} onSubmit={handleSearch}> 
            <input  
              className="form-control me-2"  
              type="search"  
              placeholder="Search products..."  
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            /> 
            <button className="btn btn-outline-warning" type="submit">Search</button> 
          </form> 
        </div> 
        
        {/* App Owner का नाम दिखाएँ */}
        {appOwner && (
          <div className="d-flex align-items-center text-white me-3"> 
            <p className="mb-0 me-2">Hello, <i><b>{appOwner.name}</b></i></p>
          </div>
        )}
        
        {admin && ( 
          <div className="d-flex align-items-center text-white me-3"> 
            <p className="mb-0 me-2">Hello, <i><b>{admin.name}</b></i></p> 
          </div> 
        )} 

        {deliveryPerson && ( 
          <div className="d-flex align-items-center text-white me-3"> 
            <p className="mb-0 me-2">Hello, <i><b>{deliveryPerson.name}</b></i></p> 
          </div> 
        )} 

        <div className="d-flex align-items-center gap-2"> 
          {!admin && !deliveryPerson && !appOwner && ( 
            <Link to="/cart" className="btn btn-outline-warning position-relative" onClick={handleNavClick}> 
              🛒 Cart 
              {cartCount > 0 && ( 
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"> 
                  {cartCount} 
                </span> 
              )} 
            </Link> 
          )} 
          
          {user || admin || deliveryPerson || appOwner ? ( 
            <div className="dropdown"> 
              <button className="btn btn-outline-light dropdown-toggle" type="button" data-bs-toggle="dropdown"> 
                {user ? `👤 ${user.name}` : admin ? "👑 Seller" : deliveryPerson ? "🚚 Delivery" : "🏢 App Owner"}
              </button> 
              <ul className="dropdown-menu dropdown-menu-end"> 
                {user && ( 
                  <> 
                    <li><Link to="/profile" className="dropdown-item" onClick={handleNavClick}>My Account</Link></li> 
                    <li><Link to="/profile/orderhistory" className="dropdown-item" onClick={handleNavClick}>My Orders</Link></li> 
                    <li><hr className="dropdown-divider" /></li> 
                  </> 
                )} 
                {admin && ( 
                  <> 
                    <li><Link to="/admin/profile" className="dropdown-item" onClick={handleNavClick}>Seller Profile</Link></li> 
                    <li><Link to="/admin/orders" className="dropdown-item" onClick={handleNavClick}>Seller Orders</Link></li> 
                    <li><hr className="dropdown-divider" /></li> 
                  </> 
                )} 
                {deliveryPerson && ( 
                  <> 
                  <li><Link to="/deliveryperson/profile" className="dropdown-item" onClick={handleNavClick}>My Profile</Link></li> 
                  <li><Link to="/deliveryperson/orders" className="dropdown-item" onClick={handleNavClick}>Delivery Orders</Link></li> 
                  <li><hr className="dropdown-divider" /></li> 
                  </> 
                )} 
                {/* App Owner के लिए ड्रॉपडाउन आइटम */}
                {appOwner && (
                    <>
                        <li><Link to="/app-owner/profile" className="dropdown-item" onClick={handleNavClick}>Owner Profile</Link></li>
                        <li><hr className="dropdown-divider" /></li>
                    </>
                )}
                <li><button className="dropdown-item" onClick={handleLogout}>Logout</button></li> 
              </ul> 
            </div> 
          ) : ( 
            <Link to="/login" className="btn btn-outline-light" onClick={handleNavClick}>Login</Link> 
          )} 
        </div> 
      </div> 
    </nav> 
  ); 
} 

export default Navbar;