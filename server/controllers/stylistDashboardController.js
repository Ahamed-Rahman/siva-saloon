import Booking from '../models/Booking.js';
import Service from '../models/Service.js';


export const getStylistBookings = async (req, res) => {
  try {
    const { id } = req.params;

    const bookings = await Booking.find({ stylistId: id })
      .populate('userId', 'fullName') // ✅ FIXED
      .populate('serviceId', 'name price')
      .sort({ date: 1 });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch stylist bookings' });
  }
};


export const markBookingCompleted = async (req, res) => {
  const { id } = req.params;

  try {
    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    booking.status = 'Completed';
    await booking.save();

    res.json({ message: 'Booking marked as completed' });
  } catch (err) {
    res.status(500).json({ message: 'Update failed' });
  }
};