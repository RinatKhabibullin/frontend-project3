import _ from 'lodash';
import i18next from './i18next';

export default (data, url) => {
  const parser = new DOMParser();
  try {
    const doc = parser.parseFromString(data, 'application/xml');
    const feedTitle = doc.querySelector('title').textContent;
    const feedDescription = doc.querySelector('description').textContent;
    const posts = Array.from(doc.querySelectorAll('item')).map((post) => {
      const postTitle = post.querySelector('title').textContent;
      const postDescription = post.querySelector('description').textContent;
      const postLink = post.querySelector('link').textContent;
      const guid = post.querySelector('guid').textContent;
      return {
        postTitle, postDescription, postLink, guid,
      };
    });
    return {
      feed: {
        feedTitle, url, feedDescription,
      },
      posts,
    };
  } catch (e) {
    throw new Error(i18next.t('errors.resourseNotContainRSS'));
  }
};
