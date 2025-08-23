import React from 'react';

const AboutUs = () => {
  return (
    <div className="container py-5 my-5">
      <div className="row text-center justify-content-center">
        <div className="col-12">
          <h1 className="display-4 fw-bold text-success mb-4">About Us</h1>
          <p className="lead text-muted">
            Welcome to ApnaShop, your one-stop destination for all your shopping needs. Founded on the principle of providing high-quality products at competitive prices, we are committed to delivering an exceptional online shopping experience.
          </p>
        </div>
      </div>
      <div className="row mt-5 text-center">
        <div className="col-md-4 mb-4">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body">
              <h2 className="card-title h4 fw-bold text-success">Our Mission</h2>
              <p className="card-text text-muted">
                Our mission is to simplify your shopping journey by offering a diverse range of products, fast and reliable delivery, and secure payment options, all backed by 24/7 customer support.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body">
              <h2 className="card-title h4 fw-bold text-primary">Our Vision</h2>
              <p className="card-text text-muted">
                We envision a world where every shopper can access the products they love without any hassle. We are constantly innovating to improve our platform and expand our product catalog.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body">
              <h2 className="card-title h4 fw-bold text-info">Our Values</h2>
              <p className="card-text text-muted">
                We operate with integrity, prioritize customer satisfaction, and believe in transparency. Your trust is our most valuable asset, and we work hard to earn it every day.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
