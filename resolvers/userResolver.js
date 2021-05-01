import { AuthenticationError, UserInputError } from 'apollo-server-errors';
import User from '../models/user.js';
import { login, logout } from '../passport/authenticate.js';
import bcrypt from 'bcrypt';

export default {
  Query: {
    login: async (parent, args, { req, res }) => {
      try {
        // Inject args to request body for passport
        req.body = args;

        const authResponse = await login(req, res);

        return {
          id: authResponse.user._id,
          username: authResponse.user.username,
          account_type: authResponse.user.account_type,
          token: authResponse.token,
        };
      } catch (e) {
        throw new AuthenticationError('Invalid credentials');
      }
    },
    user: async (parent, args, { user }) => {
      if (!user) {
        throw new AuthenticationError('You are not authenticated');
      }
      const id = args.id ? args.id : user.id;
      return await User.findById({ _id: id }).exec();
    },
    checkUsername: async (parent, args) => {
      return await User.findOne({ username: args.username });
    },
    logout: async (parent, args, { req, res }) => {
      try {
        return logout(req, res);
      } catch (e) {
        throw new AuthenticationError('Logout failed');
      }
    },
  },
  Mutation: {
    registerUser: async (parent, args, { req, res }) => {
      try {
        const availableUsername = await User.findOne({
          username: args.username,
        });

        if (availableUsername && availableUsername.id) {
          throw new UserInputError(`Username is already taken`);
        }

        const passwordRegex = new RegExp('(?=.*[A-Z]).{8,}');
        const testResult = passwordRegex.test(args.password);
        if (!testResult) {
          throw new UserInputError(
            `Weak password, at least 8 characters and one uppercase letter`
          );
        } else if (args.password !== args.password_second) {
          throw new UserInputError(`Password do not match`);
        } else if (args.username.length < 3) {
          throw new UserInputError(`Username has have at least 3 characters`);
        } else if (
          args.account_type !== 'Personal' &&
          args.account_type !== 'Company'
        ) {
          throw new UserInputError(`Account type is not valid`);
        }

        delete args.password_second;
        const hash = await bcrypt.hash(args.password, 12);
        const userWithHash = {
          ...args,
          password: hash,
        };

        const newUser = new User(userWithHash);
        return await newUser.save();
      } catch (e) {
        console.log(`Error occurred while registering new user ${e.message}`);
      }
    },
    modifyUser: async (parents, args, { user }, info) => {
      try {
        if (!user) {
          throw new AuthenticationError('You are not authenticated');
        }

        const id = args.id ? args.id : user._id;
        console.log('upp', args);
        const userData = { ...args };
        const updatedUser = await User.findByIdAndUpdate(id, userData, {
          new: true,
        });

        return updatedUser.save();
      } catch (e) {
        console.log(`Error occured while updating the user ${e.message}`);
      }
    },
  },
  Post: {
    added_by: (parent, args) => {
      try {
        return User.findById(parent.added_by);
      } catch (e) {
        console.log('Error while fetching the added_by user', e.message);
      }
    },
  },
  Comment: {
    added_by: (parent, args) => {
      try {
        return User.findById(parent.added_by);
      } catch (e) {
        console.log('Error while fetching the added_by user', e.message);
      }
    },
  },
};
