import onChange from 'on-change';
import axios from 'axios';
import _ from 'lodash';
import validate from './validate.js';
import parse from './parse.js';
import render from './view.js';
import i18next from './i18next';
import checkNewPosts from './checkNewPosts.js';

export default () => {
  const state = {
    rssUrlForm: {
      valid: false,
      url: '',
      errors: {},
    },
    readedPosts: [],
    feeds: [],
    posts: [],
  };

  const watchedState = onChange(state, (path, value) => {
    if (path === 'rssUrlForm.url') {
      state.rssUrlForm.url = value;
      const errors = validate({ url: value }, state.feeds.map((feed) => feed.url));
      state.rssUrlForm.valid = _.isEqual(errors, {});
      state.rssUrlForm.errors = errors.url;

      if (state.rssUrlForm.valid === false) {
        render(document, state);
      }

      if (state.rssUrlForm.valid === true) {
        axios.get(value)
          .then((response) => {
            const { feed, posts } = parse(response.data, value);
            feed.id = _.uniqueId();
            state.feeds = [...state.feeds, feed];
            posts.forEach((post) => {
              post.feedId = feed.id;
            });
            state.posts = _.flatten([posts, ...state.posts]);
            checkNewPosts(watchedState, feed);
            render(document, state);
          })
          .catch((error) => {
            state.rssUrlForm.valid = false;
            state.rssUrlForm.errors = error;
            render(document, state);
          });
      }
    }
    if (path === 'posts') {
      state.rssUrlForm.valid = true;
      render(document, state);
    }
  });

  const form = document.getElementById('rss-input-form');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    watchedState.rssUrlForm.url = formData.get('url');
  });

  const languageButtons = Array.from(document.querySelectorAll('input.language-btn'));
  languageButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const language = e.target.id;
      Array.from(e.target.parentElement.parentElement.children).forEach((el) => {
        el.classList.remove('active');
      });
      e.target.parentElement.classList.add('active');
      i18next
        .changeLanguage(language)
        .then(() => {
          render(document, state);
        });
    });
  });

  render(document, state);
};
