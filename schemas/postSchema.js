import { gql } from 'apollo-server-express';

export default gql`
  type Post {
    id: ID
    manufacturer: Manufacturer
    package_name: String
    description: String
    hashtags: String
    location_as_string: String
    added_by: User
    post_file: String!
    post_file_thumb: String!
    post_file_type: String!
    comments: [Comment]
  }
  extend type Query {
    posts(start: Int = 0, manufacturer: ID, keyword: String): [Post]
    post(id: ID!): Post
    postsByUser(id: ID!): [Post]
  }
  extend type Mutation {
    addPost(
      manufacturer: ID
      package_name: String
      description: String
      hashtags: String
      location_as_string: String
      post_file: String!
      post_file_thumb: String!
      post_file_type: String!
    ): Post
    modifyPost(
      id: ID!
      manufacturer: ID
      package_name: String
      description: String
      hashtags: String
      location_as_string: String
    ): Post
    deletePost(id: ID!): ID
  }
`;
