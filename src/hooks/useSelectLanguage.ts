import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';

import { SUPPORTED_LANGUAGES } from '../constants';
import { OptionType } from '../types';
import updateLocaleParam from '../utils/updateLocaleParam';
import useLocale from './useLocale';

type UseSelectLanguageState = {
  languageOptions: OptionType[];
  changeLanguage: (
    language: string,
    event?: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => void;
};

const useSelectLanguage = (): UseSelectLanguageState => {
  const { i18n, t } = useTranslation();
  const locale = useLocale();
  const navigate = useNavigate();
  const location = useLocation();

  const languageOptions: OptionType[] = React.useMemo(() => {
    return Object.values(SUPPORTED_LANGUAGES).map((language) => ({
      label: t(`navigation.languages.${language}`),
      value: language,
    }));
  }, [t]);

  const changeLanguage = async (
    newLanguage: string,
    event?: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    event?.preventDefault();
    await navigate({
      pathname: updateLocaleParam(location.pathname, locale, newLanguage),
      search: location.search,
    });
    i18n.changeLanguage(newLanguage);
  };
  return { changeLanguage, languageOptions };
};

export default useSelectLanguage;
