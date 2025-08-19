import Stylist from '../models/Stylist.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const stylistSignup = async (req, res) => {
  const { name, email, password, ...rest } = req.body;

  try {
    const existing = await Stylist.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const newStylist = new Stylist({ name, email, password: hashed, ...rest });
    await newStylist.save();

    res.status(201).json({ message: 'Stylist registered' });
  } catch (err) {
    res.status(500).json({ message: 'Signup failed' });
  }
};

export const stylistLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const stylist = await Stylist.findOne({ email });
    if (!stylist) return res.status(404).json({ message: 'Stylist not found' });

    const isMatch = await bcrypt.compare(password, stylist.password);
    if (!isMatch) return res.status(400).json({ message: 'Incorrect password' });

    const token = jwt.sign({ id: stylist._id }, 'stylistsecret', { expiresIn: '1d' });

    res.json({ message: 'Login successful', token, stylist });
  } catch (err) {
    res.status(500).json({ message: 'Login failed' });
  }
};

