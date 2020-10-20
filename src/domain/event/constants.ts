export const EVENT_INFO_LANGUAGES = ['fi', 'sv', 'en', 'ru', 'zh_hans', 'ar'];

export enum EVENT_TYPE {
  COURSE = 'course',
  EVENT = 'event',
}

export const EVENT_INITIALVALUES = {
  type: EVENT_TYPE.EVENT,
  eventInfoLanguages: ['fi'],
  inLanguage: ['fi'],
};
