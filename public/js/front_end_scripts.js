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

const toggleNavBtns = [
  addNewPostBtn,
  mainFeedBtn,
  entrepreneursFeedBtn,
  yourProfileBtn,
];

addNewPostBtn.addEventListener('click', () => {
  addNewPostPage.style.display = 'flex';
  const otherPages = [mainFeedPage, entrepreneursFeedPage, yourProfilePage];
  for (const page of otherPages) {
    page.style.display = 'none';
  }

  for (const btn of toggleNavBtns) {
    btn.classList.toggle('active');
  }
});

mainFeedBtn.addEventListener('click', () => {
  mainFeedPage.style.display = 'flex';
  const otherPages = [addNewPostPage, entrepreneursFeedPage, yourProfilePage];
  for (const page of otherPages) {
    page.style.display = 'none';
  }

  for (const btn of toggleNavBtns) {
    btn.classList.toggle('active');
  }
});

entrepreneursFeedBtn.addEventListener('click', () => {
  entrepreneursFeedPage.style.display = 'flex';
  const otherPages = [mainFeedPage, addNewPostPage, yourProfilePage];
  for (const page of otherPages) {
    page.style.display = 'none';
  }

  for (const btn of toggleNavBtns) {
    btn.classList.toggle('active');
  }
});

yourProfileBtn.addEventListener('click', () => {
  yourProfilePage.style.display = 'flex';
  const otherPages = [mainFeedPage, entrepreneursFeedPage, addNewPostPage];
  for (const page of otherPages) {
    page.style.display = 'none';
  }

  for (const btn of toggleNavBtns) {
    btn.classList.toggle('active');
  }
});
