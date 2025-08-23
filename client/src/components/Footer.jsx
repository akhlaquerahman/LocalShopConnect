import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-dark text-white mt-5">
            {/* Main Footer Content */}
            <div className="container py-5">
                <div className="row">
                    {/* "Why Shop With Us?" Section - 4 columns on medium devices */}
                    <div className="col-md-4 text-center text-md-left mb-4 mb-md-0">
                        <h5 className="mb-4">Why Shop With Us?</h5>
                        <ul className="list-unstyled text-small">
                            <li className="mb-2">
                                <h5>🚚 Fast Delivery</h5>
                                <p>We deliver your products within 1-2 days.</p>
                            </li>
                            <li className="mb-2">
                                <h5>💳 Secure Payment</h5>
                                <p>100% secure and trusted payment methods.</p>
                            </li>
                            <li className="mb-2">
                                <h5>📞 24/7 Support</h5>
                                <p>Our support team is always available to help you.</p>
                            </li>
                        </ul>
                    </div>

                    {/* Quick Links Section - 2 columns on medium devices */}
                    <div className="col-md-2 text-center text-md-left mb-4 mb-md-0">
                        <h5 className="mb-4">Quick Links</h5>
                        <ul className="list-unstyled">
                            <li><Link to="/about-us" className="text-white text-decoration-none">About Us</Link></li>
                            <li><Link to="/contact-us" className="text-white text-decoration-none">Contact Us</Link></li>
                            <li><Link to="/privacy-policy" className="text-white text-decoration-none">Privacy Policy</Link></li>
                            <li><Link to="/terms" className="text-white text-decoration-none">Terms & Conditions</Link></li>
                            <li><Link to="/faq" className="text-white text-decoration-none">FAQ</Link></li>
                        </ul>
                    </div>

                    {/* Social Media Section - 2 columns on medium devices */}
                    <div className="col-md-2 text-center text-md-left mb-4 mb-md-0">
                        <h5 className="mb-4">Follow Us</h5>
                        <ul className="list-unstyled d-flex justify-content-center justify-content-md-start">
                            <li className="me-3"><a href="https://facebook.com" className="text-white text-decoration-none" target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook-f fa-lg"></i></a></li>
                            <li className="me-3"><a href="https://twitter.com" className="text-white text-decoration-none" target="_blank" rel="noopener noreferrer"><i className="fab fa-twitter fa-lg"></i></a></li>
                            <li className="me-3"><a href="https://instagram.com" className="text-white text-decoration-none" target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram fa-lg"></i></a></li>
                            <li className="me-3"><a href="https://linkedin.com" className="text-white text-decoration-none" target="_blank" rel="noopener noreferrer"><i className="fab fa-linkedin-in fa-lg"></i></a></li>
                        </ul>
                    </div>

                    {/* Newsletter Section - 4 columns on medium devices */}
                    <div className="col-md-4 text-center text-md-left">
                        <h5 className="mb-4">Newsletter</h5>
                        <p>Subscribe to our newsletter for the latest updates and offers.</p>
                        <form>
                            <div className="input-group mb-3">
                                <input type="email" className="form-control" placeholder="Enter your email" />
                                <button className="btn btn-outline-success" type="submit">Subscribe</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Copyright Section */}
            <div className="bg-dark text-center py-3 border-top border-secondary">
                <small>&copy; {new Date().getFullYear()} ApnaShop. All rights reserved.</small>
            </div>
        </footer>
    );
}

export default Footer;