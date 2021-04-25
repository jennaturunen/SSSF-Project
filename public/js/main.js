'use strict';
const loginForm = document.querySelector('#login-form');
const registerForm = document.querySelector('#register-form');
const addNewPostForm = document.querySelector('#add-new-post-form');
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif'];
const nappi = document.querySelector('#testi');
const contti = document.querySelector('#tokatesti');

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
  console.log('formData', formData);

  // Hide login and show frontpage
  $('#login-page').hide();
  $('#main-pages').show();
  registerForm.reset(); // Clear forms input-values
});

// ADD NEW POST FORM
addNewPostForm.addEventListener('submit', async (evt) => {
  evt.preventDefault();
  const formData = addNewPostForm.elements;
  console.log('formData', formData);
  if (!formData.post_file.value) return false;

  const fields = {
    description: formData.description.value,
    manufacturer: formData.manufacturer.value,
    package_name: formData.package_name.value,
    location_as_string: formData.location_as_string.value,
    hashtags: formData.hashtags.value,
  };

  const file = JSON.parse(formData.post_file.value);
  if (file !== null && imageMimeTypes.includes(file.type)) {
    fields.post_file = file.data;
    fields.post_file_type = file.type;
    console.log('fields', fields);
    const response = await addNewPost(fields);
    console.log('vika resp', response);
  } else {
    alert('File is not acceptable');
  }
});

nappi.addEventListener('click', async (evt) => {
  const params = {
    id: '60846d72bbdbab26003cbf8e',
  };
  const post = await getPost(params);
  console.log('post', post);
  if (post) {
    const image = `<div><img src="data:${post.post_file_type};base64,${post.post_file}" /></div>`;
    contti.innerHTML += image;
  }
});
