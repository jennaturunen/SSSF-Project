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
  post_file: {
    type: String,
    required: true,
  },
  post_file_type: {
    type: String,
    required: true,
  },
});

export default mongoose.model('Post', postSchema);
