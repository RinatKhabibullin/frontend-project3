import i18next from './i18next';

export default (data) => {
  const parser = new DOMParser();
  try {
    const doc = parser.parseFromString(data, 'application/xml');
    const feedTitle = doc.querySelector('title').textContent;
    const feedDescription = doc.querySelector('description').textContent;
    const posts = Array.from(doc.querySelectorAll('item')).map((post) => {
      const postTitle = post.querySelector('title').textContent;
      const postDescription = post.querySelector('description').textContent;
      const postLink = post.querySelector('link').textContent;
      return { postTitle, postDescription, postLink };
    });
    return { feedTitle, feedDescription, posts };
  } catch (e) {
    throw new Error(i18next.t('errors.resourseNotContainRSS'));
  }
};
