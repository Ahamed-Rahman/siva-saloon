import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true }, // Firebase UID
  fullName: String,
  email: { type: String, unique: true },
}, { timestamps: true });

export default mongoose.model('User', userSchema);
