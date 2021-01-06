import useLocale from './useLocale';

const useTimeFormat = (): string => {
  const locale = useLocale();

  switch (locale) {
    case 'en':
      return 'h:mm aaaa';
    case 'sv':
      return 'HH:mm';
    case 'fi':
    default:
      return 'HH.mm';
  }
};

export default useTimeFormat;
