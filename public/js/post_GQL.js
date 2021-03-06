'use strict';

const addNewPost = async (postData) => {
  const query = {
    query: `
           mutation VariableTest($manufacturer: ID, $package_name: String, $description: String, $location_as_string: String, $hashtags: String, $post_file: String!, $post_file_thumb: String!, $post_file_type: String!) {  
            addPost(
                manufacturer: $manufacturer,
                package_name: $package_name,
                description: $description,
                location_as_string: $location_as_string,
                hashtags: $hashtags,
                post_file: $post_file,
                post_file_thumb: $post_file_thumb,
                post_file_type: $post_file_type,
              ){
                id
                manufacturer {
                  id 
                  name
                }
                package_name
                description
                hashtags
                location_as_string
                added_by {
                  id
                  username
                  full_name
                  account_type
                }
                post_file
                post_file_thumb
                post_file_type
              }
            }`,
    variables: postData,
  };

  try {
    const data = await fetchGraphql(query);
    return data.addPost;
  } catch (e) {
    console.log('Can not fetch', e.message);
  }
};

const getPost = async (params) => {
  const query = {
    query: `
            query Variables($id: ID!){
              post(id: $id) {
                id
                manufacturer {
                  id 
                  name
                }
                package_name
                description
                hashtags
                location_as_string
                added_by {
                  id
                  username
                  full_name
                  account_type
                }
                post_file
                post_file_thumb
                post_file_type
                comments {
                  id
                  comment
                  added_by {
                    id
                    username
                  }
                }
              }
            }`,
    variables: params,
  };
  const data = await fetchGraphql(query);
  return data.post;
};

const getPosts = async (params) => {
  const query = {
    query: `
            query Variables($start: Int, $manufacturer: ID, $keyword: String){
              posts(start: $start, manufacturer: $manufacturer, keyword: $keyword) {
                id
                manufacturer {
                  id 
                  name
                }
                package_name
                description
                hashtags
                location_as_string
                added_by {
                  id
                  username
                  full_name
                  account_type
                }
                post_file
                post_file_thumb
                post_file_type
                comments {
                  id
                  comment
                  added_by {
                    id
                    username
                  }
                }
              }
            }`,
    variables: params,
  };
  const data = await fetchGraphql(query);
  return data.posts;
};

const getManufacturers = async () => {
  const query = {
    query: `
            query {
              manufacturers {
                id
                name
              }
            }`,
  };
  const data = await fetchGraphql(query);
  return data.manufacturers;
};

const getUsersPosts = async (params) => {
  const query = {
    query: `
            query Variables($id: ID!){
              postsByUser(id: $id) {
                id
                manufacturer {
                  id
                  name
                }
                package_name
                description
                hashtags
                location_as_string
                post_file
                post_file_thumb
                post_file_type
                added_by {
                  id
                  username
                  account_type
                }
              }
            }
            `,
    variables: params,
  };
  const data = await fetchGraphql(query);
  return data.postsByUser;
};

const deletePost = async (params) => {
  const query = {
    query: `
            mutation Variables($id: ID!) {
              deletePost(id: $id)
              }
            `,
    variables: params,
  };
  const data = await fetchGraphql(query);
  return data.deletePost;
};

const updatePost = async (params) => {
  const query = {
    query: `
            mutation Variables($id: ID!, $manufacturer: ID, $package_name: String, $description: String, $hashtags: String, $location_as_string: String){
              modifyPost(    
                id: $id,
                  manufacturer: $manufacturer, 
                  package_name: $package_name,
                  description: $description,
                  location_as_string: $location_as_string,
                  hashtags: $hashtags
              )
              {
                  id
                  manufacturer {
                    id
                    name
                  }
                  package_name
                  description
                  location_as_string
                  hashtags
                }
              }
            `,
    variables: params,
  };
  const data = await fetchGraphql(query);
  return data.modifyPost;
};
