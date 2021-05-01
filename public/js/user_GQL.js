'use strict';

const checkUsername = async (username) => {
  const uniqueUsername = {
    query: `
           query Variables($username: String!){
            checkUsername(username: $username) {
              id
              username
              account_type
            }
          }`,
    variables: username,
  };

  const data = await fetchGraphql(uniqueUsername);
  return data.checkUsername;
};

const sendRegisterForm = async (registerFormData) => {
  const query = {
    query: `
            mutation Variables($username: String!, $password: String!, $password_second: String!, $full_name: String, $account_type: String!){
              registerUser(
                username: $username
                password: $password
                password_second: $password_second
                full_name: $full_name
                account_type: $account_type
              )
              {
                id
                username
                full_name
                account_type
              }
            }`,
    variables: registerFormData,
  };
  const data = await fetchGraphql(query);
  if (data.registerUser.id) {
    // User was created successfully -> login automatically
    const loginUser = await sendLoginForm(registerFormData);
    return loginUser;
  }

  return data.registerUser;
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

const logoutUser = async () => {
  const logout = {
    query: `
           query {
            logout {
              id
            }
          }`,
  };

  return await fetchGraphql(logout);
};

const modifyUserData = async (params) => {
  const query = {
    query: `
            mutation Variables($id: ID, $full_name: String, $location: NewLocation){
              modifyUser(    
                id: $id,
                full_name: $full_name,
                location: $location   
                )
                {
                  id
                  username
                  full_name
                  account_type
                  location {
                    coordinates
                  }
                }
              }
            `,
    variables: params,
  };
  const data = await fetchGraphql(query);
  return data.modifyUser;
};

const getUserData = async () => {
  const query = {
    query: `
            query {
              user {
                id
                username
                full_name
                account_type
                location {
                  coordinates
                }
              }
            }
            `,
  };
  const data = await fetchGraphql(query);
  return data.user;
};
