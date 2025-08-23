// routes/reviewRoutes.js

const express = require('express');
const router = express.Router();
const Review = require('../models/review');
const User = require('../models/Users');
const authMiddleware = require('../middleware/auth');

// ✅ Create a review
router.post('/:productId', authMiddleware, async (req, res) => {
    const { rating, comment } = req.body;
    const { productId } = req.params;

    try {

        // Get user details
        const user = await User.findById(req.user.userId); // ✅ Fix: Use req.user.userId
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const review = new Review({
            productId,
            userId: req.user.userId, // ✅ Fix: Use req.user.userId
            name: user.name,
            rating,
            comment,
        });

        await review.save();
        res.status(201).json({
            message: 'Review submitted successfully',
            review
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: 'Failed to submit review',
            details: err.message
        });
    }
});

// ✅ Delete review (Requires authMiddleware)
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        // ✅ Check if the logged-in user is the owner of the review
        if (review.userId.toString() !== req.user.userId.toString()) { // ✅ Fix: Use req.user.userId
            return res.status(403).json({ message: 'Not authorized to delete this review' });
        }
        await Review.findByIdAndDelete(req.params.id);
        res.json({ message: 'Review deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to delete review' });
    }
});

// ✅ Edit review (Requires authMiddleware)
router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }
        // ✅ Check if the logged-in user is the owner of the review
        if (review.userId.toString() !== req.user.userId.toString()) { // ✅ Fix: Use req.user.userId
            return res.status(403).json({ message: 'Not authorized to edit this review' });
        }

        review.rating = rating;
        review.comment = comment;
        await review.save();

        res.status(200).json({ message: "✅ Review updated successfully", review });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "❌ Failed to update review" });
    }
});

router.get('/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId })
      .populate('userId', 'name _id') // Explicitly include name + id
      .lean()
      .sort({ createdAt: -1 });

    const formattedReviews = reviews.map(review => ({
      _id: review._id,
      productId: review.productId,
      userId: review.userId ? review.userId._id.toString() : null, // ensure string id
      name: review.userId ? review.userId.name : "Unknown User",
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt
    }));

    res.json(formattedReviews);
  } catch (err) {
    console.error("Error fetching reviews:", err);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});


module.exports = router;