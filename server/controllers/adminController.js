import Admin from '../models/Admin.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Booking from '../models/Booking.js';
import Service from '../models/Service.js';
import Stylist from '../models/Stylist.js';


export const adminSignup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existing = await Admin.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Admin already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const admin = new Admin({ name, email, password: hashed });
    await admin.save();

    res.status(201).json({ message: 'Admin created successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Signup failed' });
  }
};

export const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ message: 'Admin not found' });

    const match = await bcrypt.compare(password, admin.password);
    if (!match) return res.status(400).json({ message: 'Invalid password' });

    const token = jwt.sign({ id: admin._id }, 'adminsecret', { expiresIn: '1d' });

    res.json({ message: 'Login successful', token, admin });
  } catch (err) {
    res.status(500).json({ message: 'Login failed' });
  }
};


export const getTotalRevenue = async (req, res) => {
  try {
    const bookings = await Booking.find().populate('serviceId');

    const total = bookings.reduce((acc, b) => acc + (b.serviceId?.price || 0), 0);

    res.json({ totalRevenue: total });
  } catch (err) {
    res.status(500).json({ message: 'Failed to calculate revenue' });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('userId', 'fullName')
      .populate('stylistId', 'name')
      .populate('serviceId', 'name price')
      .sort({ date: -1 })
      .lean();

    console.log('✅ BOOKINGS SENT TO FRONTEND:', bookings); // Add this line
    res.json(bookings);
  } catch (err) {
    console.error('❌ Booking Fetch Error:', err);
    res.status(500).json({ message: 'Failed to fetch all bookings' });
  }
};



export const getAdminRevenue = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('serviceId', 'price name')
      .sort({ date: 1 });

    let totalRevenue = 0;
    const monthly = {};

    bookings.forEach((b) => {
      let rawPrice = b?.price || b?.serviceId?.priceMax || b?.serviceId?.priceMin || 0;

      // ✅ Normalize: Convert to number regardless of string/number type
      if (typeof rawPrice === 'string') {
        rawPrice = parseFloat(rawPrice.replace(/[^\d.]/g, '')); // Remove 'Rs.', commas, etc.
      }

      const numericPrice = typeof rawPrice === 'number' ? rawPrice : 0;
      totalRevenue += numericPrice;

      const month = b.date?.slice(0, 7); // e.g., "2025-07"
      if (month) {
        monthly[month] = (monthly[month] || 0) + numericPrice;
      }
    });

    res.json({ totalRevenue, monthlyRevenue: monthly });
  } catch (err) {
    console.error('❌ Revenue API Error:', err);
    res.status(500).json({ message: 'Failed to fetch revenue' });
  }
};
