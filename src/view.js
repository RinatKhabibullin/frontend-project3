import { setLocale } from 'yup';
import i18next from './i18next';

const render = (document, state) => {
  const pageTitle = document.querySelector('h1');
  pageTitle.textContent = i18next.t('texts.title');

  const pageDescription = document.getElementById('rss-desctiption');
  pageDescription.textContent = i18next.t('texts.description');

  const urlInputElement = document.getElementById('rss-input-text');
  urlInputElement.setAttribute('placeholder', i18next.t('texts.link'));

  const urlSubmitButton = document.getElementById('rss-input-submit');
  urlSubmitButton.setAttribute('value', i18next.t('texts.addButton'));

  const rssExample = document.getElementById('rss-example');
  rssExample.textContent = i18next.t('texts.example');

  setLocale({
    mixed: {
      notOneOf: i18next.t('errors.alreadyTracked'),
      required: i18next.t('errors.requiredField'),
    },
    string: {
      url: i18next.t('errors.invalidURL'),
    },
  });

  if (document.querySelector('div.feedbackMessage')) {
    const previousFeedback = document.querySelector('div.feedbackMessage');
    previousFeedback.remove();
  }

  const feedbackRow = document.createElement('div');
  feedbackRow.classList.add('row', 'feedbackMessage');
  const feedbackCol = document.createElement('div');
  feedbackCol.classList.add('col');
  const feedbackMessage = document.createElement('p');
  if (state.rssUrlForm.valid === false) {
    feedbackMessage.textContent = state.rssUrlForm.errors.message;
    feedbackMessage.classList.add('text-danger');
  } else {
    feedbackMessage.textContent = i18next.t('texts.successfully');
    feedbackMessage.classList.add('text-success');
  }
  feedbackCol.append(feedbackMessage);
  feedbackRow.append(feedbackCol);
  const container = document.querySelector('div.container');
  container.append(feedbackRow);

  if (state.rssUrlForm.valid === true) {
    const feedsContainer = document.querySelector('div.feeds');
    feedsContainer.innerHTML = '';
    const postsContainer = document.querySelector('div.posts');
    postsContainer.innerHTML = '';
    const feedsListTitle = document.createElement('h2');
    feedsListTitle.innerText = 'Фиды';
    const postsListTitle = document.createElement('h2');
    postsListTitle.innerText = 'Посты';
    const feedsList = document.createElement('ul');
    feedsList.classList.add('list-group');
    const postsList = document.createElement('ul');
    postsList.classList.add('list-group');
    state.feeds.forEach((feed) => {
      const newFeedsListItem = document.createElement('li');
      newFeedsListItem.classList.add('list-group-item');
      const listFeedsItemTitle = document.createElement('h3');
      listFeedsItemTitle.textContent = feed.feedTitle;
      const listFeedsItemDescription = document.createElement('p');
      listFeedsItemDescription.textContent = feed.feedDescription;
      newFeedsListItem.append(listFeedsItemTitle, listFeedsItemDescription);
      feedsList.append(newFeedsListItem);
    });
    state.posts.forEach((post) => {
      const newPostsListItem = document.createElement('li');
      newPostsListItem.classList.add('list-group-item', 'd-flex', 'justify-content-between');
      const listPostsItemTitle = document.createElement('a');
      listPostsItemTitle.href = post.postLink;
      if (!state.readedPosts.includes(post.guid)) {
        listPostsItemTitle.classList.add('font-weight-bold');
      }
      listPostsItemTitle.addEventListener('click', () => {
        if (!state.readedPosts.includes(post.guid)) {
          state.readedPosts.push(post.guid);
          listPostsItemTitle.classList.remove('font-weight-bold');
        }
      });
      listPostsItemTitle.textContent = post.postTitle;
      listPostsItemTitle.setAttribute('target', '_blank');
      const previewButton = document.createElement('a');
      previewButton.href = '#';
      previewButton.classList.add('btn', 'btn-primary', 'btn-sm');
      previewButton.textContent = i18next.t('modal.previewButtonText');
      previewButton.setAttribute('data-toggle', 'modal');
      previewButton.setAttribute('data-target', '#openModal');
      previewButton.addEventListener('click', () => {
        state.readedPosts.push(post.guid);
        listPostsItemTitle.classList.remove('font-weight-bold');
        const modalTitle = document.querySelector('.modal-title');
        modalTitle.textContent = post.postTitle;
        const modalBody = document.querySelector('.modal-body');
        modalBody.textContent = post.postDescription;
        const readFullPostButton = document.getElementById('readFullPostButton');
        readFullPostButton.textContent = i18next.t('modal.readPost');
        readFullPostButton.href = post.postLink;
        const closeModalButton = document.getElementById('closeModalButton');
        closeModalButton.textContent = i18next.t('modal.closeModal');
      });
      newPostsListItem.append(listPostsItemTitle, previewButton);
      postsList.append(newPostsListItem);
    });
    feedsContainer.append(feedsListTitle, feedsList);
    postsContainer.append(postsListTitle, postsList);
  }
};

export default render;
