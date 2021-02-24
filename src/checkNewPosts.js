import axios from 'axios';
import _ from 'lodash';
import parse from './parse.js';
import render from './view.js';

const checkNewPosts = (state, feed) => {
  setTimeout(() => {
    const posts = state.posts.filter((post) => post.feedId === feed.id);
    const { url } = feed;
    axios.get(url)
      .then((response) => {
        const newPosts = parse(response.data).posts;
        const newPost = _.differenceBy(newPosts, posts, 'guid');
        console.log(newPost);
        newPost.forEach((post) => {
          console.log('post');
          post.feedId = feed.id;
          console.log(post);
          state.posts = [post, ...state.posts];
          render(document, state);
        });
      });
    checkNewPosts(state, feed);
  }, 5000);
};

export default checkNewPosts;
