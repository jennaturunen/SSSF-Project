import { gql } from 'apollo-server-express';

export default gql`
  type Post {
    id: ID
    manufacturer: Manufacturer
    package_name: String
    description: String
    hashtags: [String]
    location_as_string: String
    added_by: User
  }
  extend type Query {
    posts: [Post]
    post(id: ID!): Post
  }
  extend type Mutation {
    addPost(
      manufacturer: ID
      package_name: String
      description: String
      hashtags: [String]
      location_as_string: String
      added_by: ID!
    ): Post
  }
`;
