import { gql } from 'apollo-server-express';

export default gql`
  type Comment {
    id: ID
    comment: String!
    added_by: User
    linked_to_post: Post
  }
  extend type Query {
    comments: [Comment]
  }
  extend type Mutation {
    addComment(comment: String!, linked_to_post: ID!): Comment
    deleteComment(id: ID!): ID
  }
`;
