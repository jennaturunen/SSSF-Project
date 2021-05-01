'use strict';
const addNewPostBtn = document.querySelector('#add-new-post-btn');
const addNewPostPage = document.querySelector('#add-new-post-container');
const mainFeedPage = document.querySelector('#main-feed-container');
const mainFeedBtn = document.querySelector('#main-feed-btn');
const entrepreneursFeedBtn = document.querySelector('#entrepreneurs-feed-btn');
const entrepreneursFeedPage = document.querySelector(
  '#entrepreneurs-feed-container'
);
const yourProfileBtn = document.querySelector('#your-profile-btn');
const yourProfilePage = document.querySelector('#your-profile-page');

let mainMap = '';
let usersMap = '';
let companyLocation = '';

const attribution =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

addNewPostBtn.addEventListener('click', () => {
  addNewPostPage.style.display = 'flex';
  hidePageContent([mainFeedPage, entrepreneursFeedPage, yourProfilePage]);
  clearActiveClass();
  addNewPostBtn.classList.toggle('active');

  // Set manufacturer options
  const manufacturerSelect = document.getElementById('manufacturer-select');
  if (manufacturerSelect.options.length === 0) {
    const empty = new Option('', '');
    manufacturerSelect.options.add(empty);

    for (const mf of allManufacturers) {
      const manufacturer = new Option(mf.name, mf.id);
      manufacturerSelect.options.add(manufacturer);
    }
  }
});

mainFeedBtn.addEventListener('click', () => {
  mainFeedPage.style.display = 'flex';
  hidePageContent([addNewPostPage, entrepreneursFeedPage, yourProfilePage]);
  clearActiveClass();
  mainFeedBtn.classList.toggle('active');
});

entrepreneursFeedBtn.addEventListener('click', () => {
  entrepreneursFeedPage.style.display = 'flex';
  hidePageContent([mainFeedPage, addNewPostPage, yourProfilePage]);
  clearActiveClass();
  entrepreneursFeedBtn.classList.toggle('active');

  if (mainMap.length === 0) {
    mainMap = L.map('main-map').setView([60.16, 24.94], 10);

    const tiles = L.tileLayer(tileUrl, { attribution });
    tiles.addTo(mainMap);
  }
});

yourProfileBtn.addEventListener('click', () => {
  yourProfilePage.style.display = 'flex';
  hidePageContent([mainFeedPage, entrepreneursFeedPage, addNewPostPage]);
  clearActiveClass();
  yourProfileBtn.classList.toggle('active');
  // Load posts only once
  if (!userPostsContainer.hasChildNodes()) {
    getUserDataAndPosts();
  }

  if (usersMap.length === 0) {
    usersMap = L.map('company-user-map').setView([60.16, 24.94], 10);

    const tiles = L.tileLayer(tileUrl, { attribution });
    tiles.addTo(usersMap);

    usersMap.on('click', (e) => {
      if (companyLocation.length === 0) {
        companyLocation = new L.Marker([e.latlng.lat, e.latlng.lng]).addTo(
          usersMap
        );
      } else {
        companyLocation.setLatLng([e.latlng.lat, e.latlng.lng]);
      }
    });
  }
});

const clearActiveClass = () => {
  const allBtns = [
    addNewPostBtn,
    mainFeedBtn,
    entrepreneursFeedBtn,
    yourProfileBtn,
  ];
  for (const btn of allBtns) {
    btn.classList.remove('active');
  }
};

const hidePageContent = (allPages) => {
  for (const page of allPages) {
    page.style.display = 'none';
  }
};

// OPENING CARD-MODAL
const cardModal = document.getElementById('card-modal');
const openCardModal = () => {
  cardModal.style.display = 'flex';
};

// CLOSE CARD-MODAL BY CLICKING CROSS
const crossModal = document.querySelector('#close-modal');
crossModal.addEventListener('click', () => {
  cardModal.style.display = 'none';
});

// OPENING COMMENT-MODAL
const commentModal = document.getElementById('comment-modal');
const openCommentModal = () => {
  commentModal.style.display = 'flex';
};

// CLOSE COMMENT-MODAL BY CLICKING CROSS
const crossCommentModal = document.querySelector('#close-comment-modal');
crossCommentModal.addEventListener('click', () => {
  commentModal.style.display = 'none';
});
