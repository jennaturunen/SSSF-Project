const fetchGraphql = async (query) => {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Bearer ' + sessionStorage.getItem('token'),
    },
    body: JSON.stringify(query),
  };

  try {
    const response = await fetch('http://localhost:3000/graphql', options);
    console.log('reeee', response);
    const json = await response.json();
    return json.data;
  } catch (e) {
    console.log('fetchgraphql', e.message);
    return false;
  }
};

const sendLoginForm = async (loginData) => {
  const query = {
    query: `
            query Variables($username: String!, $password: String!){
              login(username: $username, password: $password) {
                id
                username
                token
              }
            }`,
    variables: loginData,
  };
  const data = await fetchGraphql(query);
  return data.login;
};

const addNewPost = async (postData) => {
  console.log('postData params', postData);
  const query = {
    query: `
           mutation VariableTest($manufacturer: ID, $package_name: String, $description: String, $location_as_string: String, $hashtags: String, $post_file: String!, $post_file_type: String!) {  
            addPost(
                manufacturer: $manufacturer,
                package_name: $package_name,
                description: $description,
                location_as_string: $location_as_string,
                hashtags: $hashtags,
                post_file: $post_file,
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
                post_file_type
              }
            }`,
    variables: params,
  };
  const data = await fetchGraphql(query);
  return data.post;
};
