import { gql } from 'apollo-server-express';

export default gql`
  type User {
    id: ID
    username: String
    full_name: String
    account_type: String
    token: String
    location: Location
    description: String
  }
  type Location {
    type: String
    coordinates: [Float]
  }
  input NewLocation {
    coordinates: [Float]
  }
  extend type Query {
    user(id: ID): User
    login(username: String!, password: String!): User
    checkUsername(username: String!): User
    logout: User
    usersWithLocation(description: String, username: String): [User]
  }
  extend type Mutation {
    registerUser(
      username: String!
      password: String!
      password_second: String!
      full_name: String
      account_type: String!
    ): User
    modifyUser(
      id: ID
      full_name: String
      location: NewLocation
      description: String
    ): User
  }
`;
