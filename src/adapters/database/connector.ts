import mongoose from 'mongoose';

export default function () {
  return mongoose.connect('mongodb://root:root@localhost:27017/');
}
