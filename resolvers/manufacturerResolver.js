import Manufacturer from '../models/manufacturer.js';
import { AuthenticationError } from 'apollo-server-express';

export default {
  Query: {
    manufacturer: async (parent, args, { user }) => {
      if (!user) throw new AuthenticationError('You are not authenticated');
      try {
        return await Manufacturer.findById({ _id: args.id }).exec();
      } catch (e) {
        console.log(`Error occurred while fetching manufacturer ${e.message}`);
      }
    },
    manufacturers: async (parent, args, { user }) => {
      if (!user) throw new AuthenticationError('You are not authenticated');
      try {
        const res = await Manufacturer.find();
        return res;
      } catch (e) {
        console.log(`Error occurred while fetching manufacturers ${e.message}`);
      }
    },
  },
  Mutation: {
    addManufacturer: async (parent, args, { user }) => {
      if (!user) throw new AuthenticationError('You are not authenticated');
      try {
        const newManufacturer = new Manufacturer(args);
        const result = await newManufacturer.save();
        return result;
      } catch (e) {
        console.log(
          `Error occurred while adding new manufacturer ${e.message}`
        );
      }
    },
  },
  Post: {
    manufacturer: (parent, args) => {
      try {
        return Manufacturer.findById(parent.manufacturer);
      } catch (e) {
        console.log('Error while fetching manufacturer for post', e.message);
      }
    },
  },
};
