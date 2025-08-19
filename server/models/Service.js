import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  name: String,
  priceMin: Number,     // e.g., 500
  priceMax: Number,     // e.g., 1000
  durationMin: Number,
  durationMax: Number,
  image: String
});


export default mongoose.model('Service', serviceSchema);
