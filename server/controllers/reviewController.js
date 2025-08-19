import Review from '../models/Review.js';
import Booking from '../models/Booking.js';

export const createReview = async (req, res) => {
  try {
    const { bookingId, rating, comment } = req.body;
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    const existing = await Review.findOne({ bookingId });
    if (existing) return res.status(400).json({ message: 'Already reviewed' });

    const review = new Review({
      bookingId,
      userId: booking.userId,
      stylistId: booking.stylistId,
      rating,
      comment,
    });
    await review.save();

    booking.feedbackGiven = true;
    await booking.save();

    res.status(201).json({ message: 'Review submitted', review });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error submitting review', error: err.message });
  }
};

export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find({})
      .populate('userId', 'fullName name') // either field
      .populate({
        path: 'bookingId',
        select: 'serviceId createdAt',
        populate: { path: 'serviceId', select: 'name' }
      })
      .sort({ createdAt: -1 })
      .lean(); // return plain objects

    const out = reviews.map((r) => {
      const userName =
        (r.userId && (r.userId.fullName || r.userId.name)) || 'Unknown user';

      const serviceName =
        (r.bookingId && r.bookingId.serviceId && r.bookingId.serviceId.name) || 'N/A';

      return {
        _id: r._id,
        userFullName: userName,
        serviceName,
        createdAt: r.createdAt,
        rating: r.rating,
        comment: r.comment,
      };
    });

    return res.json(out);
  } catch (err) {
    console.error('❌ Error fetching reviews:', err?.message, err?.stack);
    return res.status(500).json({ message: 'Failed to fetch reviews' });
  }
};
