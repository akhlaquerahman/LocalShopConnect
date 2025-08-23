import React, { useState } from 'react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAnswer = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqData = [
    {
      question: "What is ApnaShop's return policy?",
      answer: "We offer a 30-day return policy on most items. Products must be in their original condition with all tags and packaging. Please visit our returns page for more details."
    },
    {
      question: "How can I track my order?",
      answer: "Once your order is shipped, you will receive an email with a tracking number and a link to the courier's website. You can also track your order from your account dashboard."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, debit cards, UPI, and net banking. We also offer Cash on Delivery (COD) for eligible orders."
    },
    {
      question: "Do you ship internationally?",
      answer: "Currently, we only ship within India. We are working to expand our services to other countries in the near future."
    }
  ];

  return (
    <div className="container py-5 my-5">
      <div className="row justify-content-center text-center">
        <div className="col-12">
          <h1 className="display-4 fw-bold text-success mb-5">Frequently Asked Questions (FAQ)</h1>
        </div>
      </div>

      <div className="accordion" id="faqAccordion">
        {faqData.map((item, index) => (
          <div key={index} className="accordion-item shadow-sm mb-3">
            <h2 className="accordion-header" id={`heading${index}`}>
              <button
                className={`accordion-button ${openIndex === index ? '' : 'collapsed'}`}
                type="button"
                onClick={() => toggleAnswer(index)}
              >
                {item.question}
              </button>
            </h2>
            <div
              id={`collapse${index}`}
              className={`accordion-collapse collapse ${openIndex === index ? 'show' : ''}`}
              aria-labelledby={`heading${index}`}
              data-bs-parent="#faqAccordion"
            >
              <div className="accordion-body text-muted">
                {item.answer}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
