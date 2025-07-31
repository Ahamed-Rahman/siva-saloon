import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'; // if needed later


export const createFirebaseUser = async (req, res) => {
  const { uid, fullName, email } = req.body;

  try {
    if (!uid || !email || !fullName) {
      console.log('❌ Missing field in request body:', req.body);
      return res.status(400).json({ message: 'Missing required fields' });
    }

    let user = await User.findOne({ uid });
    if (!user) {
      user = new User({ uid, fullName, email });
      await user.save();
    }

    res.status(201).json({ message: 'User saved to DB', user });
  } catch (err) {
    console.error('❌ Failed to save Firebase user:', err.message);
    res.status(500).json({ message: 'Failed to create Firebase user' });
  }
};

export const signup = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ fullName, email, password: hashedPassword });

    await user.save();
    res.status(201).json({ message: 'Signup successful!' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};


export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Email not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

    // Optionally generate JWT token here
    res.json({ message: 'Login successful', user });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
