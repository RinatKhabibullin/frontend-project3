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
      newPostsListItem.classList.add('list-group-item');
      const listPostsItemTitle = document.createElement('a');
      listPostsItemTitle.href = post.postLink;
      listPostsItemTitle.textContent = post.postTitle;
      newPostsListItem.append(listPostsItemTitle);
      postsList.append(newPostsListItem);
    });
    feedsContainer.append(feedsListTitle, feedsList);
    postsContainer.append(postsListTitle, postsList);
  }
};

export default render;
