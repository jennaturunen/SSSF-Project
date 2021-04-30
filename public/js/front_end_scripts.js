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
});

yourProfileBtn.addEventListener('click', () => {
  yourProfilePage.style.display = 'flex';
  hidePageContent([mainFeedPage, entrepreneursFeedPage, addNewPostPage]);
  clearActiveClass();
  yourProfileBtn.classList.toggle('active');
  if (!userPostsContainer.hasChildNodes()) {
    getUserDataAndPosts();
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
