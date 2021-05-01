import Comment from '../models/comment.js';
import { AuthenticationError } from 'apollo-server-express';

export default {
  Post: {
    comments(parent) {
      console.log(
        'JAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
        parent.description,
        parent._id,
        parent.location_as_string
      );
      try {
        return Comment.find({ linked_to_post: parent._id });
      } catch (e) {
        console.log('Error while fetching comments', e.message);
      }
    },
  },
  Query: {
    comments: async (parent, args, { user }) => {
      console.log('NO TÄÄÄÄÄÄÄÄÄÄÄLLLLLLLresolver', args);
      if (!user) throw new AuthenticationError('You are not authenticated');
      try {
        const queryParams = {};
        if (args.manufacturer) queryParams.manufacturer = args.manufacturer;

        return await Comment.find(queryParams).sort({ _id: -1 }).limit(10);
      } catch (e) {
        console.log(`Error while fetching comments ${e.message}`);
      }
    },
  },
  Mutation: {
    addComment: async (parent, args, { user }) => {
      if (!user) throw new AuthenticationError('You are not authenticated');
      try {
        args.added_by = user.id;
        const newComment = new Comment(args);
        return await newComment.save();
      } catch (e) {
        console.log(`Error occurred while adding new comment ${e.message}`);
      }
    },
    deleteComment: async (parent, args, { user }, info) => {
      try {
        if (!user) throw new AuthenticationError('You are not authenticated');
        const id = args.id;
        await Comment.findByIdAndDelete(id);
        return id;
      } catch (e) {
        console.log(`Error occurred while deleting the comment ${e.message}`);
      }
    },
  },
};
