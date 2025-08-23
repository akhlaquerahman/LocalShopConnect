import React from 'react';

const TermsAndConditions = () => {
  return (
    <div className="container py-5 my-5">
      <div className="row justify-content-center text-center">
        <div className="col-md-10">
          <h1 className="display-4 fw-bold text-success mb-3">Terms and Conditions</h1>
          <p className="text-muted small mb-5">Effective Date: August 20, 2024</p>
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="card shadow-sm p-4 border-0">
            <div className="card-body">
              <p>
                Welcome to ApnaShop! These terms and conditions outline the rules and regulations for the use of ApnaShop's Website, located at www.apnashop.com.
              </p>
              <p>
                By accessing this website we assume you accept these terms and conditions. Do not continue to use ApnaShop if you do not agree to take all of the terms and conditions stated on this page.
              </p>

              <h2 className="h4 fw-bold mt-4">License</h2>
              <p>
                Unless otherwise stated, ApnaShop and/or its licensors own the intellectual property rights for all material on ApnaShop. All intellectual property rights are reserved.
              </p>
              <ul className="list-unstyled">
                <li>Republish material from ApnaShop</li>
                <li>Sell, rent or sub-license material from ApnaShop</li>
                <li>Reproduce, duplicate or copy material from ApnaShop</li>
                <li>Redistribute content from ApnaShop</li>
              </ul>

              <h2 className="h4 fw-bold mt-4">User Comments</h2>
              <ul className="list-unstyled">
                <li>This Agreement shall begin on the date hereof.</li>
                <li>Portions of this website offer an opportunity for users to post and exchange opinions and information in certain areas of the website.</li>
                <li>You warrant and represent that:
                  <ul className="list-unstyled ms-4">
                    <li>You are entitled to post the Comments on our website and have all necessary licenses and consents to do so;</li>
                    <li>The Comments do not invade any intellectual property right, including without limitation copyright, patent or trademark of any third party;</li>
                  </ul>
                </li>
              </ul>

              <h2 className="h4 fw-bold mt-4">Disclaimer</h2>
              <p>
                The information contained on the website is for general information purposes only. We assume no responsibility for errors or omissions in the contents of the Service.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
