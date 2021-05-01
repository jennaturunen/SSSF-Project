'use strict';
const addNewComment = async (commentData) => {
  const query = {
    query: `
           mutation Variables($comment: String!, $linked_to_post: ID!){
            addComment(linked_to_post: $linked_to_post, 
              comment: $comment,
              ){
              id
              added_by {
                id
                username
              }
              comment
              linked_to_post {
                id
              }
            }
          }`,
    variables: commentData,
  };

  try {
    const data = await fetchGraphql(query);
    return data.addComment;
  } catch (e) {
    console.log('Can not fetch', e.message);
  }
};

const deleteComment = async (params) => {
  const query = {
    query: `
            mutation Variables($id: ID!) {
              deleteComment(id: $id)
              }
            `,
    variables: params,
  };
  const data = await fetchGraphql(query);
  return data.deleteComment;
};
