import i18next from 'i18next';
import resources from '../locales';

i18next.init({
  lng: 'en',
  debug: false,
  resources,
});

export default i18next;
