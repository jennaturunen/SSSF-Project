'use strict';
const loginForm = document.querySelector('#login-form');
const registerForm = document.querySelector('#register-form');
const logOutBtn = document.querySelector('#logout-btn');
const addNewPostForm = document.querySelector('#add-new-post-form');
// const nappi = document.querySelector('#testi');
// const contti = document.querySelector('#tokatesti');

const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif'];

// LOGIN
loginForm.addEventListener('submit', async (evt) => {
  evt.preventDefault();
  const formData = loginForm.elements;
  const fields = {
    username: formData.username.value,
    password: formData.password.value,
  };

  const response = await sendLoginForm(fields);
  if (response.token) {
    // Save token, hide login and show front page
    sessionStorage.setItem('token', response.token);
    $('#login-page').hide();
    $('#main-pages').show();
    loginForm.reset(); // clear forms input-values
  }
});

// SUBMIT REGISTER FORM
registerForm.addEventListener('submit', async (evt) => {
  evt.preventDefault();
  const formData = registerForm.elements;

  if (formData.username.value.length < 3) {
    alert('Username has to have at least 3 characters');
    return false;
  }

  const passwordRegex = new RegExp('(?=.*[A-Z]).{8,}');
  const testResult = passwordRegex.test(formData.password.value);
  if (!testResult) {
    alert('Password has have at least one uppercase and 8 characters');
    return false;
  }

  if (formData.password.value !== formData.password_second.value) {
    alert('Passwords do not match');
    return false;
  }

  if (!formData.personal.checked && !formData.company.checked) {
    alert('Choose the account type');
    return false;
  }

  if (formData.personal.checked && formData.company.checked) {
    alert('Only one account type is allowed to select');
    return false;
  }

  const accountType = formData.personal.checked ? 'Personal' : 'Company';

  const fields = {
    username: formData.username.value,
    password: formData.password.value,
    password_second: formData.password_second.value,
    full_name: formData.full_name.value,
    account_type: accountType,
  };

  // Create new user and login automatically
  const registerUser = await sendRegisterForm(fields);
  if (registerUser.token) {
    // Save token, hide login and show front page
    sessionStorage.setItem('token', registerUser.token);
    $('#login-page').hide();
    $('#main-pages').show();
    registerForm.reset(); // Clear forms input-values
  } else {
    console.log('Register failed');
  }
});

// LOGOUT
logOutBtn.addEventListener('click', async (evt) => {
  const response = await logoutUser();
  sessionStorage.removeItem('token');
  $('#main-pages').hide();
  $('#login-page').show();
});

// ADD NEW POST FORM
addNewPostForm.addEventListener('submit', async (evt) => {
  evt.preventDefault();
  const formData = addNewPostForm.elements;
  if (!formData.post_file.value) return false;

  const fields = {
    description: formData.description.value,
    manufacturer: formData.manufacturer.value,
    package_name: formData.package_name.value,
    location_as_string: formData.location_as_string.value,
    hashtags: formData.hashtags.value,
  };

  const file = JSON.parse(formData.post_file.value);
  console.log('file', file);
  if (file !== null && imageMimeTypes.includes(file.type)) {
    fields.post_file = file.data[1].data;
    fields.post_file_thumb = file.data[2].data;
    fields.post_file_type = file.type;
    console.log('fields', fields);
    const response = await addNewPost(fields);
    console.log('vika resp', response);
  } else {
    alert('File is not acceptable');
  }
});

// nappi.addEventListener('click', async (evt) => {
//   const params = {
//     id: '60846d72bbdbab26003cbf8e',
//   };
//   const post = await getPost(params);
//   console.log('post', post);
//   if (post) {
//     const image = `<div><img src="data:${post.post_file_type};base64,${post.post_file}" /></div>`;
//     contti.innerHTML += image;
//   }
// });
