const addNewPost = async (postData) => {
  console.log('postData params', postData);
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
    console.log('haettu data', data);
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
            query Variables($start: Int){
              posts(start: $start) {
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
    variables: params,
  };
  const data = await fetchGraphql(query);
  return data.posts;
};
