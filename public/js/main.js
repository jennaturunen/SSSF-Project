'use strict';
const loginForm = document.querySelector('#login-form');
const registerForm = document.querySelector('#register-form');

// LOGIN
loginForm.addEventListener('submit', async (evt) => {
  evt.preventDefault();
  const formData = loginForm.elements;
  console.log('formData', formData);

  // Hide login and show front page
  $('#login-page').hide();
  $('#main-pages').show();
  loginForm.reset(); // clear forms input-values
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
