'use strict';
const loginForm = document.querySelector('#login-form');
const registerForm = document.querySelector('#register-form');
const logOutBtn = document.querySelector('#logout-btn');
const addNewPostForm = document.querySelector('#add-new-post-form');
const personalAccountPosts = document.querySelector('#personal-account-posts');
const nextPersonalPostsBtn = document.querySelector('#next-personal-posts-btn');
const modifyUserForm = document.querySelector('#modify-user-info');
const userPostsContainer = document.querySelector('#own-posts');
const manufacturerFilterInput = document.querySelector(
  '#search-by-manufacturer'
);
const hashtagsFilterInput = document.querySelector('#search-by-keywords');
const addCommentForm = document.querySelector('#add-comment-form');
const setCompanyLocationBtn = document.querySelector(
  '#set-company-location-btn'
);
const companyNameFilterInput = document.querySelector('#search-by-company');
const companyDescriptionFilterInput = document.querySelector(
  '#search-by-company-description'
);

const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif'];
let allManufacturers = [];

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
    sessionStorage.setItem('personal_start', 0);
    fetchManufacturersToSelect();
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
    sessionStorage.setItem('personal_start', 0);
    fetchManufacturersToSelect();
  } else {
    console.log('Register failed');
  }
});

// LOGOUT
logOutBtn.addEventListener('click', async (evt) => {
  const response = await logoutUser();
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('personal_start');
  $('#main-pages').hide();
  $('#login-page').show();
  window.location.reload();
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
  if (file !== null && imageMimeTypes.includes(file.type)) {
    fields.post_file = file.data[1].data;
    fields.post_file_thumb = file.data[2].data;
    fields.post_file_type = file.type;
    const response = await addNewPost(fields);

    addPostToMainFeed(response, true);
    if (userPostsContainer.hasChildNodes()) {
      showUsersOwnPosts(response, true);
    }
  } else {
    alert('File is not acceptable, only images');
  }
});

