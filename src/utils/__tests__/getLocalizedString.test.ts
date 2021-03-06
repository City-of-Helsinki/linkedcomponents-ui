import getLocalisedString from '../getLocalisedString';

const dummyLocalisedObj = {
  en: 'text en',
  fi: 'text fi',
};

describe('getLocalisedString function', () => {
  it('should return localised string', () => {
    expect(getLocalisedString(dummyLocalisedObj, 'en')).toBe('text en');
    expect(getLocalisedString(dummyLocalisedObj, 'fi')).toBe('text fi');
  });

  it('should return string in backup language value with selected language is not found', () => {
    expect(getLocalisedString(dummyLocalisedObj, 'sv')).toBe('text fi');
  });

  it('should return empty string when object is null', () => {
    expect(getLocalisedString(null, 'en')).toBe('');
  });

  it('should return empty string when object all languages are not defined', () => {
    expect(getLocalisedString({}, 'en')).toBe('');
  });
});
