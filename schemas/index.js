import userSchema from './userSchema.js';
//import postSchema from './postSchema.js';
import manufacturerSchema from './manufacturerSchema.js';
import { gql } from 'apollo-server-express';

const linkSchema = gql`
  type Query {
    _: Boolean
  }
  type Mutation {
    _: Boolean
  }
`;

export default [linkSchema, userSchema, manufacturerSchema];