// CREATE CARDS/POSTS FOR MAIN FEED
const addPostToMainFeed = (post, addNewPost = null) => {
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
  img.addEventListener('click', async () => {
    const fetchedPost = await getPost({ id: post.id });
    openCardModal();
    let comments = '';

    for (const comment of fetchedPost.comments) {
      comments += `<div>
                    <span class="card-username">${comment.added_by.username}:</span>  
                    <span class="card-package-name">${comment.comment}</span>
                  </div>`;
    }

    const bigCard = `
                      <div class="col card h-100">
                        <div class="big-img" style="background-image: url(data:${fetchedPost.post_file_type};base64,${fetchedPost.post_file})"></div>
                        <div class="card-body">
                          <div class="vertical-flex-container">
                            <span class="card-username">${fetchedPost.added_by.username}</span>
                            <span class="card-package-name">${fetchedPost.location_as_string}</span>
                          </div>
                          <div class="vertical-flex-container">
                            <span class="card-manufacturer">${manufacturer}</span>
                            <span class="card-package-name">${fetchedPost.package_name}</span>
                          </div>
                          <p>${fetchedPost.description}</p>
                          <p class="card-hashtags">${fetchedPost.hashtags}</p>
                          <div id="comment-header" class="vertical-flex-container space-between">
                            <p class="comments-header">Comments:</p>
                          </div>
                          <div id="comment-section" class="flex-column-container">
                            ${comments}
                          </div>
                        </div>
                      </div>`;

    const modalContent = document.querySelector('#modal-content');
    modalContent.innerHTML = bigCard;

    const commentHeader = document.querySelector('#comment-header');
    const addNewCommentBtn = document.createElement('button');
    addNewCommentBtn.classList.add('submit-button');
    addNewCommentBtn.textContent = 'Add comment';
    addNewCommentBtn.addEventListener('click', () => {
      openCommentModal();
      addCommentForm.elements['linked_to_post'].value = post.id;
    });
    commentHeader.appendChild(addNewCommentBtn);
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
  addNewPost
    ? personalAccountPosts.prepend(cardColumn)
    : personalAccountPosts.appendChild(cardColumn);
};

// GET MAIN POSTS, CLEAR OLD POSTS BEFORE ADDING NEW ONES
const getPersonalPosts = async (start = 0, loadMore = false) => {
  // Check filter values
  const manufacturerValue = manufacturerFilterInput.value;
  const hashtagValue =
    hashtagsFilterInput.value.length < 3 ? '' : hashtagsFilterInput.value;

  const params = {
    start: start,
    manufacturer: manufacturerValue,
    keyword: hashtagValue,
  };

  const posts = await getPosts(params);
  if (!loadMore) personalAccountPosts.innerHTML = '';

  for (const post of posts) {
    addPostToMainFeed(post);
  }
};

// PAGINATION FOR PERSONAL POSTS-FEED
nextPersonalPostsBtn.addEventListener('click', async () => {
  const start = parseInt(sessionStorage.getItem('personal_start'));
  getPersonalPosts(start + 6, true);
  sessionStorage.setItem('personal_start', start + 6);
});

// LOAD MANUFACTURER OPTIONS TO ADD POST-SELECT AND FILTER-SELECT
const fetchManufacturersToSelect = async () => {
  if (allManufacturers.length === 0) {
    allManufacturers = await getManufacturers();
  }

  if (allManufacturers && allManufacturers.length > 0) {
    const empty = new Option('', '');
    manufacturerFilterInput.options.add(empty);

    for (const mf of allManufacturers) {
      const manufacturer = new Option(mf.name, mf.id);
      manufacturerFilterInput.options.add(manufacturer);
    }
  }
};

// UPDATE CURRENT USERS INFO
modifyUserForm.addEventListener('submit', async (evt) => {
  evt.preventDefault();

  const formData = modifyUserForm.elements;
  const fields = {
    full_name: formData.full_name.value,
    description: formData.description.value,
  };
  const newUserData = await modifyUserData(fields);
  if (newUserData) {
    console.log('User updated');
  }
});

// GET CURRENT USERS INFO
const getUserDataAndPosts = async () => {
  const currentUserData = await getUserData();

  if (currentUserData.account_type === 'Company') {
    $('#set-company-location-btn').show();
    $('#company-user-map').css('opacity', '1');
  }

  // Set form values
  const modifyUserForm = document.querySelector('#modify-user-info');
  modifyUserForm.elements['full_name'].value = currentUserData.full_name;
  modifyUserForm.elements['description'].value = currentUserData.description;
  modifyUserForm.elements['account_type'].value = currentUserData.account_type;

  // Show current location, center map to marker
  if (currentUserData.location.coordinates.length > 0) {
    if (companyLocation.length === 0) {
      companyLocation = new L.Marker([
        currentUserData.location.coordinates[1],
        currentUserData.location.coordinates[0],
      ]).addTo(usersMap);
    } else {
      companyLocation.setLatLng([
        currentUserData.location.coordinates[1],
        currentUserData.location.coordinates[0],
      ]);
    }
    usersMap.setView(
      [
        currentUserData.location.coordinates[1],
        currentUserData.location.coordinates[0],
      ],
      10
    );
  }

  // Get posts and create cards for each
  const usersPosts = await getUsersPosts({ id: currentUserData.id });
  console.log(usersPosts);

  for (const post of usersPosts) {
    showUsersOwnPosts(post);
  }
};

// CREATE CARDS FOR USERS OWN POSTS
const showUsersOwnPosts = (post, addedNewPost = null) => {
  const cardColumn = document.createElement('div');
  cardColumn.classList.add('col');

  const imgContainer = document.createElement('div');
  imgContainer.innerHTML = `<div class="small-posts" style="background-image: url(data:${post.post_file_type};base64,${post.post_file})"></div>`;
  cardColumn.append(imgContainer);

  const btnContainer = document.createElement('div');
  btnContainer.classList.add(
    'vertical-flex-container',
    'space-evenly',
    'top-margin'
  );

  const modifyButton = document.createElement('button');
  modifyButton.innerHTML = 'Modify';
  modifyButton.classList.add('submit-button');
  modifyButton.addEventListener('click', () => {
    openModifyPostForm(post.id);
  });

  const deleteButton = document.createElement('button');
  deleteButton.innerHTML = 'Delete';
  deleteButton.classList.add('submit-button', 'delete-button');
  deleteButton.addEventListener('click', () => {
    deleteUsersPost(post, cardColumn);
  });

  btnContainer.appendChild(modifyButton);
  btnContainer.appendChild(deleteButton);
  cardColumn.appendChild(btnContainer);
  addedNewPost
    ? userPostsContainer.prepend(cardColumn)
    : userPostsContainer.appendChild(cardColumn);
};

// OPEN MODIFY POST FORM WITH POST VALUES FILLED
const openModifyPostForm = async (id) => {
  const post = await getPost({ id: id });
  openCardModal();

  const modifyForm = `<form id="update-post-form" class="flex-column-container top-margin custom-form">
                        <h4 class="top-margin">Modify Post</h4>
                        <input type="text"name="description" placeholder="Write Description" value="${post.description}"/>
                        <input type="text"name="package_name" placeholder="Package name and details" value="${post.package_name}"/>
                        <input type="text"name="hashtags" placeholder="Hashtags and keywords" value="${post.hashtags}"/>
                        <input type="text"name="location_as_string" placeholder="Location (Region, Postcode...)" value="${post.location_as_string}"/>
                        <div id="posts-comments-section"></div>
                        <button type="submit" class="submit-button top-margin">Update Post</button>
                      </form>
                    `;
  const modalContent = document.querySelector('#modal-content');
  modalContent.innerHTML = modifyForm;

  const commentSection = document.querySelector('#posts-comments-section');
  // Show all comments and allow user to delete comments
  for (const comment of post.comments) {
    const commentContainer = document.createElement('div');
    commentContainer.innerHTML += `<span class="card-username">${comment.added_by.username}:</span>
                                    <span class="card-package-name">${comment.comment}</span>`;
    const deleteCommentBtn = document.createElement('button');
    deleteCommentBtn.textContent = 'Delete';
    deleteCommentBtn.classList.add(
      'submit-button',
      'delete-button',
      'left-margin'
    );
    deleteCommentBtn.addEventListener('click', async (evt) => {
      evt.preventDefault();
      const deletedComment = await deleteComment({ id: comment.id });
      if (deletedComment) commentContainer.remove();
    });
    commentContainer.appendChild(deleteCommentBtn);
    commentSection.appendChild(commentContainer);
  }

  const updatePostForm = document.querySelector('#update-post-form');
  updatePostForm.addEventListener('submit', async (evt) => {
    evt.preventDefault();
    const formData = updatePostForm.elements;
    const fields = {
      id: post.id,
      description: formData.description.value,
      package_name: formData.package_name.value,
      location_as_string: formData.location_as_string.value,
      hashtags: formData.hashtags.value,
    };

    const updatedPost = await updatePost(fields);
    if (updatedPost) {
      $('#card-modal').hide();
    }
  });
};

// DELETE POST AND REMOVE FROM DOM
const deleteUsersPost = async (post, card) => {
  const deletedPost = await deletePost({ id: post.id });
  if (deletedPost) {
    card.remove();
  }
};

// FILTER POSTS BY MANUFACTURER
manufacturerFilterInput.addEventListener('change', async (evt) => {
  getPersonalPosts();
});

// FILTER BY HASHTAGS
hashtagsFilterInput.addEventListener('input', (evt) => {
  getPersonalPosts();
});

// ADD NEW COMMENT
addCommentForm.addEventListener('submit', async (evt) => {
  evt.preventDefault();
  const formData = addCommentForm.elements;
  if (!formData.comment.value && !formData.linked_to_post.value) return false;

  const fields = {
    comment: formData.comment.value,
    linked_to_post: formData.linked_to_post.value,
  };

  const response = await addNewComment(fields);
  if (response) {
    $('#comment-modal').hide();
    addCommentForm.reset();
    // Show added comment in the comment list
    const newComment = `<div>
    <span class="card-username">${response.added_by.username}:</span>  
    <span class="card-package-name">${response.comment}</span>
    </div>`;

    const commentSection = document.querySelector('#comment-section');
    commentSection.innerHTML += newComment;
  }
});

// SET NEW LOCATION FOR COMPANY ACCOUNT
setCompanyLocationBtn.addEventListener('click', async (evt) => {
  const newLocation = companyLocation.getLatLng();
  const fields = {
    location: {
      coordinates: [newLocation.lng, newLocation.lat],
    },
  };
  const newLocationData = await modifyUserData(fields);
  if (newLocationData) {
    console.log('New location', newLocationData);
  }
});

// FILTER COMPANIES BY USERNAME
companyNameFilterInput.addEventListener('input', async (evt) => {
  showCompanyMarkers();
});

companyDescriptionFilterInput.addEventListener('input', async (evt) => {
  showCompanyMarkers();
});

// CREATE MARKERS TO THE MAIN ENTREPRENEURS MAP
const showCompanyMarkers = async () => {
  // Clear old markers
  layerGroup.clearLayers();
  allMarkers = [];

  // Check filter values
  const username =
    companyNameFilterInput.value.length < 3 ? '' : companyNameFilterInput.value;
  const description =
    companyDescriptionFilterInput.value.length < 3
      ? ''
      : companyDescriptionFilterInput.value;

  const params = {
    username,
    description,
  };

  const allCompanies = await loadCompaniesWithLocation(params);

  // Create markers, set zoom to show them all
  const bounds = new L.LatLngBounds();
  for (const comp of allCompanies) {
    const marker = new L.Marker([
      comp.location.coordinates[1],
      comp.location.coordinates[0],
    ]).addTo(layerGroup);

    const popupContent = `<div>
                            <p class="card-username">${comp.username}</p>
                            <p>${comp.description}</p>
                          </div>`;
    marker.bindPopup(popupContent);

    allMarkers.push(marker);
    bounds.extend(marker.getLatLng());
  }

  if (allCompanies.length > 0) mainMap.fitBounds(bounds, { maxZoom: 10 });
};

// WHEN UPDATING THE PAGE -> CHECK THE TOKEN AND STAY IN FRONT-PAGE
if (sessionStorage.getItem('token')) {
  $('#main-pages').show();
  $('#login-page').hide();
  $('#main-feed-btn').click();
  sessionStorage.setItem('personal_start', 0);
  getPersonalPosts();
  fetchManufacturersToSelect();
}
