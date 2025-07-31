import mongoose from 'mongoose';

const stylistSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  description: String,
  image: String,
  specialization: [String],
});

export default mongoose.model('Stylist', stylistSchema);
