import Manufacturer from '../models/manufacturer.js';

export default {
  Query: {
    manufacturer: async (parent, args, { user }) => {
      if (!user) {
        throw new AuthenticationError('You are not authenticated');
      }
      return await Manufacturer.findById({ _id: args.id }).exec();
    },
    manufacturers: async (parent, args, { user }) => {
      if (!user) {
        throw new AuthenticationError('You are not authenticated');
      }
      return await Manufacturer.find();
    },
  },
  Mutation: {
    addManufacturer: async (parent, args) => {
      try {
        const newManufacturer = new Manufacturer(args);
        const result = await newManufacturer.save();
        return result;
      } catch (e) {
        console.log(`Error occured while adding new manufacturer ${e.message}`);
      }
    },
  },
  // Post: {
  //   Manufacturer: (parent, args) => {
  //     return Manufacturer.findById(parent.manufacturer);
  //   },
  // },
};
