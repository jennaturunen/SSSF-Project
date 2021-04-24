import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  full_name: { type: String },
  account_type: { type: String, required: true },
});

export default mongoose.model('User', userSchema);
