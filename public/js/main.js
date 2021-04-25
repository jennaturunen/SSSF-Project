'use strict';
const loginForm = document.querySelector('#login-form');
const registerForm = document.querySelector('#register-form');
const logOutBtn = document.querySelector('#logout-btn');
const addNewPostForm = document.querySelector('#add-new-post-form');
const personalAccountPosts = document.querySelector('#personal-account-posts');

const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif'];

// SEND LOGIN FORM
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
    getPersonalPosts();
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
    getPersonalPosts();
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
  if (!formData.post_file.value) {
    alert('Insert file first');
    return false;
  }

  const manufacturer =
    formData.manufacturer.value.length > 0 ? formData.manufacturer.value : null;

  const fields = {
    description: formData.description.value,
    manufacturer: manufacturer,
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
    alert('File is not acceptable, only images');
  }
});

// GET MAIN/PERSONAL POSTS
const getPersonalPosts = async () => {
  const posts = await getPosts();
  console.log('postit', posts);

  for (const post of posts) {
    const manufacturer = post.manufacturer ? post.manufacturer.name + ',' : '';

    const cardColumn = document.createElement('div');
    cardColumn.classList.add('col');
    const cardContainer = document.createElement('div');
    cardContainer.classList.add('card');
    cardContainer.classList.add('h-100');

    const img = document.createElement('img');
    img.src = `data:${post.post_file_type};base64,${post.post_file_thumb}`;
    img.alt = post.description;
    img.classList.add('card-img-top');

    // open larger image when clicking image, show description and tags
    img.addEventListener('click', () => {
      console.log('klick', post);
      openCardModal();

      const bigCard = `
                      <div class="col card h-100">
                        <div class="big-img" style="background-image: url(data:${post.post_file_type};base64,${post.post_file})"></div>
                        <div class="card-body">
                          <div class="vertical-flex-container">
                            <span class="card-username">${post.added_by.username}</span>
                            <span class="card-package-name">${post.location_as_string}</span>
                          </div>
                          <div class="vertical-flex-container">
                            <span class="card-manufacturer">${manufacturer}</span>
                            <span class="card-package-name">${post.package_name}</span>
                          </div>
                          <p>${post.description}</p>
                          <p class="card-hashtags">${post.hashtags}</p>
                        </div>
                      </div>`;

      const modalContent = document.querySelector('#modal-content');
      modalContent.innerHTML = bigCard;
    });

    cardContainer.appendChild(img);

    const descriptionDiv = document.createElement('div');
    descriptionDiv.classList.add('card-body');

    const descriptionSection = `
                                <p class="card-username">${post.added_by.username}</p>
                                <div class="vertical-flex-container">
                                  <span class="card-manufacturer">${manufacturer}</span>
                                  <span class="card-package-name">${post.package_name}</span>
                                </div>
                                <p class="card-hashtags">${post.hashtags}</p>
                              `;

    descriptionDiv.innerHTML += descriptionSection;

    cardContainer.appendChild(descriptionDiv);
    cardColumn.appendChild(cardContainer);
    personalAccountPosts.appendChild(cardColumn);
  }
};

// WHEN UPDATING THE PAGE -> CHECK THE TOKEN AND STAY IN FRONT-PAGE
if (sessionStorage.getItem('token')) {
  $('#main-pages').show();
  $('#login-page').hide();
  $('#main-feed-btn').click();
  getPersonalPosts();
}
