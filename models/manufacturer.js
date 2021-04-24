import mongoose from 'mongoose';

const manufacturerSchema = new mongoose.Schema({
  name: String,
});

export default mongoose.model('Manufacturer', manufacturerSchema);
