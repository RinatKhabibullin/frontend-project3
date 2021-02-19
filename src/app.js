import onChange from 'on-change';
import axios from 'axios';
import _ from 'lodash';
import validate from './validate.js';
import parse from './parse.js';
import render from './view.js';
import i18next from './i18next';

export default () => {
  const state = {
    rssUrlForm: {
      valid: false,
      url: '',
      errors: {},
    },
    urls: [],
    rss: [],
  };

  const watchedState = onChange(state, (path, value) => {
    if (path === 'rssUrlForm.url') {
      state.rssUrlForm.url = value;
      const errors = validate({ url: value }, state.urls);
      state.rssUrlForm.valid = _.isEqual(errors, {});
      state.rssUrlForm.errors = errors.url;

      if (state.rssUrlForm.valid === false) {
        render(document, state);
      }

      if (state.rssUrlForm.valid === true) {
        axios.get(value)
          .then((response) => {
            state.rss = [...state.rss, parse(response.data)];
            render(document, state);
            state.urls = [...state.urls, value];
          })
          .catch((error) => {
            state.rssUrlForm.valid = false;
            state.rssUrlForm.errors = error;
            render(document, state);
          });
      }
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
