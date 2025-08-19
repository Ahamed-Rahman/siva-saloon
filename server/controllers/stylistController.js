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

// Update existing stylist
export const updateStylist = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // If password field is non-empty, hash it; otherwise remove it to keep current password
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    } else {
      delete updateData.password;
    }

    const updated = await Stylist.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) return res.status(404).json({ message: 'Stylist not found' });

    res.json({ message: 'Stylist updated', stylist: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update stylist' });
  }
};
