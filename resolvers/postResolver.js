import Post from '../models/post.js';
import { AuthenticationError } from 'apollo-server-express';
import Comment from '../models/comment.js';

export default {
  Query: {
    posts: async (parent, args, { user }) => {
      if (!user) throw new AuthenticationError('You are not authenticated');
      try {
        const start = args.start ? parseInt(args.start) : 0;
        const queryParams = {};
        if (args.manufacturer) queryParams.manufacturer = args.manufacturer;
        const hashtags = args.keyword ? args.keyword : '';

        return await Post.find(queryParams)
          .regex('hashtags', new RegExp(hashtags, 'i'))
          .sort({ _id: -1 })
          .skip(start)
          .limit(6);
      } catch (e) {
        console.log(`Error while fetching all posts ${e.message}`);
      }
    },
    post: async (parent, args, { user }) => {
      if (!user) throw new AuthenticationError('You are not authenticated');
      try {
        return await Post.findById({ _id: args.id }).exec();
      } catch (e) {
        console.log(`Error while fetching post ${e.message}`);
      }
    },
    postsByUser: async (parent, args, { user }) => {
      if (!user) throw new AuthenticationError('You are not authenticated');
      try {
        return await Post.find({ added_by: args.id }).sort({ _id: -1 });
      } catch (e) {
        console.log(`Error while fetching all users posts ${e.message}`);
      }
    },
  },
  Mutation: {
    addPost: async (parent, args, { user }) => {
      if (!user) throw new AuthenticationError('You are not authenticated');
      try {
        args.added_by = user.id;
        const newPost = new Post(args);
        return await newPost.save();
      } catch (e) {
        console.log(`Error occurred while adding new post ${e.message}`);
      }
    },
    modifyPost: async (parents, args, { user }, info) => {
      try {
        if (!user) throw new AuthenticationError('You are not authenticated');

        const postId = args.id;
        const postData = { ...args };

        const updatePost = await Post.findByIdAndUpdate(postId, postData, {
          new: true,
        });

        return updatePost.save();
      } catch (e) {
        console.log(`Error occured while updating the post ${e.message}`);
      }
    },
    deletePost: async (parent, args, { user }, info) => {
      try {
        if (!user) throw new AuthenticationError('You are not authenticated');
        const id = args.id;
        const comments = await Comment.find({ linked_to_post: id });
        if (comments && comments.length > 0) {
          for (const comment of comments) {
            await Comment.findByIdAndDelete(comment._id);
          }
        }

        await Post.findByIdAndDelete(id);
        return id;
      } catch (e) {
        console.log(`Error occured while deleting the post ${e.message}`);
      }
    },
  },
  Comment: {
    linked_to_post(parent) {
      try {
        return Post.findById(parent.linked_to_post);
      } catch (e) {
        console.log('Error while fetching post', e.message);
      }
    },
  },
};
