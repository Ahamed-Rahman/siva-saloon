import Booking from '../models/Booking.js';
import Service from '../models/Service.js';


export const getStylistBookings = async (req, res) => {
  try {
    const { id } = req.params;

      const bookings = await Booking.find({ stylistId: id })
      .populate('userId', 'fullName')
      .populate('serviceId', 'name price')
      .sort({ date: 1 })
    .lean();

    // 2) reformat each one’s date as YYYY-MM-DD in local timezone
   const formatted = bookings.map(b => ({
      ...b,
      date: new Date(b.date).toLocaleDateString('en-CA')
    }));

    res.json(formatted);
   } catch (err) {
     res.status(500).json({ message: 'Failed to fetch stylist bookings' });
   }
 };

export const markBookingCompleted = async (req, res) => {
  const { id } = req.params; // booking ID from URL

  try {
    // Step 1: Find the booking
    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Step 2: Update status
    booking.status = 'Completed';
    await booking.save();

    // Step 3: Respond with success
    res.json({ message: 'Booking marked as completed', booking });
  } catch (err) {
    console.error('❌ Booking update failed:', err.message);
    res.status(500).json({ message: 'Update failed' });
  }
};
