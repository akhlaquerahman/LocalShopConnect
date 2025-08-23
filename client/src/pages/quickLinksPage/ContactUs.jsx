import React from 'react';

const ContactUs = () => {
  return (
    <div className="container py-5 my-5">
      <div className="row justify-content-center text-center mb-5">
        <div className="col-md-8">
          <h1 className="display-4 fw-bold text-success mb-3">Contact Us</h1>
          <p className="lead text-muted">
            Have a question or need assistance? Our team is here to help! Fill out the form below or use one of the contact methods provided.
          </p>
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4 p-md-5">
              <form>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Your Name</label>
                  <input type="text" className="form-control" id="name" />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email Address</label>
                  <input type="email" className="form-control" id="email" />
                </div>
                <div className="mb-3">
                  <label htmlFor="message" className="form-label">Message</label>
                  <textarea className="form-control" id="message" rows="4"></textarea>
                </div>
                <div className="d-grid gap-2">
                  <button type="submit" className="btn btn-success btn-lg">Send Message</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      
      <div className="row text-center mt-5">
        <div className="col-md-4 mb-3">
          <i className="fa fa-envelope-open-text fa-2x text-success mb-2"></i>
          <p className="text-muted">apnashop@gmail.com</p>
        </div>
        <div className="col-md-4 mb-3">
          <i className="fa fa-phone fa-2x text-primary mb-2"></i>
          <p className="text-muted">+91 1234567890</p>
        </div>
        <div className="col-md-4 mb-3">
          <i className="fa fa-map-marker-alt fa-2x text-info mb-2"></i>
          <p className="text-muted">New Delhi, India</p>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
