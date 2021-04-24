import { gql } from 'apollo-server-express';

export default gql`
  type Manufacturer {
    id: ID
    name: String
  }
  extend type Query {
    manufacturer(id: ID!): Manufacturer
    manufacturers: [Manufacturer]
  }
  extend type Mutation {
    addManufacturer(name: String!): Manufacturer
  }
`;
