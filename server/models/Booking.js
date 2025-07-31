// server/models/Booking.js
import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  stylistId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Stylist',
    required: true,
  },
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true, // ✅ Required for accurate revenue tracking
  },
  sessionId: {
    type: String,
    unique: true,
    required: true, // ✅ Required to prevent duplicate Stripe bookings
  },
  status: {
    type: String,
    enum: ['Pending', 'Completed'],
    default: 'Pending',
  },
});

export default mongoose.model('Booking', bookingSchema);
