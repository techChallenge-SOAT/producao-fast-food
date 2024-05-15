import mongoose from 'mongoose';

export default function () {
  const MONGO_URI = process.env.MONGO_URI;
  if (!MONGO_URI) {
    throw new Error('MONGO_URI not found');
  }
  return mongoose.connect(MONGO_URI);
}
