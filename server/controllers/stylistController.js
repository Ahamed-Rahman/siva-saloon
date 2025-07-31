import Stylist from '../models/Stylist.js';
import bcrypt from 'bcryptjs';

export const getAllStylists = async (req, res) => {
  try {
    const stylists = await Stylist.find();
    res.json(stylists);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch stylists' });
  }
};



export const createStylist = async (req, res) => {
  try {
    const { password, email } = req.body;

    const existing = await Stylist.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const stylist = new Stylist({ ...req.body, password: hashed });
    await stylist.save();

    res.status(201).json({ message: 'Stylist created' });
  } catch (err) {
    res.status(500).json({ message: 'Stylist creation failed' });
  }
};

export const deleteStylist = async (req, res) => {
  try {
    const { id } = req.params;
    await Stylist.findByIdAndDelete(id);
    res.json({ message: 'Stylist deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete stylist' });
  }
};
