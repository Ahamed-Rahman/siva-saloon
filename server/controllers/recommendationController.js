// GET /api/users/:userId/smart-time-slots

import Booking from '../models/Booking.js';

export const getSmartTimeSlots = async (req, res) => {
  const { userId } = req.params;

  try {
    const bookings = await Booking.find({ userId });

    const timeFrequency = {};

    bookings.forEach(b => {
      if (!timeFrequency[b.startTime]) timeFrequency[b.startTime] = 0;
      timeFrequency[b.startTime]++;
    });

    // Sort by frequency
    const sorted = Object.entries(timeFrequency)
      .sort((a, b) => b[1] - a[1]) // most used time first
      .slice(0, 3); // top 3

    const recommendedSlots = sorted.map(s => s[0]); // ['09:00', '14:30', ...]

    res.json({ recommendedSlots });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch time recommendations' });
  }
};
