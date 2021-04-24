'use strict';
const loginForm = document.querySelector('#login-form');
const registerForm = document.querySelector('#register-form');
const addNewPostForm = document.querySelector('#add-new-post-form');

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
  const fields = {
    description: formData.description.value,
    manufacturer: formData.manufacturer.value,
    package_name: formData.package_name.value,
    location_as_string: formData.location_as_string.value,
    hashtags: formData.hashtags.value,
  };
  //const response = await addNewPost(fields);
  console.log('vika resp', response);
});
