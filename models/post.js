import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const postSchema = new Schema({
  manufacturer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Manufacturer',
  },
  package_name: String,
  description: String,
  hashtags: String,
  location_as_string: String,
  added_by: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
});

export default mongoose.model('Post', postSchema);
