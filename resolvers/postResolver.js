import Post from '../models/post.js';
import { AuthenticationError } from 'apollo-server-express';

export default {
  Query: {
    posts: async (parent, args, { user }) => {
      if (!user) throw new AuthenticationError('You are not authenticated');
      try {
        return await Post.find();
      } catch (e) {
        console.log(`Error while fetching all posts ${e.message}`);
      }
      return Post.find();
    },
    post: async (parent, args, { user }) => {
      if (!user) throw new AuthenticationError('You are not authenticated');
      try {
        return await Post.findById({ _id: args.id }).exec();
      } catch (e) {
        console.log(`Error while fetching post ${e.message}`);
      }
    },
  },
  Mutation: {
    addPost: async (parent, args, { user }) => {
      if (!user) throw new AuthenticationError('You are not authenticated');
      try {
        args.added_by = user.id;
        console.log('uudet argit', args);
        const newPost = new Post(args);
        return await newPost.save();
      } catch (e) {
        console.log(`Error occurred while adding new post ${e.message}`);
      }
    },
  },
};
