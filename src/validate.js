import * as yup from 'yup';
import _ from 'lodash';

export default (url, urls) => {
  const schema = yup.object().shape({
    url: yup.string().url().notOneOf(urls).required(),
  });
  try {
    schema.validateSync(url, { abortEarly: false });
    return {};
  } catch (e) {
    return _.keyBy(e.inner, 'path');
  }
};
