// src/components/ReviewForm.jsx
import React from 'react';

function ReviewForm({ rating, hover, comment, setRating, setHover, setComment, onSubmit }) {
  return (
    <div className="mt-4 p-3 bg-light rounded">
      <h5>Write a Review</h5>
      <form onSubmit={onSubmit}>
        <div className="mb-3">
          <label className="form-label">Your Rating:</label>
          <div className="star-rating">
            {[...Array(5)].map((_, index) => {
              const ratingValue = index + 1;
              return (
                <span
                  key={ratingValue}
                  className={`star ${ratingValue <= (hover || rating) ? "text-warning" : "text-muted"}`}
                  style={{ fontSize: '2rem', cursor: 'pointer' }}
                  onMouseEnter={() => setHover(ratingValue)}
                  onMouseLeave={() => setHover(0)}
                  onClick={() => setRating(ratingValue)}
                >
                  ★
                </span>
              );
            })}
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="comment" className="form-label">Your Review:</label>
          <textarea
            id="comment"
            className="form-control"
            rows="3"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-dark">Submit Review</button>
      </form>
    </div>
  );
}

export default ReviewForm;
