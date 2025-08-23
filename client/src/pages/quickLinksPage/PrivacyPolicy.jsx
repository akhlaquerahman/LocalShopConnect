import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="container py-5 my-5">
      <div className="row justify-content-center text-center">
        <div className="col-md-10">
          <h1 className="display-4 fw-bold text-success mb-3">Privacy Policy</h1>
          <p className="text-muted small mb-5">Last updated: August 20, 2024</p>
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="card shadow-sm p-4 border-0">
            <div className="card-body">
              <p>
                This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You.
              </p>

              <h2 className="h4 fw-bold mt-4">Interpretation and Definitions</h2>
              <h3 className="h5 fw-bold mt-3">Interpretation</h3>
              <p>
                The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.
              </p>
              <h3 className="h5 fw-bold mt-3">Definitions</h3>
              <ul className="list-unstyled">
                <li><strong>Account</strong> means a unique account created for You to access our Service or parts of our Service.</li>
                <li><strong>Company</strong> (referred to as either "the Company", "We", "Us" or "Our" in this Agreement) refers to ApnaShop.</li>
                <li><strong>Personal Data</strong> is any information that relates to an identified or identifiable individual.</li>
              </ul>

              <h2 className="h4 fw-bold mt-4">Collecting and Using Your Personal Data</h2>
              <h3 className="h5 fw-bold mt-3">Types of Data Collected</h3>
              <h4 className="h6 fw-bold mt-2">Personal Data</h4>
              <p>
                While using Our Service, We may ask You to provide Us with certain personally identifiable information that can be used to contact or identify You. Personally identifiable information may include, but is not limited to:
              </p>
              <ul className="list-unstyled">
                <li>Email address</li>
                <li>First name and last name</li>
                <li>Phone number</li>
                <li>Address, State, Province, ZIP/Postal code, City</li>
                <li>Usage Data</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
