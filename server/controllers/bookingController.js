import Booking from '../models/Booking.js';
import Service from '../models/Service.js';
import User from '../models/User.js';
import moment from 'moment';

// ✅ Get unavailable time slots for a stylist on a specific date

export const getUnavailableTimes = async (req, res) => {
  const { stylistId, date, serviceId } = req.body;

  try {
    const service = await Service.findById(serviceId);
    if (!service) return res.status(400).json({ message: 'Invalid service ID' });

    const bookings = await Booking.find({ stylistId, date })
      .populate('userId', 'fullName')
      .populate('serviceId', 'name price')
      .sort({ date: 1 });

    const blockedTimes = [];

    bookings.forEach(b => {
      const start = moment(`${b.date} ${b.startTime}`, 'YYYY-MM-DD HH:mm');
      const end = moment(`${b.date} ${b.endTime}`, 'YYYY-MM-DD HH:mm');
      const duration = moment.duration(end.diff(start)).asMinutes();

      for (let m = 0; m < duration; m += 15) {
        const timeStr = start.clone().add(m, 'minutes').format('HH:mm'); // ✅ Correct format
        blockedTimes.push(timeStr);
      }
    });

    console.log('✅ Returning blocked times:', blockedTimes); // ✅ Optional log
    res.json({ unavailableTimes: blockedTimes });
  } catch (err) {
    console.error('❌ Error fetching unavailable times:', err);
    res.status(500).json({ message: 'Failed to fetch unavailable slots' });
  }
};

// ✅ Check for booking time clash
export const checkClash = async (req, res) => {
  const { stylistId, date, time, serviceId } = req.body;

  try {
    const service = await Service.findById(serviceId);
    if (!service) return res.status(400).json({ message: 'Invalid service ID' });

    const selectedStart = moment(`${date} ${time}`, 'YYYY-MM-DD HH:mm');
    const selectedEnd = selectedStart.clone().add(service.durationMax, 'minutes');

    const clashes = await Booking.find({
      stylistId,
      serviceId,
      date,
      $or: [
        { startTime: { $lt: selectedEnd.format('HH:mm') }, endTime: { $gt: selectedStart.format('HH:mm') } }
      ]
    });

    if (clashes.length > 0) {
      return res.status(400).json({ message: 'Time clash, choose another time' });
    }

    res.json({ message: 'Available' });
  } catch (err) {
    console.error('❌ Error checking clash:', err);
    res.status(500).json({ message: 'Error checking time clash' });
  }
};
